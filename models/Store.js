const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema(
  {
    storeName: { type: String, required: true },
    address: { type: String, required: true },
    status: { type: String, default: "active" },
  },
  {
    collection: "stores", 
    timestamps: true, 
  },
);

module.exports = mongoose.model("Store", storeSchema);
