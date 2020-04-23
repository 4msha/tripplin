var mongoose = require("mongoose");

var billSchema = new mongoose.Schema({
  billAmount: String,
  pickup: {
    date: String,
    time: String
  },
  drop: {
    date: String,
    time: String
  },
  car: {
    name: String,
    image: String
  }
});

module.exports = mongoose.model("bill", billSchema);
