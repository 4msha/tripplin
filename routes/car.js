var express = require("express");
var router = express.Router();
var Car = require("../models/car");
var Review = require("../models/review");
var middleware = require("../middleware");
var User = require("../models/user");
var BookingInfo = require("../models/bookingInfo");
//var request = require("request");
//var bodyParser = require("body-parser");
//
//car routes
router.get("/", function(req, res) {
  Car.find({}, function(err, allCars) {
    if (err) {
      console.log("there an error");
    } else {
      res.render("car/index", { cars: allCars });
    }
  });
});

//new get route
router.get("/new", middleware.isLoggedIn, function(req, res) {
  res.render("car/new");
});

//creating new car
router.post("/", middleware.isLoggedIn, function(req, res) {
  Car.create(req.body.car, function(err, car) {
    if (err) {
      console.log(err);
    } else {
      car.carOwner = req.user._id;
      car.isAvailable = true;
      car.save();
      console.log(car);
      res.redirect("/cars");
    }
  });
});

//show route
router.get("/:id", function(req, res) {
  var carId = req.params.id;
  Car.findById(carId)
    .populate({ path: "reviews", model: Review })
    .populate({ path: "carOwner", model: User })
    .exec(function(err, car) {
      if (err) {
        console.log("fuckkkkkkkkkkkkkkkkkkkkkkkkkk");
        console.log(err);
      } else {
        console.log(car);
        res.render("car/show", { car: car });
      }
    });
});

//edit route
router.get("/:id/edit", middleware.checkUserCar, function(req, res) {
  console.log("IN EDIT!");
  console.log(req.params);
  //find the campground with provided ID
  Car.findById(req.params.id, function(err, car) {
    if (err) {
      console.log(err);
    } else {
      //render show template with that campground
      res.render("car/edit", { car: car });
    }
  });
});

//update route
router.put("/:id", function(req, res) {
  var newData = {
    name: req.body.name,
    image: req.body.image,
    description: req.body.desc
  };
  Car.findByIdAndUpdate(req.params.id, { $set: newData }, function(err, car) {
    if (err) {
      req.flash("error", err.message);
      res.redirect("back");
    } else {
      req.flash("success", "Successfully Updated!");
      res.redirect("/cars/" + car._id);
    }
  });
});

//delete route
router.delete("/:id", function(req, res) {
  Car.findByIdAndDelete(req.params.id, function(err) {
    if (err) {
      console.log(err);
      res.redirect("/cars");
    } else {
      res.redirect("/cars");
    }
  });
});

//bookRoute
router.get("/:id/book", middleware.isLoggedIn, function(req, res) {
  Car.findById(req.params.id, function(err, car) {
    if (err) {
      console.log(err + "fuck off");
    } else {
      console.log(car);
      res.render("car/book", { car: car });
    }
  });
});

//book post route
router.post("/:id/book", middleware.isLoggedIn, function(req, res) {
  Car.findById(req.params.id)
    .populate({ path: "carOwner", model: User })
    .exec(function(err, car) {
      car.isAvailable = false;
      car.carRent = req.user._id;
      car.save();
      console.log(car);
      console.log("fuckkkkkkkk");
      var newBooking = {
        pickup: req.body.pickup,
        drop: req.body.drop
      };
      BookingInfo.create(newBooking, function(err, newBooked) {
        if (err) {
          console.log(err);
        } else {
          newBooked.userRent = req.user._id;
          newBooked.userOwn = car.carOwner;
          newBooked.car = car._id;
          newBooked.save();
          req.user.bookings.push(newBooked);
          req.user.save();
          console.log(newBooked);
          console.log(req.user);
          res.render("car/booked", { car: car, newBooked: newBooked });
        }
      });
    });
});

module.exports = router;
