/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Document, Schema } from "mongoose";

export interface IVote extends Document {
  phone: string;
  nominee: mongoose.Types.ObjectId;
  category: mongoose.Types.ObjectId;

  // device/session fields
  deviceSession?: string; // server-set HttpOnly cookie token
  deviceHash?: string; // lightweight device heuristic (optional)

  ip?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

const voteSchema = new Schema<IVote>(
  {
    phone: { type: String, required: true },
    nominee: { type: Schema.Types.ObjectId, ref: "Nominee", required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },

    // Device/session fields
    deviceSession: { type: String, index: true },
    deviceHash: { type: String },

    ip: { type: String },
    userAgent: { type: String },
  },
  { timestamps: true }
);

// === Indexes ===
// One vote per phone per category (primary rule)
voteSchema.index({ phone: 1, category: 1 }, { unique: true });

// Enforce one vote per deviceSession per category (applies only when deviceSession exists)
voteSchema.index(
  { deviceSession: 1, category: 1 },
  { unique: true, sparse: true }
);

// For quick device-based correlation (non-unique)
voteSchema.index({ deviceHash: 1, category: 1 });

// Optional: speed up queries
voteSchema.index({ category: 1 });
voteSchema.index({ createdAt: -1 });
voteSchema.index({ phone: 1 });

// Cleaner handling of blank strings for optional fields
voteSchema.pre("save", function (next) {
  // Use `this` as plain object here (Mongoose Document)
  const doc = this as IVote & { [k: string]: any };

  if (
    !doc.deviceSession ||
    doc.deviceSession === "undefined" ||
    doc.deviceSession === "null" ||
    (typeof doc.deviceSession === "string" && doc.deviceSession.trim() === "")
  ) {
    doc.deviceSession = undefined;
  }

  if (
    !doc.deviceHash ||
    doc.deviceHash === "undefined" ||
    doc.deviceHash === "null" ||
    (typeof doc.deviceHash === "string" && doc.deviceHash.trim() === "")
  ) {
    doc.deviceHash = undefined;
  }

  next();
});

// Model creation (avoid recompiling in dev)
const Vote = mongoose.models.Vote || mongoose.model<IVote>("Vote", voteSchema);

export default Vote;
