var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
  name: String,
  username: String,
  password: String,
  email: String,
  address: String,
  city: String,
  state: String,
  zip: String,
  number: String,
  bookings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BookingInfo"
    }
  ]
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
