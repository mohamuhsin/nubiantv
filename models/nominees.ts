import mongoose, { Document, Model, Schema } from "mongoose";

// Nominee interface
export interface INominee extends Document {
  name: string;
  category: mongoose.Schema.Types.ObjectId;
  votes: number;
  createdAt: Date;
  updatedAt: Date;
}

const NomineeSchema: Schema<INominee> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    votes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Model
const Nominee: Model<INominee> =
  mongoose.models.Nominee || mongoose.model<INominee>("Nominee", NomineeSchema);

export default Nominee;
