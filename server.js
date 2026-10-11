
require("dotenv").config();
require('./src/models/Pneu');

const express = require("express");
const mongoose = require("mongoose");

const authRoutes = require("./src/routes/router");
const roleRoutes = require("./src/routes/role.routes");
const camionRoutes = require('./src/routes/camion.routes');
const remorqueRoutes = require('./src/routes/remorque.routes');
const missionRoutes = require('./src/routes/mission.routes');
const regleMaintenanceRoutes = require('./src/routes/regleMaintenance.routes');
const maintenanceRoutes = require('./src/routes/maintenance.routes');
const carburantRoutes = require('./src/routes/carburant.routes');
const trajetRoutes = require('./src/routes/trajet.routes');


const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/roles", roleRoutes);
app.use('/api/camions', camionRoutes);
app.use('/api/remorques', remorqueRoutes);
app.use('/api/missions', missionRoutes);
app.use('/api/regles-maintenance', regleMaintenanceRoutes);
app.use('/api/maintenances', maintenanceRoutes);
app.use('/api/carburants', carburantRoutes);
app.use('/api/trajets', trajetRoutes);


const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/flotte_db";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err.message);
  });