"use client";

import mongoose, { Document, Schema } from "mongoose";

export interface ISuspiciousAttempt extends Document {
  ip?: string;
  phone?: string;
  category?: mongoose.Types.ObjectId;
  fingerprint?: string;
  userAgent?: string;
  reason: string;
  createdAt: Date;
}

const suspiciousAttemptSchema = new Schema<ISuspiciousAttempt>(
  {
    ip: { type: String },
    phone: { type: String },
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    fingerprint: { type: String },
    userAgent: { type: String },
    reason: { type: String, required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // only track createdAt
  }
);

// Optional: index for fast lookups by phone or IP
suspiciousAttemptSchema.index({ phone: 1 });
suspiciousAttemptSchema.index({ ip: 1 });
suspiciousAttemptSchema.index({ category: 1 });

const SuspiciousAttempt =
  mongoose.models.SuspiciousAttempt ||
  mongoose.model<ISuspiciousAttempt>(
    "SuspiciousAttempt",
    suspiciousAttemptSchema
  );

export default SuspiciousAttempt;
