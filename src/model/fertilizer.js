import mongoose from "mongoose";

const fertilizerSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    provider: {
        _id: {
            type: mongoose.Schema.Types.ObjectId, // Correct usage
            ref: 'Provider' // Reference to the Provider model
        },
        name: {
            type: String,
        },
      
    },
  },
  { timestamp: true, versionKey: false }
);

export default mongoose.model("Fertilizer", fertilizerSchema);
