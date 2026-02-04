const express = require("express");
const mongoose = require("mongoose");
const app = express();
const { PORT = 3001 } = process.env;
const indexRouter = require("./routes/index");

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(console.error);

app.use(express.json());
app.use("/", indexRouter);
app.use((req, res, next) => {
  req.user = {
    _id: "6982843ff4c7a27ed02197d5",
  };
  next();
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
