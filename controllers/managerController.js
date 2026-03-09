const Manager = require("../models/Manager");
const jwt = require("jsonwebtoken");

// Manager registration
exports.register = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res
      .status(400)
      .json({ message: "Username and password are required" });

  try {
    // Check if manager already exists
    const existingManager = await Manager.findOne({ username });
    if (existingManager)
      return res.status(400).json({ message: "Manager already exists" });

    const newManager = await Manager.create({ username, password });

    res.status(201).json({
      message: "Manager registered successfully",
      manager: { username: newManager.username, id: newManager._id },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Manager login
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const manager = await Manager.findOne({ username });
    if (!manager) return res.status(401).json({ message: "Invalid username" });

    const isMatch = await manager.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: manager._id, username: manager.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.json({ message: "Login successful", token, username: manager.username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.downloadDailyReport = async (req, res) => {
  try {
    // Accept date from query param
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const reportDate = new Date(date);

    // Fetch all active stores
    const stores = await Store.find({ status: "active" });

    // Fetch collection for this date
    const collections = await Collection.find({
      date: reportDate,
    });

    // Map storeId => amount for easy lookup
    const collectionMap = {};
    collections.forEach((c) => {
      collectionMap[c.storeId.toString()] = c.amount;
    });

    // Create Excel workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Daily Report");

    // Add header row
    worksheet.addRow(["Store Name", "Address", "Collection Amount"]);

    // Add store rows
    stores.forEach((store) => {
      worksheet.addRow([
        store.storeName,
        store.address,
        collectionMap[store._id.toString()] || 0, // if no collection, 0
      ]);
    });

    // Set column widths
    worksheet.columns = [{ width: 30 }, { width: 50 }, { width: 20 }];

    // Write workbook to buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Set response headers to download file
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=DailyReport-${date}.xlsx`,
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    res.send(buffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getManagers = async (req, res) => {
  try {
    const managers = await Manager.find({}, "-password");
    res.json({ managers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateManager = async (req, res) => {
  const { id } = req.params;
  const { username, password } = req.body;

  try {
    const manager = await Manager.findById(id);
    if (!manager) return res.status(404).json({ message: "Manager not found" });

    if (username) manager.username = username;
    if (password) manager.password = password;

    await manager.save();
    res.json({ message: "Manager updated successfully", manager: { username: manager.username, id: manager._id } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteManager = async (req, res) => {
  const { id } = req.params;

  try {
    const manager = await Manager.findByIdAndDelete(id);
    if (!manager) return res.status(404).json({ message: "Manager not found" });

    res.json({ message: "Manager deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
