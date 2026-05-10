import express from "express";
import cors from "cors";

import schoolRoutes from "./routes/school.routes.js";

const app = express();

// MIDDLEWARES
app.use(cors());

app.use(express.json());


// ROUTES
app.use("/api/v1/schools", schoolRoutes);

export default app;