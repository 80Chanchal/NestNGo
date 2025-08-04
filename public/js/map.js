window.addEventListener('load', function () {
    setTimeout(initializeMap, 100);
});

function initializeMap() {
    try {
        // Get the exact coordinates from the listing
        const mapElement = document.querySelector('#map');
        if (!mapElement) {
            console.log('Map element not found');
            return;
        }
        
        const latitude = parseFloat(mapElement.getAttribute('data-latitude'));
        const longitude = parseFloat(mapElement.getAttribute('data-longitude'));
        const listingTitle = mapElement.getAttribute('data-title') || 'Location';
        const listingLocation = mapElement.getAttribute('data-location') || 'Unknown';
        const listingPrice = mapElement.getAttribute('data-price') || 'N/A';

        console.log('Coordinates:', latitude, longitude);

        // Use actual coordinates if available, otherwise use defaults
        const mapLat = (latitude && !isNaN(latitude)) ? latitude : 20.5937;
        const mapLng = (longitude && !isNaN(longitude)) ? longitude : 78.9629;

        console.log('Using coordinates:', mapLat, mapLng);

        const map = L.map('map').setView([mapLat, mapLng], 15);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        const customIcon = L.divIcon({
            html: '<div style="background-color: #dc3545; width: 25px; height: 25px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); position: relative; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"><div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(45deg); color: white; font-size: 12px;">🏠</div></div>',
            className: 'custom-marker',
            iconSize: [25, 25],
            iconAnchor: [12, 25],
            popupAnchor: [0, -25]
        });

        const popupContent = `
            <div style="text-align: center; min-width: 180px;">
                <h6 style="margin: 0 0 5px 0; color: #333;">${listingTitle}</h6>
                <p style="margin: 0; color: #666; font-size: 13px;">${listingLocation}</p>
                <p style="margin: 5px 0 0 0; color: #dc3545; font-weight: bold;">₹${listingPrice}/night</p>
            </div>
        `;

        const marker = L.marker([mapLat, mapLng], { icon: customIcon }).addTo(map);
        marker.bindPopup(popupContent).openPopup();
        setTimeout(() => map.invalidateSize(), 200);
    } catch (error) {
        console.error('Error initializing map:', error);
    }
} 