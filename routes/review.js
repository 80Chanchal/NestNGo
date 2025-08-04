const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const Review=require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview,isLoggedIn,isreviewAuthor} = require("../middleware.js");


const ReviewController=require("../controllers/reviews.js");
//Review Route
router.post("/",isLoggedIn,validateReview,wrapAsync(ReviewController.createReview));

//Delete Review route
router.delete("/:reviewId",isLoggedIn,isreviewAuthor,wrapAsync(ReviewController.deleteReview));
module.exports = router;