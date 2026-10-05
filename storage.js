/**
 * Storage Manager for Cafe Finder
 * Handles LocalStorage persistence for favorites, user reviews, theme, and API Key settings.
 */

const STORAGE_KEYS = {
    FAVORITES: 'cafe_finder_favorites',
    USER_REVIEWS: 'cafe_finder_user_reviews',
    CUSTOM_CAFES: 'cafe_finder_custom_cafes',
    API_KEY: 'cafe_finder_google_maps_key',
    THEME: 'cafe_finder_theme',
    RECENT_SEARCHES: 'cafe_finder_recent_searches'
};

class StorageManager {
    // --- Favorites ---
    static getFavorites() {
        try {
            const stored = localStorage.getItem(STORAGE_KEYS.FAVORITES);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error('Error reading favorites:', e);
            return [];
        }
    }

    static isFavorite(cafeId) {
        const favorites = this.getFavorites();
        return favorites.includes(cafeId);
    }

    static toggleFavorite(cafeId) {
        let favorites = this.getFavorites();
        if (favorites.includes(cafeId)) {
            favorites = favorites.filter(id => id !== cafeId);
        } else {
            favorites.push(cafeId);
        }
        localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
        return favorites.includes(cafeId);
    }

    // --- User Custom Reviews ---
    static getUserReviews(cafeId) {
        try {
            const allReviews = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_REVIEWS) || '{}');
            return allReviews[cafeId] || [];
        } catch (e) {
            console.error('Error reading reviews:', e);
            return [];
        }
    }

    static addUserReview(cafeId, reviewObj) {
        try {
            const allReviews = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_REVIEWS) || '{}');
            if (!allReviews[cafeId]) {
                allReviews[cafeId] = [];
            }
            allReviews[cafeId].unshift(reviewObj);
            localStorage.setItem(STORAGE_KEYS.USER_REVIEWS, JSON.stringify(allReviews));
            return allReviews[cafeId];
        } catch (e) {
            console.error('Error adding user review:', e);
            return [];
        }
    }

    // --- Google Maps API Key ---
    static getApiKey() {
        return localStorage.getItem(STORAGE_KEYS.API_KEY) || '';
    }

    static setApiKey(key) {
        if (!key) {
            localStorage.removeItem(STORAGE_KEYS.API_KEY);
        } else {
            localStorage.setItem(STORAGE_KEYS.API_KEY, key.trim());
        }
    }

    // --- Theme Settings ---
    static getTheme() {
        return localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';
    }

    static setTheme(theme) {
        localStorage.setItem(STORAGE_KEYS.THEME, theme);
    }

    // --- Recent Searches ---
    static getRecentSearches() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.RECENT_SEARCHES) || '[]');
        } catch (e) {
            return [];
        }
    }

    static addRecentSearch(query) {
        if (!query || query.trim().length < 2) return;
        let searches = this.getRecentSearches();
        searches = searches.filter(s => s.toLowerCase() !== query.toLowerCase());
        searches.unshift(query.trim());
        if (searches.length > 5) searches.pop();
        localStorage.setItem(STORAGE_KEYS.RECENT_SEARCHES, JSON.stringify(searches));
    }
}

if (typeof window !== 'undefined') {
    window.StorageManager = StorageManager;
}
