import mongoose, { Document, Schema } from "mongoose";

export interface IVote extends Document {
  phone: string;
  nominee: mongoose.Types.ObjectId;
  category: mongoose.Types.ObjectId;

  // Device / session identifiers
  deviceSession?: string; // Server-set HttpOnly cookie token
  deviceHash?: string; // Unique hashed fingerprint per browser/device

  ip?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

const VoteSchema = new Schema<IVote>(
  {
    phone: { type: String, required: true },
    nominee: { type: Schema.Types.ObjectId, ref: "Nominee", required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },

    deviceSession: { type: String, index: true },
    deviceHash: { type: String, index: true },

    ip: { type: String },
    userAgent: { type: String },
  },
  { timestamps: true }
);

/**
 * 📦 Indexes
 * -----------------------------
 * 1️⃣ One vote per phone per category (main rule)
 * 2️⃣ One vote per device session per category
 * 3️⃣ One vote per device fingerprint per category
 * 4️⃣ Performance indexes for frequent queries
 */
VoteSchema.index({ phone: 1, category: 1 }, { unique: true });
VoteSchema.index(
  { deviceSession: 1, category: 1 },
  { unique: true, sparse: true }
);
VoteSchema.index(
  { deviceHash: 1, category: 1 },
  { unique: true, sparse: true }
);
VoteSchema.index({ category: 1 });
VoteSchema.index({ createdAt: -1 });
VoteSchema.index({ phone: 1 });

/**
 * 🧹 Pre-save cleanup
 * Ensures empty or invalid optional fields are stored as undefined.
 */
VoteSchema.pre("save", function (next) {
  const doc = this as IVote;

  if (
    !doc.deviceSession ||
    ["undefined", "null", ""].includes(doc.deviceSession)
  )
    doc.deviceSession = undefined;

  if (!doc.deviceHash || ["undefined", "null", ""].includes(doc.deviceHash))
    doc.deviceHash = undefined;

  next();
});

export default mongoose.models.Vote ||
  mongoose.model<IVote>("Vote", VoteSchema);
