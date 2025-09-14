// models/Vote.ts
import mongoose, { Document, Schema } from "mongoose";
import { parsePhoneNumberFromString } from "libphonenumber-js";

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
      required: true,
      set: (v: string): string => {
        const number = parsePhoneNumberFromString(v);
        return number?.isValid() ? number.format("E.164") : v;
      },
      validate: {
        validator: (v: string): boolean =>
          parsePhoneNumberFromString(v)?.isValid() ?? false,
        message: (props: { value: string }): string =>
          `${props.value} is not a valid international phone number!`,
      },
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
    timestamps: true, // adds createdAt and updatedAt
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
