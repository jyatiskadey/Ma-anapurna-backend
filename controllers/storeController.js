const Store = require("../models/Store");
const Collection = require("../models/Collection");

// Add store
exports.addStore = async (req, res) => {
  const { storeName, address } = req.body;

  if (!storeName || !address) {
    return res.status(400).json({ message: "Store name and address required" });
  }

  try {
    const store = await Store.create({ storeName, address }); // status default active
    res.json({ message: "Store added successfully", store });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all stores
exports.getStores = async (req, res) => {
  try {
    const stores = await Store.find().lean();

    // For each store, calculate total collection
    const storesWithAmount = await Promise.all(
      stores.map(async (store) => {
        const collections = await Collection.find({ storeId: store._id });
        const totalAmount = collections.reduce((sum, c) => sum + c.amount, 0);

        return {
          ...store,
          totalAmount, // new field
        };
      }),
    );

    res.json({ stores: storesWithAmount });
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
