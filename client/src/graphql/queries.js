import { gql } from '@apollo/client';

export const ME_QUERY = gql`
  query Me {
    me {
      id
      username
      email
      role
    }
  }
`;

export const GET_USERS = gql`
  query GetUsers {
    getUsers {
      id
      username
      email
      role
      createdAt
    }
  }
`;

export const GET_PLAYERS = gql`
  query GetPlayers {
    getPlayers {
      id
      ranking
      wins
      losses
      user {
        id
        username
        email
      }
      tournaments {
        id
        name
        game
        status
        date
      }
    }
  }
`;

export const GET_MY_PLAYER = gql`
  query GetMyPlayer {
    getMyPlayer {
      id
      ranking
      wins
      losses
      user {
        id
        username
        email
      }
      tournaments {
        id
        name
        game
        status
        date
        players {
          id
          user { username }
        }
      }
    }
  }
`;

export const GET_TOURNAMENTS = gql`
  query GetTournaments {
    getTournaments {
      id
      name
      game
      date
      status
      createdAt
      players {
        id
        ranking
        user {
          id
          username
        }
      }
    }
  }
`;

export const GET_UPCOMING_TOURNAMENTS = gql`
  query GetUpcomingTournaments {
    getUpcomingTournaments {
      id
      name
      game
      date
      status
      players {
        id
        user { username }
      }
    }
  }
`;

export const GET_MY_TOURNAMENTS = gql`
  query GetMyTournaments {
    getMyTournaments {
      id
      name
      game
      date
      status
      players {
        id
        user { username }
      }
    }
  }
`;

export const GET_TOURNAMENT_BY_ID = gql`
  query GetTournamentById($id: ID!) {
    getTournamentById(id: $id) {
      id
      name
      game
      date
      status
      players {
        id
        ranking
        user { id username }
      }
    }
  }
`;
