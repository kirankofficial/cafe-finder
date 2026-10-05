/**
 * Cafe Finder Application Main Orchestrator
 */

class Application {
    constructor() {
        this.mapManager = null;
        this.placesService = null;
        this.ui = null;
        
        this.userCoords = null;
        this.activeFilters = {
            openNow: false,
            minRating: 0,
            wifi: false,
            outlets: false,
            outdoorSeating: false,
            petFriendly: false,
            specialtyCoffee: false,
            veganOptions: false,
            priceLevel: 'all',
            sortBy: 'recommended'
        };
        this.searchQuery = '';
    }

    async init() {
        // Initialize UI Controller
        this.ui = new UIController();
        this.ui.initUI();
        window.AppUI = this.ui;

        // Initialize Map Manager
        const apiKey = StorageManager.getApiKey();
        this.mapManager = new MapManager('map-container', {
            onMarkerClick: (cafe) => {
                this.ui.openDrawer(cafe);
            }
        });

        // Load Map (Google Maps or Fallback)
        await this.mapManager.initMap(apiKey);

        // Initialize Places Service
        this.placesService = new PlacesService(this.mapManager);

        // Setup Event Listeners
        this.bindEvents();

        // Perform Initial Search
        await this.handleSearch();

        // Check if user has saved API Key indicator
        this.updateApiKeyIndicator(apiKey);
    }

    bindEvents() {
        // Search Input
        const searchInput = document.getElementById('search-input');
        const clearBtn = document.getElementById('clear-search-btn');

        if (searchInput) {
            let debounceTimer = null;
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value;
                if (clearBtn) clearBtn.style.display = this.searchQuery ? 'block' : 'none';
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => this.handleSearch(), 300);
            });
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                if (searchInput) searchInput.value = '';
                this.searchQuery = '';
                clearBtn.style.display = 'none';
                this.handleSearch();
            });
        }

        // Geolocation "Near Me" button
        const nearMeBtn = document.getElementById('near-me-btn');
        if (nearMeBtn) {
            nearMeBtn.addEventListener('click', () => this.handleGeolocation());
        }

        // Filter Chips
        const filterChips = document.querySelectorAll('.filter-chip');
        filterChips.forEach(chip => {
            chip.addEventListener('click', () => {
                const filterKey = chip.getAttribute('data-filter');
                if (!filterKey) return;

                if (filterKey === 'openNow' || filterKey === 'wifi' || filterKey === 'outlets' || 
                    filterKey === 'outdoorSeating' || filterKey === 'specialtyCoffee' || filterKey === 'veganOptions') {
                    this.activeFilters[filterKey] = !this.activeFilters[filterKey];
                    chip.classList.toggle('active', this.activeFilters[filterKey]);
                } else if (filterKey === 'minRating') {
                    this.activeFilters.minRating = this.activeFilters.minRating === 4.5 ? 0 : 4.5;
                    chip.classList.toggle('active', this.activeFilters.minRating === 4.5);
                }

                this.handleSearch();
            });
        });

        // Price Filter Select
        const priceSelect = document.getElementById('price-filter-select');
        if (priceSelect) {
            priceSelect.addEventListener('change', (e) => {
                this.activeFilters.priceLevel = e.target.value;
                this.handleSearch();
            });
        }

        // Sort Dropdown
        const sortSelect = document.getElementById('sort-by-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.activeFilters.sortBy = e.target.value;
                this.handleSearch();
            });
        }

        // Theme Toggle Button
        const themeBtn = document.getElementById('theme-toggle-btn');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => this.ui.toggleTheme());
        }
    }

    async handleSearch() {
        const cafes = await this.placesService.searchCafes(
            this.searchQuery,
            this.activeFilters,
            this.userCoords
        );

        // Update Feed List & Map Markers
        this.ui.renderCafeList(cafes);
        this.mapManager.updateMarkers(cafes);
    }

    handleGeolocation() {
        if (!navigator.geolocation) {
            this.ui.showToast('Geolocation is not supported by your browser', 'error');
            return;
        }

        this.ui.showToast('Locating your position...', 'info');
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                this.userCoords = {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                };
                this.mapManager.setUserLocation(this.userCoords);
                this.ui.showToast('Located! Displaying cafes near you.', 'success');
                this.handleSearch();
            },
            (err) => {
                console.warn('Geolocation error:', err);
                this.ui.showToast('Could not access location. Showing default area.', 'error');
            },
            { timeout: 10000, enableHighAccuracy: true }
        );
    }

    updateApiKeyIndicator(apiKey) {
        const badge = document.getElementById('api-key-status-badge');
        if (!badge) return;

        if (apiKey) {
            badge.className = 'api-status-badge live';
            badge.innerHTML = '🟢 Google Maps Live';
        } else {
            badge.className = 'api-status-badge demo';
            badge.innerHTML = '⚡ Realtime Simulated Mode';
        }
    }
}

// Reset filters global helper
window.AppUI = window.AppUI || {};
window.AppUI.resetFilters = function() {
    if (window.appInstance) {
        window.appInstance.activeFilters = {
            openNow: false,
            minRating: 0,
            wifi: false,
            outlets: false,
            outdoorSeating: false,
            petFriendly: false,
            specialtyCoffee: false,
            veganOptions: false,
            priceLevel: 'all',
            sortBy: 'recommended'
        };
        window.appInstance.searchQuery = '';
        
        const searchInput = document.getElementById('search-input');
        if (searchInput) searchInput.value = '';

        document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        const priceSelect = document.getElementById('price-filter-select');
        if (priceSelect) priceSelect.value = 'all';

        window.appInstance.handleSearch();
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.appInstance = new Application();
    window.appInstance.init();
});
