/**
 * Google Maps Integration & Interactive Map Manager
 */

class MapManager {
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        this.map = null;
        this.markers = new Map(); // cafeId -> marker
        this.infoWindow = null;
        this.userLocationMarker = null;
        this.userCoords = null; // { lat, lng }
        this.onMarkerClickCallback = options.onMarkerClick || null;
        this.isGoogleMapsLoaded = false;
        
        // Dark Coffee & Warm Charcoal map style for Google Maps
        this.mapStyles = [
            { "elementType": "geometry", "stylers": [{ "color": "#1d1917" }] },
            { "elementType": "labels.text.fill", "stylers": [{ "color": "#e0cfc3" }] },
            { "elementType": "labels.text.stroke", "stylers": [{ "color": "#1d1917" }] },
            { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{ "color": "#d4af37" }] },
            { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#c68b59" }] },
            { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#172b22" }] },
            { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [{ "color": "#6b9080" }] },
            { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#2c2522" }] },
            { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "#211c19" }] },
            { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#a89a90" }] },
            { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#3d2b1f" }] },
            { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#2b1e15" }] },
            { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [{ "color": "#c68b59" }] },
            { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#26201c" }] },
            { "featureType": "transit.station", "elementType": "labels.text.fill", "stylers": [{ "color": "#c68b59" }] },
            { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#111827" }] },
            { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#4b5563" }] }
        ];
    }

    /**
     * Load Google Maps API dynamically or fallback
     */
    async initMap(apiKey = '') {
        const defaultCenter = { lat: 37.774929, lng: -122.419416 };

        if (apiKey && window.google && window.google.maps) {
            this.isGoogleMapsLoaded = true;
            this.createGoogleMap(defaultCenter);
            return true;
        }

        if (apiKey) {
            try {
                await this.loadGoogleMapsScript(apiKey);
                this.isGoogleMapsLoaded = true;
                this.createGoogleMap(defaultCenter);
                return true;
            } catch (err) {
                console.warn('Failed to load Google Maps script with provided key. Falling back to Leaflet/OpenStreetMap fallback.', err);
            }
        }

        // Fallback: Initialize Leaflet or OSM interactive map if Google Maps isn't available
        this.initFallbackMap(defaultCenter);
        return false;
    }

    loadGoogleMapsScript(apiKey) {
        return new Promise((resolve, reject) => {
            if (window.google && window.google.maps) {
                resolve();
                return;
            }
            const existingScript = document.getElementById('google-maps-script');
            if (existingScript) existingScript.remove();

            const script = document.createElement('script');
            script.id = 'google-maps-script';
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
            script.async = true;
            script.defer = true;
            script.onload = () => resolve();
            script.onerror = (err) => reject(err);
            document.head.appendChild(script);
        });
    }

    createGoogleMap(center) {
        if (!this.container) return;
        this.map = new google.maps.Map(this.container, {
            center: center,
            zoom: 14,
            styles: this.mapStyles,
            disableDefaultUI: false,
            zoomControl: true,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true
        });

        this.infoWindow = new google.maps.InfoWindow();
    }

    initFallbackMap(center) {
        // Fallback to Leaflet open street map if google maps script fails or no key
        if (window.L && this.container) {
            this.map = L.map(this.containerId).setView([center.lat, center.lng], 14);
            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
                subdomains: 'abcd',
                maxZoom: 19
            }).addTo(this.map);
            this.isLeaflet = true;
        } else {
            // Render simulated interactive canvas map if Leaflet isn't available
            this.renderSimulatedMapCanvas(center);
        }
    }

    renderSimulatedMapCanvas(center) {
        if (!this.container) return;
        this.container.innerHTML = `
            <div class="simulated-map-container">
                <div class="map-grid-overlay"></div>
                <div class="simulated-map-badge">
                    <span class="badge-icon">📍</span>
                    <span class="badge-text">Interactive Map Mode</span>
                </div>
                <div id="simulated-markers-layer" class="simulated-markers-layer"></div>
            </div>
        `;
        this.isSimulated = true;
    }

    updateMarkers(cafes = []) {
        this.clearMarkers();
        if (cafes.length === 0) return;

        const bounds = this.isGoogleMapsLoaded ? new google.maps.LatLngBounds() : null;

        cafes.forEach(cafe => {
            const position = { lat: cafe.lat, lng: cafe.lng };

            if (this.isGoogleMapsLoaded && this.map) {
                const markerIcon = {
                    path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
                    fillColor: cafe.openNow ? "#C68B59" : "#6B7280",
                    fillOpacity: 1,
                    strokeWeight: 2,
                    strokeColor: "#FFFFFF",
                    scale: 1.8,
                    anchor: new google.maps.Point(12, 22)
                };

                const marker = new google.maps.Marker({
                    position: position,
                    map: this.map,
                    title: cafe.name,
                    icon: markerIcon,
                    animation: google.maps.Animation.DROP
                });

                marker.addListener('click', () => {
                    this.showInfoWindow(cafe, marker);
                    if (this.onMarkerClickCallback) {
                        this.onMarkerClickCallback(cafe);
                    }
                });

                this.markers.set(cafe.id, marker);
                bounds.extend(position);

            } else if (this.isLeaflet && this.map) {
                const customIcon = L.divIcon({
                    className: 'custom-leaflet-marker',
                    html: `<div class="marker-pin ${cafe.openNow ? 'open' : 'closed'}">☕</div>`,
                    iconSize: [36, 36],
                    iconAnchor: [18, 36]
                });

                const marker = L.marker([cafe.lat, cafe.lng], { icon: customIcon }).addTo(this.map);
                marker.bindPopup(`
                    <div class="map-popup-card">
                        <img src="${cafe.images[0]}" alt="${cafe.name}" />
                        <h4>${cafe.name}</h4>
                        <p class="popup-rating">⭐ ${cafe.rating} (${cafe.reviewCount}) • ${cafe.priceLevel}</p>
                        <p class="popup-address">${cafe.address}</p>
                    </div>
                `);

                marker.on('click', () => {
                    if (this.onMarkerClickCallback) {
                        this.onMarkerClickCallback(cafe);
                    }
                });

                this.markers.set(cafe.id, marker);

            } else if (this.isSimulated) {
                this.addSimulatedMarker(cafe);
            }
        });

        if (this.isGoogleMapsLoaded && this.map && cafes.length > 0) {
            this.map.fitBounds(bounds);
            if (cafes.length === 1) {
                this.map.setZoom(16);
            }
        }
    }

    addSimulatedMarker(cafe) {
        const layer = document.getElementById('simulated-markers-layer');
        if (!layer) return;

        // Spread points on simulated grid relative to center
        const centerLat = 37.774929;
        const centerLng = -122.419416;
        const top = 50 + (centerLat - cafe.lat) * 600;
        const left = 50 + (cafe.lng - centerLng) * 600;

        const pin = document.createElement('div');
        pin.className = `simulated-pin ${cafe.openNow ? 'open' : 'closed'}`;
        pin.style.top = `${Math.max(10, Math.min(85, top))}%`;
        pin.style.left = `${Math.max(10, Math.min(85, left))}%`;
        pin.setAttribute('data-id', cafe.id);
        pin.innerHTML = `
            <div class="pin-badge">☕ ${cafe.name}</div>
            <div class="pin-dot"></div>
        `;

        pin.addEventListener('click', () => {
            if (this.onMarkerClickCallback) {
                this.onMarkerClickCallback(cafe);
            }
        });

        layer.appendChild(pin);
        this.markers.set(cafe.id, pin);
    }

    showInfoWindow(cafe, marker) {
        if (!this.infoWindow || !this.isGoogleMapsLoaded) return;
        const content = `
            <div class="map-popup-card">
                <img src="${cafe.images[0]}" alt="${cafe.name}" class="popup-img" />
                <div class="popup-info">
                    <span class="popup-badge ${cafe.openNow ? 'open' : 'closed'}">${cafe.openNow ? 'Open Now' : 'Closed'}</span>
                    <h3 class="popup-title">${cafe.name}</h3>
                    <div class="popup-meta">
                        <span>⭐ ${cafe.rating} (${cafe.reviewCount})</span>
                        <span>•</span>
                        <span>${cafe.priceLevel}</span>
                    </div>
                    <p class="popup-address">${cafe.address}</p>
                    <button class="popup-btn" onclick="window.AppUI.openDrawer('${cafe.id}')">View Details</button>
                </div>
            </div>
        `;
        this.infoWindow.setContent(content);
        this.infoWindow.open(this.map, marker);
    }

    clearMarkers() {
        this.markers.forEach(marker => {
            if (this.isGoogleMapsLoaded && marker.setMap) {
                marker.setMap(null);
            } else if (this.isLeaflet && marker.remove) {
                marker.remove();
            }
        });
        this.markers.clear();

        if (this.isSimulated) {
            const layer = document.getElementById('simulated-markers-layer');
            if (layer) layer.innerHTML = '';
        }
    }

    setUserLocation(coords) {
        this.userCoords = coords;
        if (this.isGoogleMapsLoaded && this.map) {
            if (this.userLocationMarker) this.userLocationMarker.setMap(null);
            this.userLocationMarker = new google.maps.Marker({
                position: coords,
                map: this.map,
                title: 'Your Location',
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 9,
                    fillColor: '#3B82F6',
                    fillOpacity: 1,
                    strokeColor: '#FFFFFF',
                    strokeWeight: 3
                }
            });
            this.map.panTo(coords);
            this.map.setZoom(15);
        }
    }

    calculateDistance(lat1, lon1, lat2, lon2) {
        // Haversine formula distance in miles
        const R = 3958.8; // Radius of Earth in miles
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return (R * c).toFixed(1);
    }
}

if (typeof window !== 'undefined') {
    window.MapManager = MapManager;
}
