const Store = require("../models/Store");
const Collection = require("../models/Collection");

// Add store
exports.addStore = async (req, res) => {
  const { storeName, collection, pageNumber, description } = req.body;

  // Validate required fields
  if (!storeName || collection === undefined) {
    return res
      .status(400)
      .json({ message: "Store name and collection are required" });
  }

  try {
    const store = await Store.create({
      storeName,
      targetAmount: collection,
      remainingAmount: collection,
      pageNumber,
      description,
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

exports.updateStore = async (req, res) => {
  const { storeId } = req.params;
  const { storeName, targetAmount, pageNumber, description } = req.body;

  try {
    const store = await Store.findById(storeId);
    if (!store) return res.status(404).json({ message: "Store not found" });

    if (storeName) store.storeName = storeName;
    if (targetAmount !== undefined) {
      store.targetAmount = targetAmount;
      // Recalculate remainingAmount
      store.remainingAmount = targetAmount - store.totalCollected;
    }
    if (pageNumber !== undefined) store.pageNumber = pageNumber;
    if (description !== undefined) store.description = description;

    await store.save();
    res.json({ message: "Store updated successfully", store });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

