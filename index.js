const express = require("express");
const connectDB = require("./config/db");
const app = express();

//Database connection
connectDB();

//Initializing of Middleware
app.use(express.json({ extended: false }));

//Routes
app.use("/api/user", require("./routes/api/user"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/student", require("./routes/api/student"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server connected on PORT : " + PORT);
});
