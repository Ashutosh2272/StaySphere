const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const { listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");


const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new expressError(400, errMsg);
  } else {
    next();
  }
}

//Index rout
router.get("/", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({})
  res.render("listings/index.ejs", { allListings })
})
)

//New Rout
router.get("/new", (req, res) => {
  res.render("listings/new.ejs")
})

//Show rout
router.get("/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");
  if(!listing){
    req.flash("error", "Listing you requested for doesn't exist!");
    res.redirect("/listings");  
  }
  res.render("listings/show.ejs", { listing });
})
);

//Create Route
router.post("/", validateListing, wrapAsync(async (req, res, next) => {
  // let {title, description, image, price, location, country} = req.body;
  // let listing = req.body.listing;
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  req.flash("success", "New listing created!!");
  res.redirect("/listings");
})
);


//Edit Route
router.get("/:id/edit", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
   if(!listing){
    req.flash("error", "Listing you requested for doesn't exist!");
    res.redirect("/listings");  
  }
  res.render("listings/edit.ejs", { listing });

})
)

//Update Route
router.put("/:id", validateListing, wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing })
  res.redirect(`/listings/${id}`)
})
)

//Delete Route
router.delete("/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  console.log("Deleted list")
  req.flash("success", "Your post is deleted!!");
  res.redirect("/listings");
})
)   

module.exports = router;