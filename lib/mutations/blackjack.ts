import { gql } from '@apollo/client';

export const DEAL_HAND = gql`
  mutation DealHand($sessionId: ID!, $spots: [SpotInput!]!) {
    dealHand(input: {sessionId: $sessionId, spots: $spots}) {
      success
      errors
      hand {
        id
        dealerCards
        insuranceOffered
        currentSpotId
        spots {
          id
          spotNumber
          playerCards
          splitOffered
          isBlackjack
          result
          profit
        }
      }
    }
  }
`;

export const UPDATE_INSURANCE = gql`
  mutation UpdateInsurance($spotId: ID!, $insurance: Boolean!) {
    updateInsurance(input: {spotId: $spotId, insurance: $insurance}) {
      spot {
        id
        insurance
      }
      errors
    }
  }
`;

export const PLAYER_ACTIONS = gql`
  mutation PlayerActions($spotId: ID!, $action: String!) {
    playerActions(input: {spotId: $spotId, action: $action}) {
      spot {
        id
        spotNumber
        wager
        playerCards
        insurance
        result
        profit
        insuranceResult
        split
        double
        splitOffered
        isBlackjack
        isBust
        hand {
          id
          currentSpotId
          dealerCards
        }
      }
      errors
    }
  }
`;

export const INSURE_SPOTS = gql`
  mutation InsureSpots($spots: [SpotInsuranceInput!]!) {
    insureSpots(input: {spots: $spots}) {
      spots {
        id
        insurance
      }
      errors
    }
  }
`;

export const INTERMEDIATE_ACTIONS = gql`
  mutation IntermediateActions($handId: ID!) {
    intermediateActions(input: {handId: $handId}) {
      hand {
        id
        dealerCards
        currentSpotId
        spots {
          id
          insurance
          insuranceResult
          profit
          result
        }
      }
      errors
    }
  }
`;

export const DEALER_ACTIONS = gql`
  mutation DealerActions($handId: ID!) {
    dealerActions(input: {handId: $handId}) {
      hand {
        id
        dealerCards
        currentSpotId
        spots {
          id
          insurance
          insuranceResult
          profit
          result
        }
        shoe {
          discardedCards
          shuffle
        }
        session {
          shoeCount
          profit
          handCount
          spotCount
        }
      }
      errors
    }
  }
`;