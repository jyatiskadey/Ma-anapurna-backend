const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema(
  {
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" }, // Or manager model
    date: { type: Date, required: true },
    amount: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Collection", collectionSchema);