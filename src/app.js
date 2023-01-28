import express from "express";
import morgan from "morgan";

//routes
import userRoutes from "./routes/user.routes";
import companyRoutes from "./routes/companies.routes";
import serviceRoutes from "./routes/services.routes";
import bookingRoutes from "./routes/bookings.routes";
const cors = require("cors");

const app = express();

//Configuraciones
app.set("port", 4000);
app.use(
  cors({
    origin: "*",
  })
);
//Middleware
app.use(morgan("dev"));
app.use(express.json());
//Routes
app.use("/api/users", userRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoutes);

export default app;
