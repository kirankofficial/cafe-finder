/**
 * UI Renderer & Component Handler for Cafe Finder
 */

class UIController {
    constructor() {
        this.currentCafes = [];
        this.activeCafe = null;
        this.activeFilterTab = 'all';
    }

    initUI() {
        this.setupTheme();
        this.setupDrawerCloseHandlers();
        this.setupModalHandlers();
        this.setupStarRatingInput();
    }

    setupTheme() {
        const savedTheme = StorageManager.getTheme();
        document.documentElement.setAttribute('data-theme', savedTheme);
        const themeBtn = document.getElementById('theme-toggle-btn');
        if (themeBtn) {
            themeBtn.innerHTML = savedTheme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
        }
    }

    toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        StorageManager.setTheme(next);
        const themeBtn = document.getElementById('theme-toggle-btn');
        if (themeBtn) {
            themeBtn.innerHTML = next === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
        }
        this.showToast(`Switched to ${next} theme`, 'info');
    }

    renderCafeList(cafes = []) {
        this.currentCafes = cafes;
        const container = document.getElementById('cafe-cards-container');
        const countBadge = document.getElementById('cafe-count-badge');

        if (countBadge) {
            countBadge.innerText = `${cafes.length} ${cafes.length === 1 ? 'Cafe' : 'Cafes'} Found`;
        }

        if (!container) return;

        if (cafes.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">☕</div>
                    <h3>No Cafes Found</h3>
                    <p>Try adjusting your search criteria or clearing filters to find more spots.</p>
                    <button class="btn btn-secondary" onclick="window.AppUI.resetFilters()">Reset All Filters</button>
                </div>
            `;
            return;
        }

        container.innerHTML = cafes.map(cafe => this.createCafeCardHTML(cafe)).join('');
    }

    createCafeCardHTML(cafe) {
        const isFav = StorageManager.isFavorite(cafe.id);
        const openBadge = cafe.openNow 
            ? `<span class="badge badge-open">Open Now</span>` 
            : `<span class="badge badge-closed">Closed</span>`;

        return `
            <div class="cafe-card" id="card-${cafe.id}" onclick="window.AppUI.onCardClick('${cafe.id}')">
                <div class="card-image-wrapper">
                    <img src="${cafe.images[0]}" alt="${cafe.name}" loading="lazy" class="card-img" />
                    <button class="fav-btn ${isFav ? 'active' : ''}" 
                            title="${isFav ? 'Remove from favorites' : 'Save to favorites'}"
                            onclick="event.stopPropagation(); window.AppUI.toggleFavorite('${cafe.id}')">
                        ${isFav ? '❤️' : '🤍'}
                    </button>
                    ${openBadge}
                </div>
                <div class="card-content">
                    <div class="card-header-row">
                        <h3 class="card-title">${cafe.name}</h3>
                        <span class="card-price">${cafe.priceLevel}</span>
                    </div>
                    <p class="card-tagline">${cafe.tagline}</p>
                    
                    <div class="card-meta-row">
                        <span class="rating-badge">⭐ ${cafe.rating} <span class="review-count">(${cafe.reviewCount})</span></span>
                        <span class="dot-separator">•</span>
                        <span class="card-distance">📍 ${cafe.distance}</span>
                    </div>

                    <div class="amenity-tags">
                        ${cafe.amenities.wifi ? `<span class="tag">📶 Wi-Fi</span>` : ''}
                        ${cafe.amenities.outlets ? `<span class="tag">🔌 Outlets</span>` : ''}
                        ${cafe.amenities.outdoorSeating ? `<span class="tag">🌿 Outdoor</span>` : ''}
                        ${cafe.amenities.specialtyCoffee ? `<span class="tag">☕ Roast</span>` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    onCardClick(cafeId) {
        const cafe = this.currentCafes.find(c => c.id === cafeId) || window.INITIAL_CAFES.find(c => c.id === cafeId);
        if (cafe) {
            this.openDrawer(cafe);
        }
    }

    openDrawer(cafeOrId) {
        let cafe = typeof cafeOrId === 'string' 
            ? (this.currentCafes.find(c => c.id === cafeOrId) || window.INITIAL_CAFES.find(c => c.id === cafeOrId))
            : cafeOrId;

        if (!cafe) return;
        this.activeCafe = cafe;

        const drawer = document.getElementById('cafe-drawer');
        const overlay = document.getElementById('drawer-overlay');
        const content = document.getElementById('drawer-body');

        if (!drawer || !content) return;

        const isFav = StorageManager.isFavorite(cafe.id);
        const userReviews = StorageManager.getUserReviews(cafe.id);
        const allReviews = [...userReviews, ...cafe.reviews];

        content.innerHTML = `
            <div class="drawer-hero">
                <div class="hero-carousel">
                    ${cafe.images.map((img, i) => `
                        <img src="${img}" alt="${cafe.name}" class="carousel-img ${i === 0 ? 'active' : ''}" />
                    `).join('')}
                </div>
                <button class="drawer-close-btn" onclick="window.AppUI.closeDrawer()">&times;</button>
            </div>

            <div class="drawer-main-info">
                <div class="drawer-title-row">
                    <div>
                        <h2 class="drawer-cafe-name">${cafe.name}</h2>
                        <p class="drawer-address">📍 ${cafe.address}</p>
                    </div>
                    <button class="fav-action-btn ${isFav ? 'active' : ''}" onclick="window.AppUI.toggleFavorite('${cafe.id}', true)">
                        ${isFav ? '❤️ Saved' : '🤍 Save'}
                    </button>
                </div>

                <div class="drawer-meta-pills">
                    <span class="pill rating-pill">⭐ ${cafe.rating} (${allReviews.length} reviews)</span>
                    <span class="pill price-pill">${cafe.priceLevel}</span>
                    <span class="pill status-pill ${cafe.openNow ? 'open' : 'closed'}">${cafe.openNow ? '🟢 Open Now' : '🔴 Closed'}</span>
                    <span class="pill hours-pill">🕒 ${cafe.hours}</span>
                </div>

                <div class="drawer-actions-row">
                    <a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(cafe.name + ' ' + cafe.address)}" 
                       target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                       🧭 Get Directions
                    </a>
                    ${cafe.phone ? `<a href="tel:${cafe.phone}" class="btn btn-secondary">📞 Call</a>` : ''}
                    ${cafe.website && cafe.website !== '#' ? `<a href="${cafe.website}" target="_blank" class="btn btn-secondary">🌐 Website</a>` : ''}
                </div>

                <hr class="drawer-divider" />

                <div class="drawer-section">
                    <h3>About</h3>
                    <p class="drawer-description">${cafe.description}</p>
                </div>

                <div class="drawer-section">
                    <h3>Amenities & Atmosphere</h3>
                    <div class="amenities-grid">
                        <div class="amenity-item ${cafe.amenities.wifi ? 'available' : 'unavailable'}">
                            <span class="icon">📶</span>
                            <div>
                                <strong>Wi-Fi</strong>
                                <span>${cafe.amenities.wifi ? cafe.amenities.wifiSpeed || 'Available' : 'No Wi-Fi'}</span>
                            </div>
                        </div>
                        <div class="amenity-item ${cafe.amenities.outlets ? 'available' : 'unavailable'}">
                            <span class="icon">🔌</span>
                            <div>
                                <strong>Power Outlets</strong>
                                <span>${cafe.amenities.outlets ? 'Ample Outlets' : 'Limited/None'}</span>
                            </div>
                        </div>
                        <div class="amenity-item ${cafe.amenities.outdoorSeating ? 'available' : 'unavailable'}">
                            <span class="icon">🌿</span>
                            <div>
                                <strong>Outdoor Seating</strong>
                                <span>${cafe.amenities.outdoorSeating ? 'Patio Available' : 'Indoor Only'}</span>
                            </div>
                        </div>
                        <div class="amenity-item ${cafe.amenities.petFriendly ? 'available' : 'unavailable'}">
                            <span class="icon">🐾</span>
                            <div>
                                <strong>Pet Friendly</strong>
                                <span>${cafe.amenities.petFriendly ? 'Dogs Welcome' : 'No Pets'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="drawer-section">
                    <h3>Popular Menu Items</h3>
                    <div class="menu-list">
                        ${cafe.menu.map(item => `
                            <div class="menu-item">
                                <span class="menu-name">${item.name}</span>
                                <span class="menu-dots"></span>
                                <span class="menu-price">${item.price}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <hr class="drawer-divider" />

                <div class="drawer-section">
                    <h3>Customer Reviews (${allReviews.length})</h3>
                    
                    <!-- Write Review Form -->
                    <div class="add-review-box">
                        <h4>Leave a Review</h4>
                        <form id="review-form" onsubmit="window.AppUI.submitReview(event, '${cafe.id}')">
                            <div class="rating-select-row">
                                <span>Your Rating:</span>
                                <div class="star-rating-input" id="star-rating-input">
                                    <span data-star="1">★</span>
                                    <span data-star="2">★</span>
                                    <span data-star="3">★</span>
                                    <span data-star="4">★</span>
                                    <span data-star="5">★</span>
                                </div>
                                <input type="hidden" id="selected-rating-val" value="5" />
                            </div>
                            <input type="text" id="reviewer-name" class="form-input" placeholder="Your Name" required />
                            <textarea id="reviewer-comment" class="form-input" rows="3" placeholder="Share details of your experience, coffee quality, or work atmosphere..." required></textarea>
                            <button type="submit" class="btn btn-primary btn-sm">Post Review</button>
                        </form>
                    </div>

                    <!-- Reviews List -->
                    <div class="reviews-list">
                        ${allReviews.map(r => `
                            <div class="review-card">
                                <div class="review-header">
                                    <img src="${r.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}" alt="${r.user}" class="reviewer-avatar" />
                                    <div>
                                        <strong class="reviewer-name">${r.user}</strong>
                                        <div class="review-meta">${'⭐'.repeat(r.rating)} • ${r.date}</div>
                                    </div>
                                </div>
                                <p class="review-text">${r.comment}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        drawer.classList.add('open');
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';

        this.setupStarRatingInput();
    }

    closeDrawer() {
        const drawer = document.getElementById('cafe-drawer');
        const overlay = document.getElementById('drawer-overlay');
        if (drawer) drawer.classList.remove('open');
        if (overlay) overlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    setupDrawerCloseHandlers() {
        const overlay = document.getElementById('drawer-overlay');
        if (overlay) {
            overlay.addEventListener('click', () => this.closeDrawer());
        }
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeDrawer();
                this.closeModal('api-key-modal');
                this.closeModal('favorites-modal');
            }
        });
    }

    setupModalHandlers() {
        const apiKeyBtn = document.getElementById('api-key-settings-btn');
        const favoritesTabBtn = document.getElementById('favorites-tab-btn');

        if (apiKeyBtn) {
            apiKeyBtn.addEventListener('click', () => {
                const currentKey = StorageManager.getApiKey();
                const keyInput = document.getElementById('api-key-input');
                if (keyInput) keyInput.value = currentKey;
                this.openModal('api-key-modal');
            });
        }

        if (favoritesTabBtn) {
            favoritesTabBtn.addEventListener('click', () => {
                this.renderFavoritesModal();
                this.openModal('favorites-modal');
            });
        }
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('open');
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('open');
        }
    }

    saveApiKey(e) {
        if (e) e.preventDefault();
        const input = document.getElementById('api-key-input');
        if (!input) return;
        const key = input.value.trim();
        StorageManager.setApiKey(key);
        this.closeModal('api-key-modal');
        this.showToast('Google Maps API key saved! Reloading map...', 'success');
        setTimeout(() => location.reload(), 1200);
    }

    toggleFavorite(cafeId, updateDrawer = false) {
        const isNowFav = StorageManager.toggleFavorite(cafeId);
        this.showToast(isNowFav ? 'Saved to Favorites ❤️' : 'Removed from Favorites 🤍', isNowFav ? 'success' : 'info');

        // Re-render cafe list cards
        this.renderCafeList(this.currentCafes);

        if (updateDrawer && this.activeCafe && this.activeCafe.id === cafeId) {
            this.openDrawer(this.activeCafe);
        }
    }

    renderFavoritesModal() {
        const favIds = StorageManager.getFavorites();
        const allCafes = [...window.INITIAL_CAFES, ...this.currentCafes];
        const favCafes = allCafes.filter((c, idx, self) => favIds.includes(c.id) && self.findIndex(t => t.id === c.id) === idx);
        
        const container = document.getElementById('favorites-modal-list');
        if (!container) return;

        if (favCafes.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🤍</div>
                    <p>You haven't saved any cafes yet. Click the heart icon on any cafe card to save it here!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = favCafes.map(cafe => `
            <div class="fav-modal-item" onclick="window.AppUI.closeModal('favorites-modal'); window.AppUI.openDrawer('${cafe.id}')">
                <img src="${cafe.images[0]}" alt="${cafe.name}" class="fav-item-img" />
                <div class="fav-item-info">
                    <h4>${cafe.name}</h4>
                    <p>⭐ ${cafe.rating} • ${cafe.address}</p>
                </div>
                <button class="fav-remove-btn" onclick="event.stopPropagation(); window.AppUI.toggleFavorite('${cafe.id}'); window.AppUI.renderFavoritesModal();">&times;</button>
            </div>
        `).join('');
    }

    setupStarRatingInput() {
        const container = document.getElementById('star-rating-input');
        if (!container) return;
        const stars = container.querySelectorAll('span');
        const hiddenInput = document.getElementById('selected-rating-val');

        const updateStars = (val) => {
            stars.forEach(s => {
                const starVal = parseInt(s.getAttribute('data-star'));
                if (starVal <= val) {
                    s.classList.add('selected');
                } else {
                    s.classList.remove('selected');
                }
            });
            if (hiddenInput) hiddenInput.value = val;
        };

        stars.forEach(s => {
            s.addEventListener('click', () => {
                const val = parseInt(s.getAttribute('data-star'));
                updateStars(val);
            });
        });

        updateStars(5);
    }

    submitReview(e, cafeId) {
        e.preventDefault();
        const ratingVal = parseInt(document.getElementById('selected-rating-val').value || 5);
        const nameVal = document.getElementById('reviewer-name').value.trim();
        const commentVal = document.getElementById('reviewer-comment').value.trim();

        if (!nameVal || !commentVal) return;

        const newReview = {
            user: nameVal,
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
            rating: ratingVal,
            date: 'Just now',
            comment: commentVal
        };

        StorageManager.addUserReview(cafeId, newReview);
        this.showToast('Thank you! Your review has been posted.', 'success');

        // Re-open drawer to reflect new review
        const cafe = this.currentCafes.find(c => c.id === cafeId) || window.INITIAL_CAFES.find(c => c.id === cafeId);
        if (cafe) {
            this.openDrawer(cafe);
        }
    }

    showToast(message, type = 'info') {
        let toastContainer = document.getElementById('toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `<span>${message}</span>`;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

if (typeof window !== 'undefined') {
    window.UIController = UIController;
}
