// models/Vote.ts
import mongoose, { Document, Schema } from "mongoose";

// TypeScript interface
export interface IVote extends Document {
  phone: string;
  nominee: mongoose.Types.ObjectId;
  category: mongoose.Types.ObjectId;
  fingerprint?: string;
  ip?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Vote schema
const voteSchema = new Schema<IVote>(
  {
    phone: {
      type: String,
      required: true, // phone is already validated by API
    },
    nominee: {
      type: Schema.Types.ObjectId,
      ref: "Nominee",
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    fingerprint: {
      type: String,
    },
    ip: {
      type: String,
    },
    userAgent: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent multiple votes per phone per category
voteSchema.index({ phone: 1, category: 1 }, { unique: true });

// Prevent multiple votes per device fingerprint per category
voteSchema.index(
  { fingerprint: 1, category: 1 },
  { unique: true, partialFilterExpression: { fingerprint: { $exists: true } } }
);

// Optional: index for faster queries by category
voteSchema.index({ category: 1 });

// Model creation (avoid recompiling in dev)
const Vote = mongoose.models.Vote || mongoose.model<IVote>("Vote", voteSchema);

export default Vote;
