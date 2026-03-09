const Store = require("../models/Store");
const Collection = require("../models/Collection");

// Add store
exports.addStore = async (req, res) => {
  const { storeName, address, collection } = req.body;

  // Validate required fields
  if (!storeName || !address || collection === undefined) {
    return res
      .status(400)
      .json({ message: "Store name, address, and collection are required" });
  }

  try {
    const store = await Store.create({
      storeName,
      address,
      targetAmount: collection,
      remainingAmount: collection,
      status: "active",
    });

    res.json({ message: "Store added successfully", store });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all stores
exports.getStores = async (req, res) => {
  try {
    const stores = await Store.find().sort({ createdAt: -1 });
    res.json({ stores });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateStoreStatus = async (req, res) => {
  const { storeId } = req.params;
  const { status } = req.body; // expected "active" or "inactive"

  if (!["active", "inactive"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const store = await Store.findById(storeId);
    if (!store) return res.status(404).json({ message: "Store not found" });

    store.status = status;
    await store.save();

    res.json({ message: `Store status updated to ${status}`, store });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
