import mongoose from "mongoose";

const PetSchema = new mongoose.Schema(
  {
    refUser_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Pet = mongoose.model("Pet", PetSchema);

export default Pet;
