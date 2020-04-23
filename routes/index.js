var express = require("express");
var router = express.Router();
var Car = require("../models/car");
var User = require("../models/user");
var passport = require("passport");
var Bill = require("../models/bill");
var middleware = require("../middleware");
var BookingInfo = require("../models/bookingInfo");

//
//var Review = require("../models/review");
//var Car = require("../models/car");
//var User = require("../models/user");

router.get("/", function (req, res) {
  res.render("landing");
});

// show register form
router.get("/register", function (req, res) {
  res.render("register");
});

//handle sign up logic
router.post("/register", function (req, res) {
  var newUser = new User({
    username: req.body.username,
    name: req.body.name,
    email: req.body.email,
    address: req.body.address,
    city: req.body.city,
    state: req.body.state,
    zip: req.body.zip,
    number: req.body.number,
  });
  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      var message = err.message;
      req.flash("error", message);
      return res.redirect("/register");
    }
    passport.authenticate("local")(req, res, function () {
      req.flash(
        "success",
        "Successfully Signed Up! Nice to meet you " + req.body.username
      );
      res.redirect("/cars");
    });
  });
});

//show login form
router.get("/login", function (req, res) {
  res.render("login");
});

//handling login logic
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/cars",
    failureRedirect: "/login",
  }),
  function (req, res) {}
);

// logout route
router.get("/logout", function (req, res) {
  req.logout();
  req.flash("success", "LOGGED YOU OUT!");
  res.redirect("/cars");
});

//show user Bookings
router.get("/:id/book", function (req, res) {
  User.findById(req.user._id)
    .populate({
      path: "bookings",
      model: "bookingInfo",
      populate: {
        path: "car",
        model: "car",
      },
    })
    .exec(function (err, user) {
      if (err) {
        console.log("gul" + err);
      } else {
        console.log(user.bookings);
        res.render("myBooking", { bookings: user.bookings });
      }
    });
});

//checkout post route
router.post("/checkout", function (req, res) {
  console.log(req.body.username);
  var user = {
    username: req.body.username,
  };
  User.findOne(user)
    .populate({
      path: "bookings",
      model: "bookingInfo",
      populate: {
        path: "car",
        model: "car",
      },
    })
    .exec(function (err, user) {
      if (err) {
        console.log(err);
      } else {
        console.log(user);
        res.render("myBooking", { bookings: user.bookings });
      }
    });
});

//return Car
router.get("/:id/return", function (req, res) {
  console.log("YUUUUUHUHUHUHUHUHUHUHU");
  BookingInfo.findById(req.params.id)
    .populate({
      path: "car",
      model: "car",
      populate: {
        path: "carRent",
        model: "User",
      },
    })
    .exec(function (err, booking) {
      if (err) {
        console.log(err + "fuck");
      } else {
        console.log(booking);
        var hours = middleware.calculateMoney(
          booking.pickup.date,
          booking.drop.date,
          booking.pickup.time,
          booking.drop.time
        );
        console.log(hours);
        var amount = hours * booking.car.costPerHour;
        function isBooking(value) {
          if (value == booking._id) {
            return false;
          } else {
            return true;
          }
        }
        var result = booking.car.carRent.bookings.filter(isBooking);
        // 5e8a4dd4fba7353164adff51
        console.log(booking._id);
        console.log(result);

        console.log(booking.car.carRent.bookings);
        booking.car.carRent.bookings = result;
        booking.car.carRent.save();
        booking.car.save();
        var bill = {
          billAmount: amount,
          pickup: booking.pickup,
          drop: booking.drop,
          car: {
            name: booking.car.name,
            image: booking.car.image,
          },
        };
        Bill.create(bill, function (err, bill) {
          if (err) {
            console.log(err + "fuck2");
          } else {
            console.log(bill);
            res.render("billPage", { bill: bill });
          }
        });
      }
    });
});

module.exports = router;
