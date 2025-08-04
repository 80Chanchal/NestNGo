const mongoose = require('mongoose');
const Listing = require('../models/listing');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/wanderlust', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

async function fixListings() {
    try {
        console.log('Starting to fix listings...');
        
        // Find all listings that don't have geometry or coordinates
        const listings = await Listing.find({
            $or: [
                { geometry: { $exists: false } },
                { latitude: { $exists: false } },
                { longitude: { $exists: false } }
            ]
        });
        
        console.log(`Found ${listings.length} listings to fix`);
        
        for (let listing of listings) {
            // Set default coordinates if missing
            if (!listing.latitude) {
                listing.latitude = 20.5937; // Default to India
            }
            if (!listing.longitude) {
                listing.longitude = 78.9629; // Default to India
            }
            
            // Set geometry if missing
            if (!listing.geometry) {
                listing.geometry = {
                    type: 'Point',
                    coordinates: [listing.longitude, listing.latitude] // [longitude, latitude]
                };
            }
            
            await listing.save();
            console.log(`Fixed listing: ${listing.title}`);
        }
        
        console.log('All listings fixed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error fixing listings:', error);
        process.exit(1);
    }
}

fixListings(); 