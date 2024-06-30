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
      trim: true,
    },
    nickName: {
      type: String,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      // cannot be in the future
      validate: {
        validator: function (v) {
          return v <= new Date();
        },
        message: "Date of Birth cannot be in the future, {VALUE} is invalid",
      },
    },
    dateOfAdoption: {
      type: Date,
      // cannot be before dateOfBirth
      validate: {
        validator: function (v) {
          if (this.dateOfBirth != undefined) {
            return v >= this.dateOfBirth && v <= new Date();
          }
          return true;
        },
        message: "Date of Adoption cannot be before Date of Birth, {VALUE} is invalid",
      },
    },
    gender: {
      type: String,
      default: "Unknown",
      enum: {
        values: ["Unknown", "Male", "Female"],
        message: "'{VALUE}' is invalid, must be 'Unknown', 'Male', or 'Female'",
      },
      trim: true,
    },
    species: {
      type: String,
      trim: true,
    },
    breed: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      trim: true,
    },
    weight: {
      type: Number,
      min: [0, "Weight must be greater than 0 (zero), {VALUE} is invalid"],
    },
    weightUnit: {
      type: String,
      default: "lb",
      enum: {
        values: ["lb", "kg"],
        message: "'{VALUE}' is invalid, must be 'lbs' or 'kg'",
      },
    },
    height: {
      type: Number,
      min: [0, "Height must be greater than 0 (zero), {VALUE} is invalid"],
    },
    heightUnit: {
      type: String,
      default: "in",
      enum: {
        values: ["in", "cm"],
        message: "'{VALUE}' is invalid, must be 'in' or 'cm'",
      },
    },
    isFriendly: {
      type: Boolean,
      default: false,
    },
    isVeryFriendly: {
      type: Boolean,
      default: false,
    },
    isAggressive: {
      type: Boolean,
      default: false,
    },
    isVeryAggressive: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const Pet = mongoose.model("Pet", PetSchema);

export default Pet;
