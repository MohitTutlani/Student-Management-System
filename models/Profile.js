const mongoose = require("mongoose");
const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  phone: {
    type: Number,
    maxlength: 10,
  },
  skills: {
    type: [String],
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    dafault: Date.now,
  },
});
module.exports = Profile = mongoose.model("Profile", ProfileSchema);
