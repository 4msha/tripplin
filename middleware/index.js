var Review = require("../models/review");
var Car = require("../models/car");
module.exports = {
  isLoggedIn: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error", "You must be signed in to do that!");
    res.redirect("/login");
  },
  checkUserCar: function (req, res, next) {
    if (req.isAuthenticated()) {
      Car.findById(req.params.id, function (err, car) {
        if (car.carOwner.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "You don't have permission to do that!");
          console.log("BADD!!!");
          res.redirect("/cars/" + req.params.id);
        }
      });
    } else {
      console.log(req.params);
      req.flash("error", "You need to be signed in to do that!");
      res.redirect("/login");
    }
  },
  checkUserReview: function (req, res, next) {
    console.log("YOU MADE IT!");
    if (req.isAuthenticated()) {
      Review.findById(req.params.reviewId, function (err, review) {
        if (review.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "You don't have permission to do that!");
          res.redirect("/cars/" + req.params.id);
        }
      });
    } else {
      req.flash("error", "You need to be signed in to do that!");
      res.redirect("/login");
    }
  },
  calculateMoney: function (pickupDate, dropDate, pickupTime, dropTime) {
    pickupDate = pickupDate.split("-");
    pickupTime = pickupTime.split(":");
    dropDate = dropDate.split("-");
    dropTime = dropTime.split(":");

    console.log(pickupDate);
    console.log(pickupTime);
    console.log(dropDate);
    console.log(dropTime);
    var startDate = new Date(
      pickupDate[0],
      pickupDate[1],
      pickupDate[2],
      pickupTime[0],
      pickupTime[1],
      0,
      0
    );
    var dropDate = new Date();
    console.log(startDate);
    console.log(dropDate);

    // var years = dropDate.getFullYear() - startDate.getFullYear();
    // var month = dropDate.getMonth() - startDate.getMonth();
    // var day = dropDate.getDay() - startDate.getDay();
    // var hours = dropDate.getHours() - startDate.getHours();
    // var minutes = dropDate.getMinutes() - startDate.getMinutes();
    // hours += years * 365 * 24 + month * 30 * 24 + day * 24 + minutes * 0.01667;
    // console.log(hours);
    var hours = Math.abs(dropDate - startDate) / 36e5;
    return hours;
  },
};
