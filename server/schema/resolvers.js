import User from '../models/User.js';
import Player from '../models/Player.js';
import Tournament from '../models/Tournament.js';
import { generateToken, setTokenCookie, clearTokenCookie } from '../middleware/auth.js';
import { GraphQLError } from 'graphql';

const requireAuth = (user) => {
  if (!user) throw new GraphQLError('Not authenticated. Please log in.', {
    extensions: { code: 'UNAUTHENTICATED' },
  });
};

const requireAdmin = (user) => {
  requireAuth(user);
  if (user.role !== 'Admin') throw new GraphQLError('Access denied. Admin only.', {
    extensions: { code: 'FORBIDDEN' },
  });
};

export const resolvers = {
  Query: {
    // ── Auth ─
    me: async (_, __, { user }) => {
      requireAuth(user);
      return user;
    },

    // ── Users ─
    getUsers: async (_, __, { user }) => {
      requireAdmin(user);
      return await User.find({});
    },
    getUserById: async (_, { id }, { user }) => {
      requireAdmin(user);
      return await User.findById(id);
    },

    // ── Players ─
    getPlayers: async (_, __, { user }) => {
      requireAuth(user);
      return await Player.find({}).populate('user').populate('tournaments');
    },
    getPlayerById: async (_, { id }, { user }) => {
      requireAuth(user);
      return await Player.findById(id).populate('user').populate('tournaments');
    },
    getMyPlayer: async (_, __, { user }) => {
      requireAuth(user);
      return await Player.findOne({ user: user._id }).populate('user').populate({
        path: 'tournaments',
        populate: { path: 'players', populate: { path: 'user' } },
      });
    },

    // ── Tournaments ───────
    getTournaments: async (_, __, { user }) => {
      requireAuth(user);
      return await Tournament.find({}).populate({ path: 'players', populate: { path: 'user' } });
    },
    getTournamentById: async (_, { id }, { user }) => {
      requireAuth(user);
      return await Tournament.findById(id).populate({ path: 'players', populate: { path: 'user' } });
    },
    getUpcomingTournaments: async (_, __, { user }) => {
      requireAuth(user);
      return await Tournament.find({ status: 'Upcoming' }).populate({
        path: 'players', populate: { path: 'user' },
      });
    },
    getMyTournaments: async (_, __, { user }) => {
      requireAuth(user);
      const player = await Player.findOne({ user: user._id }).populate({
        path: 'tournaments',
        populate: { path: 'players', populate: { path: 'user' } },
      });
      if (!player) return [];
      return player.tournaments;
    },
  },

  Mutation: {
    // ── Auth ──────────────
    register: async (_, { username, email, password, role = 'Player' }, { res }) => {
      const existing = await User.findOne({ $or: [{ email }, { username }] });
      if (existing) throw new GraphQLError('User with that email or username already exists.');

      const user = await User.create({ username, email, password, role });

      // Create player profile automatically if role is Player
      if (role === 'Player') {
        await Player.create({ user: user._id });
      }

      const token = generateToken(user._id.toString());
      setTokenCookie(res, token);
      return { token, user };
    },

    login: async (_, { email, password }, { res }) => {
      const user = await User.findOne({ email });
      if (!user || !(await user.matchPassword(password))) {
        throw new GraphQLError('Invalid email or password.');
      }
      const token = generateToken(user._id.toString());
      setTokenCookie(res, token);
      return { token, user };
    },

    logout: async (_, __, { res }) => {
      clearTokenCookie(res);
      return 'Logged out successfully.';
    },

    // ── Admin: User management ───
    createUser: async (_, { username, email, password, role }, { user }) => {
      requireAdmin(user);
      const existing = await User.findOne({ $or: [{ email }, { username }] });
      if (existing) throw new GraphQLError('User already exists.');
      const newUser = await User.create({ username, email, password, role });
      if (role === 'Player') {
        await Player.create({ user: newUser._id });
      }
      return newUser;
    },

    deleteUser: async (_, { id }, { user }) => {
      requireAdmin(user);
      await Player.deleteOne({ user: id });
      await User.findByIdAndDelete(id);
      return 'User deleted successfully.';
    },

    // ── Admin: Tournament management ─────
    createTournament: async (_, args, { user }) => {
      requireAdmin(user);
      return await Tournament.create(args);
    },

    updateTournament: async (_, { id, ...updates }, { user }) => {
      requireAdmin(user);
      return await Tournament.findByIdAndUpdate(id, updates, { new: true })
        .populate({ path: 'players', populate: { path: 'user' } });
    },

    deleteTournament: async (_, { id }, { user }) => {
      requireAdmin(user);
      await Tournament.findByIdAndDelete(id);
      // Remove tournament reference from players
      await Player.updateMany({ tournaments: id }, { $pull: { tournaments: id } });
      return 'Tournament deleted successfully.';
    },

    assignPlayerToTournament: async (_, { tournamentId, playerId }, { user }) => {
      requireAdmin(user);
      const tournament = await Tournament.findById(tournamentId);
      if (!tournament) throw new GraphQLError('Tournament not found.');
      const player = await Player.findById(playerId);
      if (!player) throw new GraphQLError('Player not found.');

      if (!tournament.players.includes(playerId)) {
        tournament.players.push(playerId);
        await tournament.save();
      }
      if (!player.tournaments.includes(tournamentId)) {
        player.tournaments.push(tournamentId);
        await player.save();
      }
      return Tournament.findById(tournamentId).populate({ path: 'players', populate: { path: 'user' } });
    },

    removePlayerFromTournament: async (_, { tournamentId, playerId }, { user }) => {
      requireAdmin(user);
      await Tournament.findByIdAndUpdate(tournamentId, { $pull: { players: playerId } });
      await Player.findByIdAndUpdate(playerId, { $pull: { tournaments: tournamentId } });
      return Tournament.findById(tournamentId).populate({ path: 'players', populate: { path: 'user' } });
    },

    // ── Player mutations ──
    joinTournament: async (_, { tournamentId }, { user }) => {
      requireAuth(user);
      const player = await Player.findOne({ user: user._id });
      if (!player) throw new GraphQLError('Player profile not found.');

      const tournament = await Tournament.findById(tournamentId);
      if (!tournament) throw new GraphQLError('Tournament not found.');
      if (tournament.status !== 'Upcoming') throw new GraphQLError('Can only join upcoming tournaments.');
      if (tournament.players.length >= tournament.maxPlayers) throw new GraphQLError('Tournament is full.');

      if (!player.tournaments.includes(tournamentId)) {
        player.tournaments.push(tournamentId);
        await player.save();
      }
      if (!tournament.players.includes(player._id)) {
        tournament.players.push(player._id);
        await tournament.save();
      }

      return Player.findById(player._id).populate('user').populate({
        path: 'tournaments', populate: { path: 'players', populate: { path: 'user' } },
      });
    },

    leaveTournament: async (_, { tournamentId }, { user }) => {
      requireAuth(user);
      const player = await Player.findOne({ user: user._id });
      if (!player) throw new GraphQLError('Player profile not found.');

      await Player.findByIdAndUpdate(player._id, { $pull: { tournaments: tournamentId } });
      await Tournament.findByIdAndUpdate(tournamentId, { $pull: { players: player._id } });

      return Player.findById(player._id).populate('user').populate('tournaments');
    },

    updatePlayerRanking: async (_, { playerId, ranking }, { user }) => {
      requireAdmin(user);
      return await Player.findByIdAndUpdate(playerId, { ranking }, { new: true }).populate('user').populate('tournaments');
    },
  },
};
