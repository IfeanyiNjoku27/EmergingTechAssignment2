export const typeDefs = `#graphql
  type User {
    id: ID!
    username: String!
    email: String!
    role: String!
    createdAt: String
  }

  type Player {
    id: ID!
    user: User!
    ranking: Int!
    tournaments: [Tournament]
    wins: Int!
    losses: Int!
  }

  type Tournament {
    id: ID!
    name: String!
    game: String!
    date: String!
    players: [Player]
    status: String!
    maxPlayers: Int!
    prizePool: String!
    createdAt: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  # Queries
  type Query {
    # User queries
    me: User
    getUsers: [User]
    getUserById(id: ID!): User

    # Player queries
    getPlayers: [Player]
    getPlayerById(id: ID!): Player
    getMyPlayer: Player

    # Tournament queries
    getTournaments: [Tournament]
    getTournamentById(id: ID!): Tournament
    getUpcomingTournaments: [Tournament]
    getMyTournaments: [Tournament]
  }

  # Mutations
  type Mutation {
    # Auth mutations
    register(username: String!, email: String!, password: String!, role: String): AuthPayload
    login(email: String!, password: String!): AuthPayload
    logout: String

    # Admin: User management
    createUser(username: String!, email: String!, password: String!, role: String!): User
    deleteUser(id: ID!): String

    # Admin: Tournament management
    createTournament(name: String!, game: String!, date: String!, maxPlayers: Int, prizePool: String, status: String): Tournament
    updateTournament(id: ID!, name: String, game: String, date: String, status: String, maxPlayers: Int, prizePool: String): Tournament
    deleteTournament(id: ID!): String
    assignPlayerToTournament(tournamentId: ID!, playerId: ID!): Tournament
    removePlayerFromTournament(tournamentId: ID!, playerId: ID!): Tournament

    # Player mutations
    joinTournament(tournamentId: ID!): Player
    leaveTournament(tournamentId: ID!): Player
    updatePlayerRanking(playerId: ID!, ranking: Int!): Player
  }
`;
