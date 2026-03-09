const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res
      .status(400)
      .json({ message: "Username and password are required" });

  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin)
      return res.status(400).json({ message: "Admin already exists" });

    const newAdmin = await Admin.create({ username, password });

    res.status(201).json({
      message: "Admin registered successfully",
      admin: { username: newAdmin.username, id: newAdmin._id },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ message: "Invalid username" });

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign(
      { username: admin.username },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    res.json({ message: "Login successful", token, username: admin.username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
