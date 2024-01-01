const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");

dotenv.config();
// mongoose.connect("mongodb://127.0.0.1:27017/myApp", { useNew });
mongoose
  .connect(process.env.MONGO_URL)
  .then((success) => console.log("Conneted to MongoDb"))
  .catch((err) => console.log(err.message));

//Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

//router
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);

app.listen(8000, () => {
  console.log("Backend server is running!");
});
