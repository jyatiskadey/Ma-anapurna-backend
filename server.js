const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const adminRoutes = require("./routes/adminRoutes");
const storeRoutes = require("./routes/storeRoutes");
const collectionRoutes = require("./routes/collectionRoutes");
const managerRoutes = require("./routes/managerRoutes");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

const url = `https://ma-anapurna-backend.onrender.com`;
const interval = 10000;

function reloadWebsite() {
  axios
    .get(url)
    .then((response) => {
      console.log(`Website reloaded successfully. Status: ${response.status}`);
    })
    .catch((error) => {
      if (error.response) {
        console.error(
          `HTTP Error: ${error.response.status} ${error.response.statusText}`,
        );
      } else if (error.request) {
        console.error("Network Error: No response received from server");
      } else {
        console.error(`Error: ${error.message}`);
      }
    });
}

setInterval(reloadWebsite, interval);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/admin/stores", storeRoutes);
app.use("/api/manager/collections", collectionRoutes);
app.use("/api/manager", managerRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
