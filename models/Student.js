const mongoose = require("mongoose");
const StudentSchema = new mongoose.Schema({
  rollNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  classOfStudent: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  phone: {
    type: Number,
    maxlength: 10,
  },
});

module.exports = Student = mongoose.model("Students", StudentSchema);
