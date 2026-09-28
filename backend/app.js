require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");
const routes = require("./routes/index");
const webhookRoutes = require("./modules/webhook");
require("./modules/appstation/model");
require("./modules/merchantCredential/model");
require("./modules/widgetCustomization/model");
require("./modules/autoSetup/model");
require("./modules/activityLog/model");
require("./modules/cashbackOffer/model");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(
  express.json({
    limit: "50mb",
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/", routes);
app.use("/api", routes);
app.use("/api/webhooks", webhookRoutes);
sequelize
  .authenticate()
  .then(() => {
    console.log("PostgreSQL connection established successfully.");
    return sequelize.sync();
  })
  .then(() => {
    console.log("Database models synchronized successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err.message);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
