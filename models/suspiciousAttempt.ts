import mongoose, { Document, Schema } from "mongoose";

export interface ISuspiciousAttempt extends Document {
  ip?: string;
  phone?: string;
  category?: mongoose.Types.ObjectId;
  userAgent?: string;
  reason: string;
  createdAt: Date;
}

const suspiciousAttemptSchema = new Schema<ISuspiciousAttempt>(
  {
    ip: { type: String },
    phone: { type: String },
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    userAgent: { type: String },
    reason: { type: String, required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// 📈 Indexes for faster analytics and reporting
suspiciousAttemptSchema.index({ phone: 1 });
suspiciousAttemptSchema.index({ ip: 1 });
suspiciousAttemptSchema.index({ category: 1 });
suspiciousAttemptSchema.index({ createdAt: -1 });

const SuspiciousAttempt =
  mongoose.models.SuspiciousAttempt ||
  mongoose.model<ISuspiciousAttempt>(
    "SuspiciousAttempt",
    suspiciousAttemptSchema
  );

export default SuspiciousAttempt;
