const Listing=require("../models/listing");

module.exports.index=async(req,res)=>{
    const allListings =await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}

module.exports.renderNewForm=(req,res)=>{
     res.render("listings/new.ejs");
}

module.exports.showListing = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({
        path:"reviews",
        populate:{path:"author"}
    }).populate("owner");
    
    if(!listing){
        req.flash("error","Listing you requested doesn't Exist");
        return res.redirect("/listings");
    }
    
    // Ensure geometry exists for the map
    if (!listing.geometry) {
        listing.geometry = {
            type: "Point",
            coordinates: [listing.longitude || 78.9629, listing.latitude || 20.5937]
        };
    }
    
    // Ensure latitude and longitude exist
    if (!listing.latitude) {
        listing.latitude = 20.5937;
    }
    if (!listing.longitude) {
        listing.longitude = 78.9629;
    }
    
    console.log("Listing data:", listing);
    res.render("listings/show.ejs",{ listing});
}

module.exports.createListing = async(req,res)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    
    console.log("Form data:", req.body.listing);
    
    // Get coordinates from form data
    const latitude = parseFloat(req.body.listing.latitude);
    const longitude = parseFloat(req.body.listing.longitude);
    
    console.log("Parsed coordinates:", { latitude, longitude });
    
    // Validate coordinates
    if (isNaN(latitude) || isNaN(longitude)) {
        req.flash("error", "Please enter valid latitude and longitude coordinates");
        return res.redirect("/listings/new");
    }
    
    try {
        // Create listing data with geometry
        const listingData = {
            title: req.body.listing.title,
            description: req.body.listing.description,
            price: req.body.listing.price,
            location: req.body.listing.location,
            country: req.body.listing.country,
            latitude: latitude,
            longitude: longitude,
            geometry: {
                type: "Point",
                coordinates: [longitude, latitude] // GeoJSON uses [longitude, latitude] order
            }
        };
        
        console.log("Listing data to save:", listingData);
        
        const newListing = new Listing(listingData);
        newListing.owner = req.user._id;
        newListing.image = {url, filename};
        
        await newListing.save();
        req.flash("success","New Listing Created!!");
        res.redirect("/listings");
    } catch (error) {
        console.error("Error creating listing:", error);
        req.flash("error", "Error creating listing: " + error.message);
        res.redirect("/listings/new");
    }
}
module.exports.editListing=async(req,res)=>{
    let {id} = req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested doesn't Exist");
        return res.redirect("/listings");
    }
    let originalImage=listing.image.url;
    originalImage = originalImage.replace("/upload","/upload/h_200,w_250");
    res.render("listings/edit.ejs",{ listing, originalImage});
}
module.exports.updateListing=async(req,res)=>{
    let {id} = req.params; 
    
    console.log("Update form data:", req.body.listing);
    
    // Get coordinates from form data
    const latitude = parseFloat(req.body.listing.latitude);
    const longitude = parseFloat(req.body.listing.longitude);
    
    console.log("Parsed coordinates for update:", { latitude, longitude });
    
    // Validate coordinates
    if (isNaN(latitude) || isNaN(longitude)) {
        req.flash("error", "Please enter valid latitude and longitude coordinates");
        return res.redirect(`/listings/${id}/edit`);
    }
    
    try {
        // Create update data with geometry
        const updateData = {
            title: req.body.listing.title,
            description: req.body.listing.description,
            price: req.body.listing.price,
            location: req.body.listing.location,
            country: req.body.listing.country,
            latitude: latitude,
            longitude: longitude,
            geometry: {
                type: "Point",
                coordinates: [longitude, latitude] // GeoJSON uses [longitude, latitude] order
            }
        };
        
        console.log("Update data to save:", updateData);
        
        // Update listing with all data including geometry
        let listing = await Listing.findByIdAndUpdate(id, updateData);

        if(typeof req.file !=="undefined"){
            let url = req.file.path;
            let filename = req.file.filename;
            listing.image = {url,filename}; 
            await listing.save();
        }
          
        req.flash("success","Listing Updated");
        res.redirect(`/listings/${id}`);
    } catch (error) {
        console.error("Error updating listing:", error);
        req.flash("error", "Error updating listing: " + error.message);
        res.redirect(`/listings/${id}/edit`);
    }
}

module.exports.deleteListing=async(req,res)=>{
    let {id} = req.params;
    let deletedlisting= await Listing.findByIdAndDelete(id);
    console.log(deletedlisting);
    req.flash("success","Listing Deleted Successfully");
    res.redirect("/listings");
}