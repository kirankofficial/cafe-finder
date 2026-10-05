/**
 * Google Places API Integration & Search Provider
 */

class PlacesService {
    constructor(mapManager) {
        this.mapManager = mapManager;
        this.placesService = null;
    }

    /**
     * Search cafes using Google Places API or Local Dataset
     */
    async searchCafes(query = '', filters = {}, userCoords = null) {
        let results = [];

        // Check if live Google Places service is available
        if (this.mapManager && this.mapManager.isGoogleMapsLoaded && this.mapManager.map) {
            try {
                results = await this.searchGooglePlaces(query, userCoords);
            } catch (err) {
                console.warn('Google Places API search failed or limited. Falling back to local dataset.', err);
                results = this.searchLocalDataset(query, userCoords);
            }
        } else {
            results = this.searchLocalDataset(query, userCoords);
        }

        // Apply filters
        return this.filterCafes(results, filters);
    }

    searchGooglePlaces(query, userCoords) {
        return new Promise((resolve, reject) => {
            if (!this.placesService) {
                this.placesService = new google.maps.places.PlacesService(this.mapManager.map);
            }

            const location = userCoords ? new google.maps.LatLng(userCoords.lat, userCoords.lng) : this.mapManager.map.getCenter();
            
            const request = {
                location: location,
                radius: 5000,
                type: ['cafe'],
                keyword: query || 'cafe'
            };

            this.placesService.nearbySearch(request, (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                    const formatted = results.map(place => this.formatGooglePlace(place, userCoords));
                    resolve(formatted);
                } else {
                    reject(status);
                }
            });
        });
    }

    formatGooglePlace(place, userCoords) {
        const photoUrl = place.photos && place.photos.length > 0 
            ? place.photos[0].getUrl({ maxWidth: 800, maxHeight: 600 }) 
            : 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=80';

        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        let distance = '0.5 miles';

        if (userCoords) {
            distance = `${this.mapManager.calculateDistance(userCoords.lat, userCoords.lng, lat, lng)} miles`;
        }

        return {
            id: place.place_id,
            name: place.name,
            tagline: place.vicinity || 'Specialty Coffee & Bakery',
            rating: place.rating || 4.5,
            reviewCount: place.user_ratings_total || 120,
            priceLevel: '$'.repeat(place.price_level || 2),
            address: place.vicinity || 'Downtown',
            city: 'Local Area',
            lat: lat,
            lng: lng,
            phone: '+1 (555) 000-0000',
            website: '#',
            openNow: place.opening_hours ? place.opening_hours.isOpen() : true,
            hours: '7:00 AM - 8:00 PM',
            distance: distance,
            amenities: {
                wifi: true,
                wifiSpeed: '100 Mbps',
                outlets: true,
                outdoorSeating: Math.random() > 0.5,
                petFriendly: Math.random() > 0.4,
                specialtyCoffee: true,
                veganOptions: true,
                noiseLevel: 'Moderate'
            },
            images: [
                photoUrl,
                'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1000&q=80',
                'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=80'
            ],
            description: `Experience exceptional coffee and ambience at ${place.name}. Located at ${place.vicinity}.`,
            menu: [
                { name: 'House Espresso', price: '$4.00', category: 'Coffee' },
                { name: 'Oat Milk Latte', price: '$5.25', category: 'Coffee' },
                { name: 'Avocado Toast', price: '$10.00', category: 'Food' }
            ],
            reviews: [
                {
                    user: 'Google Reviewer',
                    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
                    rating: place.rating || 5,
                    date: 'Recently',
                    comment: 'Great atmosphere and excellent espresso drinks!'
                }
            ]
        };
    }

    searchLocalDataset(query = '', userCoords = null) {
        let list = [...window.INITIAL_CAFES];

        // Recalculate distance if user coords are present
        if (userCoords && this.mapManager) {
            list = list.map(c => ({
                ...c,
                distanceNum: parseFloat(this.mapManager.calculateDistance(userCoords.lat, userCoords.lng, c.lat, c.lng)),
                distance: `${this.mapManager.calculateDistance(userCoords.lat, userCoords.lng, c.lat, c.lng)} miles`
            }));
        }

        if (!query.trim()) return list;

        const q = query.toLowerCase().trim();
        return list.filter(c => 
            c.name.toLowerCase().includes(q) ||
            c.address.toLowerCase().includes(q) ||
            c.tagline.toLowerCase().includes(q) ||
            c.description.toLowerCase().includes(q) ||
            (c.amenities && Object.keys(c.amenities).some(k => k.toLowerCase().includes(q) && c.amenities[k] === true))
        );
    }

    filterCafes(cafes, filters) {
        return cafes.filter(cafe => {
            // Open Now filter
            if (filters.openNow && !cafe.openNow) return false;

            // Rating filter (e.g. 4.5+)
            if (filters.minRating && cafe.rating < filters.minRating) return false;

            // Wifi filter
            if (filters.wifi && !cafe.amenities.wifi) return false;

            // Outlets filter
            if (filters.outlets && !cafe.amenities.outlets) return false;

            // Outdoor seating
            if (filters.outdoorSeating && !cafe.amenities.outdoorSeating) return false;

            // Pet friendly
            if (filters.petFriendly && !cafe.amenities.petFriendly) return false;

            // Specialty coffee
            if (filters.specialtyCoffee && !cafe.amenities.specialtyCoffee) return false;

            // Vegan options
            if (filters.veganOptions && !cafe.amenities.veganOptions) return false;

            // Price level filter
            if (filters.priceLevel && filters.priceLevel !== 'all') {
                if (cafe.priceLevel !== filters.priceLevel) return false;
            }

            return true;
        }).sort((a, b) => {
            // Sorting logic
            if (filters.sortBy === 'rating') {
                return b.rating - a.rating;
            } else if (filters.sortBy === 'reviews') {
                return b.reviewCount - a.reviewCount;
            } else if (filters.sortBy === 'distance' && a.distanceNum !== undefined) {
                return a.distanceNum - b.distanceNum;
            }
            return 0; // Default order
        });
    }
}

if (typeof window !== 'undefined') {
    window.PlacesService = PlacesService;
}
