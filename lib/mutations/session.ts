import { gql } from '@apollo/client';

export const FETCH_LAST_TEN_SESSIONS = gql`
  query FetchLastTenSessions {
    lastTenSessions {
      id
      startTime
      endTime
      handCount
      shoeCount
      profit
      decks
      numSpots
      penetration
      sixFive
      stand17
    }
  }
`;

export const FETCH_ACTIVE_SESSION = gql`
  query FetchActiveSession {
    activeSession {
      id
      startTime
      endTime
      handCount
      shoeCount
      profit
      decks
      numSpots
      penetration
      sixFive
      stand17
    }
  }
`;

export const CREATE_SESSION = gql`
  mutation CreateSession($input: CreateSessionInput!) {
    createSession(input: $input) {
      session {
        id
        startTime
        decks
        numSpots
        penetration
        sixFive
        stand17
      }
      errors
    }
  }
`;

export const CONTINUE_SESSION = gql`
  mutation ContinueSession($sessionId: ID!) {
    continueSession(sessionId: $sessionId) {
      id
      startTime
    }
  }
`;

export const END_SESSION = gql`
  mutation EndSession($id: ID!) {
    endSession(input: { id: $input}) {
      session {
        id
        endTime
      }
      errors
    }
  }
`;