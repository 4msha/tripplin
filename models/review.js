var mongoose = require("mongoose");

var reviewSchema = mongoose.Schema({
  content: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  }
});

module.exports = mongoose.model("review", reviewSchema);
