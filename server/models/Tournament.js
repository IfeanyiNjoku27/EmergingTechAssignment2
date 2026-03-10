import mongoose from 'mongoose';

const tournamentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tournament name is required'],
      trim: true,
    },
    game: {
      type: String,
      required: [true, 'Game name is required'],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Tournament date is required'],
    },
    players: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
      },
    ],
    status: {
      type: String,
      enum: ['Upcoming', 'Ongoing', 'Completed'],
      default: 'Upcoming',
    },
  },
  { timestamps: true }
);

const Tournament = mongoose.model('Tournament', tournamentSchema);
export default Tournament;
