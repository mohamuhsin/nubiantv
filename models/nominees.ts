import mongoose, { Document, Model, Schema } from "mongoose";
import Vote from "./votes";

// Nominee interface
export interface INominee extends Document {
  name: string;
  category: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Model interface with static method
export interface INomineeModel extends Model<INominee> {
  getVoteCounts(nomineeIds: string[]): Promise<Record<string, number>>;
}

const NomineeSchema: Schema<INominee> = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);

// Static method to get vote counts
NomineeSchema.statics.getVoteCounts = async function (
  nomineeIds: string[]
): Promise<Record<string, number>> {
  const votes = await Vote.aggregate([
    {
      $match: {
        nominee: {
          $in: nomineeIds.map((id) => new mongoose.Types.ObjectId(id)),
        },
      },
    },
    { $group: { _id: "$nominee", count: { $sum: 1 } } },
  ]);

  const voteMap: Record<string, number> = {};
  votes.forEach((v) => {
    voteMap[v._id.toString()] = v.count;
  });

  return voteMap;
};

// Correctly cast the model to include the static method
const Nominee: INomineeModel =
  (mongoose.models.Nominee as INomineeModel) ||
  (mongoose.model<INominee, INomineeModel>(
    "Nominee",
    NomineeSchema
  ) as INomineeModel);

export default Nominee;
