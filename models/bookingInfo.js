var mongoose = require("mongoose");

var bookingInfoSchema = new mongoose.Schema({
  pickup: {
    date: String,
    time: String
  },
  drop: {
    date: String,
    time: String
  },
  userRent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  userOwn: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

module.exports = mongoose.model("bookingInfo", bookingInfoSchema);
