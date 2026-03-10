import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    ranking: {
      type: Number,
      default: 1000,
    },
    tournaments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tournament',
      },
    ],
    wins: {
      type: Number,
      default: 0,
    },
    losses: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Player = mongoose.model('Player', playerSchema);
export default Player;
