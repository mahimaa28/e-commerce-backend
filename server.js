const app = require("./app");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDatabase = require("./config/database");

// Config

dotenv.config({ path: "./config.env" });

const PORT = 7000 || process.env.PORT;

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// Connecting to database and starting the server

const start = async () => {
  console.log("starting server");
  try {
    connectDatabase();
    app.listen(PORT, () => {
      console.log(`Server is listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
};

start();
