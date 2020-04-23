var mongoose = require("mongoose");

var carSchema = new mongoose.Schema({
  name: String,
  image: String,
  noOfSeats: String,
  carNo: String,
  isAvailable: Boolean,
  costPerHour: String,
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  carOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  carRent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("car", carSchema);
