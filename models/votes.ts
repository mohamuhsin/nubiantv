import mongoose, { Document, Schema } from "mongoose";

// TypeScript interface
export interface IVote extends Document {
  phone: string;
  nominee: mongoose.Types.ObjectId;
  category: mongoose.Types.ObjectId;
  ip?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Vote schema
const voteSchema = new Schema<IVote>(
  {
    phone: { type: String, required: true },
    nominee: { type: Schema.Types.ObjectId, ref: "Nominee", required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    ip: { type: String },
    userAgent: { type: String },
  },
  { timestamps: true }
);

// ✅ Unique index — one vote per phone per category
voteSchema.index({ phone: 1, category: 1 }, { unique: true });

// Optional: speed up queries
voteSchema.index({ category: 1 });
voteSchema.index({ createdAt: -1 });
voteSchema.index({ phone: 1 });

// Model creation (avoid recompiling in dev)
const Vote = mongoose.models.Vote || mongoose.model<IVote>("Vote", voteSchema);

export default Vote;
