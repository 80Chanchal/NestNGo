const express = require("express");
const router = express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,validateListing,isOwner}=require("../middleware.js");
const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const upload= multer({storage});


const ListingController=require("../controllers/listings.js");

router.route("/")
    //Index Route
    .get(wrapAsync(ListingController.index))
    //Create Route
    .post(isLoggedIn,
        validateListing,
        upload.single("listing[image]"),
        wrapAsync(ListingController.createListing)
        );


//New Route
router.get("/new",isLoggedIn,ListingController.renderNewForm);

router.route("/:id")
     //Show Route
    .get(wrapAsync(ListingController.showListing))
    //Update Route
    .put(isLoggedIn,isOwner, upload.single("listing[image]"),validateListing,wrapAsync(ListingController.updateListing))
    //Delete Route
    .delete(isLoggedIn,isOwner,wrapAsync(ListingController.deleteListing));


//Edit Route
router.get("/:id/edit",isLoggedIn,wrapAsync(ListingController.editListing));


module.exports = router;