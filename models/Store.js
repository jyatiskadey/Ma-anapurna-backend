const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema(
  {
    storeName: { type: String, required: true },
    address: { type: String, required: true },

    // Target collection for this store set by admin
    targetAmount: { type: Number, required: true, default: 0 },

    // Cumulative collection from all manager entries
    totalCollected: { type: Number, required: true, default: 0 },

    // Remaining collection (targetAmount - totalCollected)
    remainingAmount: { type: Number, required: true, default: 0 },

    status: { type: String, default: "active" },
  },
  {
    collection: "stores",
    timestamps: true,
  },
);

module.exports = mongoose.model("Store", storeSchema);
