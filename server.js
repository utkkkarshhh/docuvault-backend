//Imports
const express = require("express");
const path = require("path");
const env = require("./utils/dotenvConfig");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoutes = require("./routes/userRouter/userRouter");
const authRoutes = require("./routes/authRouter/authRouter");
const documentRoutes = require("./routes/documentRouter/documentRouter");
const db = require("./db/connectionPool");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./utils/swagger/swagger");
const { connectToSequelize } = require("./db/sequelizeConnection");
const startNgrokTunnel = require("./utils/ngrok");

// Middlewares
const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "views/public")));
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
connectToSequelize();
env(); //Activates env.config()

if (process.env.ENIVRONMENT == "NGROK") {
  startNgrokTunnel(process.env.PORT);
}

// Swagger UI setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Get on home route
app.get("/", (req, res) => {
  res.render("index");
});

// Routes
app.use("/api", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/doc", documentRoutes);
// Listening to server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(
    `App is live on port http://localhost:${PORT} | Environment : ${process.env.ENIVRONMENT}`
  );
});
