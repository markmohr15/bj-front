import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from "@apollo/client/link/error";
import { authService, getAuthHeader, setupTokenRefresh } from './authService';

const httpLink = new HttpLink({
  uri: 'http://localhost:3000/graphql', // Update this with your GraphQL endpoint
});

const authLink = setContext(async (_, { headers }) => {
  const token = authService.getToken();
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    for (let err of graphQLErrors) {
      switch (err.extensions.code) {
        case 'UNAUTHENTICATED':
          return new Observable(observer => {
            authService.refreshToken(client)
              .then(success => {
                if (success) {
                  const oldHeaders = operation.getContext().headers;
                  operation.setContext({
                    headers: {
                      ...oldHeaders,
                      authorization: getAuthHeader(),
                    },
                  });
                  observer.next(forward(operation));
                } else {
                  authService.signOut(client);
                  observer.error(err);
                }
              })
              .catch(() => {
                authService.signOut(client);
                observer.error(err);
              });
          });
      }
    }
  }
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

export const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache()
});

setupTokenRefresh(client);

