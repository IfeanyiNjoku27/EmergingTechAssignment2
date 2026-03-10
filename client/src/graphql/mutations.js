import { gql } from '@apollo/client';

export const REGISTER_MUTATION = gql`
  mutation Register($username: String!, $email: String!, $password: String!, $role: String) {
    register(username: $username, email: $email, password: $password, role: $role) {
      token
      user {
        id
        username
        email
        role
      }
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        username
        email
        role
      }
    }
  }
`;

export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;

export const CREATE_USER_MUTATION = gql`
  mutation CreateUser($username: String!, $email: String!, $password: String!, $role: String!) {
    createUser(username: $username, email: $email, password: $password, role: $role) {
      id
      username
      email
      role
    }
  }
`;

export const DELETE_USER_MUTATION = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

export const CREATE_TOURNAMENT_MUTATION = gql`
  mutation CreateTournament($name: String!, $game: String!, $date: String!, $status: String) {
    createTournament(name: $name, game: $game, date: $date, status: $status) {
      id
      name
      game
      date
      status
    }
  }
`;

export const UPDATE_TOURNAMENT_MUTATION = gql`
  mutation UpdateTournament($id: ID!, $name: String, $game: String, $date: String, $status: String) {
    updateTournament(id: $id, name: $name, game: $game, date: $date, status: $status, ) {
      id
      name
      game
      date
      status
    }
  }
`;

export const DELETE_TOURNAMENT_MUTATION = gql`
  mutation DeleteTournament($id: ID!) {
    deleteTournament(id: $id)
  }
`;

export const ASSIGN_PLAYER_MUTATION = gql`
  mutation AssignPlayerToTournament($tournamentId: ID!, $playerId: ID!) {
    assignPlayerToTournament(tournamentId: $tournamentId, playerId: $playerId) {
      id
      name
      players {
        id
        user { username }
      }
    }
  }
`;

export const REMOVE_PLAYER_FROM_TOURNAMENT = gql`
  mutation RemovePlayerFromTournament($tournamentId: ID!, $playerId: ID!) {
    removePlayerFromTournament(tournamentId: $tournamentId, playerId: $playerId) {
      id
      name
      players {
        id
        user { username }
      }
    }
  }
`;

export const JOIN_TOURNAMENT_MUTATION = gql`
  mutation JoinTournament($tournamentId: ID!) {
    joinTournament(tournamentId: $tournamentId) {
      id
      ranking
      tournaments {
        id
        name
        game
        status
      }
    }
  }
`;

export const LEAVE_TOURNAMENT_MUTATION = gql`
  mutation LeaveTournament($tournamentId: ID!) {
    leaveTournament(tournamentId: $tournamentId) {
      id
      tournaments {
        id
        name
      }
    }
  }
`;

export const UPDATE_PLAYER_RANKING_MUTATION = gql`
  mutation UpdatePlayerRanking($playerId: ID!, $ranking: Int!) {
    updatePlayerRanking(playerId: $playerId, ranking: $ranking) {
      id
      ranking
      user { username }
    }
  }
`;
