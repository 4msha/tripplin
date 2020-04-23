var express = require("express");
var router = express.Router({ mergeParams: true });
var Car = require("../models/car");
var Review = require("../models/review");
var middleware = require("../middleware");

//new get route
router.get("/new", middleware.isLoggedIn, function(req, res) {
  Car.findById(req.params.id, function(err, car) {
    if (err) {
      console.log("eroor");
    } else {
      res.render("review/new", { car: car });
    }
  });
});

router.post("/", middleware.isLoggedIn, function(req, res) {
  Car.findById(req.params.id, function(err, car) {
    if (err) {
      console.log("error");
    } else {
      Review.create(req.body.review, function(err, review) {
        if (err) {
          console.log("error");
        } else {
          review.author.id = req.user._id;
          review.author.username = req.user.username;
          review.save();
          car.reviews.push(review);
          car.save();
          console.log(review);
          console.log(car);
          req.flash("success", "Created a new Review");
          res.redirect("/cars/" + car._id);
        }
      });
    }
  });
});

//delete route
router.delete("/:idR", function(req, res) {
  console.log(req.params);
  Car.findById(req.params.id, function(err, car) {
    if (err) {
      console.log(err);
    } else {
      car.reviews = car.reviews.filter(function(value, index) {
        return value != req.params.idR;
      });
      car.save();
      console.log(car.reviews);
      Review.findByIdAndDelete(req.params.idR, function(err) {
        if (err) {
          req.flash("error", "Could not Delete review");
          res.redirect("/cars/" + car._id);
        } else {
          req.flash("success", "Successfully Deleted Review");
          res.redirect("/cars/" + car._id);
        }
      });
    }
  });
});

module.exports = router;
