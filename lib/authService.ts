import { ApolloClient, gql, ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import Cookies from 'js-cookie';

const SIGN_UP = gql`
  mutation SignUp($email: String!, $password: String!) {
    signUp(input: { email: $email, password: $password }) {
      token
      user {
        id
        email
      }
    }
  }
`;

const SIGN_IN = gql`
  mutation SignIn($email: String!, $password: String!) {
    signIn(input: { email: $email, password: $password }) {
      token
      user {
        id
        email
      }
    }
  }
`;

const SIGN_OUT = gql`
  mutation SignOut {
    signOut {
      success
    }
  }
`;

const REFRESH_TOKEN = gql`
  mutation RefreshToken {
    refreshToken {
      token
    }
  }
`;

export const authService = {
  signUp: async (client: ApolloClient<any>, email: string, password: string) => {
    const { data } = await client.mutate({
      mutation: SIGN_UP,
      variables: { email, password },
    });
    if (data?.signUp?.token) {
      Cookies.set('token', data.signUp.token, { expires: 7 });  // Set to expire in 7 days
      return data.signUp.user;
    }
    return null;
  },

  signIn: async (client: ApolloClient<any>, email: string, password: string) => {
    const { data } = await client.mutate({
      mutation: SIGN_IN,
      variables: { email, password },
    });
    if (data?.signIn?.token) {
      Cookies.set('token', data.signIn.token, { expires: 7 });  // Set to expire in 7 days
      return data.signIn.user;
    }
    return null;
  },

  signOut: async (client: ApolloClient<any>) => {
    const { data } = await client.mutate({ mutation: SIGN_OUT });
    if (data?.signOut?.success) {
      Cookies.remove('token');
      await client.resetStore();
      return true;
    }
    return false;
  },

  refreshToken: async (client: ApolloClient<any>) => {
    try {
      const { data } = await client.mutate({ mutation: REFRESH_TOKEN });
      if (data?.refreshToken?.token) {
        localStorage.setItem('token', data.refreshToken.token);
        
        // Update Apollo Client's authorization header
        const newAuthLink = setContext((_, { headers }) => ({
          headers: {
            ...headers,
            authorization: `Bearer ${data.refreshToken.token}`,
          }
        }));

        client.setLink(ApolloLink.from([newAuthLink, client.link]));
        
        return true;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }
    return false;
  },

  getToken: () => Cookies.get('token'),

  isLoggedIn: () => !!Cookies.get('token'),
}

export const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? `Bearer ${token}` : '';
};

export const setupTokenRefresh = (client: ApolloClient<any>) => {
  // Refresh token every 50 minutes (assuming your token expires after 1 hour)
  setInterval(() => {
    if (authService.isLoggedIn()) {
      authService.refreshToken(client);
    }
  }, 50 * 60 * 1000);
};


