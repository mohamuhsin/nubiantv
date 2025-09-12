/* eslint-disable @typescript-eslint/no-explicit-any */
// models/Vote.ts
"use client";

import mongoose, { Document, Schema } from "mongoose";
import { parsePhoneNumberFromString } from "libphonenumber-js";

// Interface for TypeScript
export interface IVote extends Document {
  phone: string;
  nominee: mongoose.Types.ObjectId;
  category: mongoose.Types.ObjectId;
  fingerprint?: string;
  ip?: string;
  userAgent?: string;
  status: "pending" | "verified";
  createdAt: Date;
  updatedAt: Date;
}

// Schema definition
const voteSchema = new Schema<IVote>(
  {
    phone: {
      type: String,
      required: true,
      set: (v: string) => {
        // Normalize phone to E.164 format
        const number = parsePhoneNumberFromString(v);
        if (!number || !number.isValid()) return v;
        return number.format("E.164");
      },
      validate: {
        validator: (v: string) => {
          const number = parsePhoneNumberFromString(v);
          return number?.isValid() ?? false;
        },
        message: (props: any) =>
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
    status: {
      type: String,
      enum: ["pending", "verified"],
      default: "verified",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for preventing duplicate votes per category
voteSchema.index({ phone: 1, category: 1 }, { unique: true });
voteSchema.index(
  { fingerprint: 1, category: 1 },
  { unique: true, partialFilterExpression: { fingerprint: { $exists: true } } }
);

// Optional: index for faster query of votes per category
voteSchema.index({ category: 1, status: 1 });

// Optional: index for IP analytics
voteSchema.index({ ip: 1, category: 1 });

// Model creation
const Vote = mongoose.models.Vote || mongoose.model<IVote>("Vote", voteSchema);

export default Vote;
