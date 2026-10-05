/**
 * Cafe Finder - Initial Curated Dataset & Mock Generator
 */

const INITIAL_CAFES = [
    {
        id: 'cafe-1',
        name: 'Artisan Roast & Brew',
        tagline: 'Single-origin espresso & sourdough pastries',
        rating: 4.8,
        reviewCount: 342,
        priceLevel: '$$',
        address: '742 Evergreen Terrace, Downtown',
        city: 'Metropolis',
        lat: 37.774929,
        lng: -122.419416,
        phone: '+1 (555) 234-5678',
        website: 'https://artisanroastbrew.example.com',
        openNow: true,
        hours: '7:00 AM - 7:00 PM',
        distance: '0.3 miles',
        amenities: {
            wifi: true,
            wifiSpeed: '120 Mbps',
            outlets: true,
            outdoorSeating: true,
            petFriendly: true,
            specialtyCoffee: true,
            veganOptions: true,
            noiseLevel: 'Quiet'
        },
        images: [
            'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=80'
        ],
        description: 'A modern, sunlit sanctuary for specialty coffee lovers. We roast ethically sourced beans in-house weekly and bake fresh sourdough daily. Ample seating and high-speed Wi-Fi make it ideal for remote workers and coffee enthusiasts.',
        menu: [
            { name: 'Pour-Over (Single Origin)', price: '$5.50', category: 'Coffee' },
            { name: 'Oat Milk Flat White', price: '$4.75', category: 'Coffee' },
            { name: 'Iced Matcha Lavender Latte', price: '$5.75', category: 'Tea' },
            { name: 'Almond Croissant', price: '$4.25', category: 'Bakery' },
            { name: 'Avocado Toast w/ Poached Egg', price: '$11.50', category: 'Food' }
        ],
        reviews: [
            {
                user: 'Elena Vance',
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
                rating: 5,
                date: '2 days ago',
                comment: 'Best oat milk latte in the city! The wifi is super fast and there are outlets at almost every table. Perfect spot to work for a few hours.'
            },
            {
                user: 'Marcus Chen',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
                rating: 5,
                date: '1 week ago',
                comment: 'Incredible atmosphere and friendly baristas. Their Ethiopian pour-over blew me away.'
            }
        ]
    },
    {
        id: 'cafe-2',
        name: 'The Velvet Bean',
        tagline: 'Cozy bookshop cafe with velvet armchairs',
        rating: 4.7,
        reviewCount: 218,
        priceLevel: '$',
        address: '128 Willow Creek Lane, Midtown',
        city: 'Metropolis',
        lat: 37.781329,
        lng: -122.408116,
        phone: '+1 (555) 876-5432',
        website: 'https://velvetbeancafe.example.com',
        openNow: true,
        hours: '8:00 AM - 9:00 PM',
        distance: '0.6 miles',
        amenities: {
            wifi: true,
            wifiSpeed: '85 Mbps',
            outlets: true,
            outdoorSeating: false,
            petFriendly: true,
            specialtyCoffee: false,
            veganOptions: true,
            noiseLevel: 'Moderate'
        },
        images: [
            'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1000&q=80'
        ],
        description: 'A warm, vintage cafe surrounded by wall-to-wall bookshelves, velvet couches, and jazz vinyl music. Come for the signature spiced Chai and stay for the cozy reading nooks.',
        menu: [
            { name: 'House Spiced Chai Latte', price: '$4.50', category: 'Tea' },
            { name: 'Dark Roast Drip Coffee', price: '$3.25', category: 'Coffee' },
            { name: 'Blueberry Lemon Scone', price: '$3.75', category: 'Bakery' },
            { name: 'Grilled Cheese & Tomato Soup', price: '$9.75', category: 'Food' }
        ],
        reviews: [
            {
                user: 'Sarah Jenkins',
                avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
                rating: 5,
                date: '3 days ago',
                comment: 'Unbeatable cozy vibes! Love grabbing a seat by the window with a book and a hot mocha.'
            }
        ]
    },
    {
        id: 'cafe-3',
        name: 'Verdant Garden & Cafe',
        tagline: 'Botanical greenhouse cafe & matcha bar',
        rating: 4.9,
        reviewCount: 489,
        priceLevel: '$$$',
        address: '450 Gardenia Way, Westside',
        city: 'Metropolis',
        lat: 37.768929,
        lng: -122.428416,
        phone: '+1 (555) 345-6789',
        website: 'https://verdantgardencafe.example.com',
        openNow: false,
        hours: '8:00 AM - 6:00 PM',
        distance: '1.2 miles',
        amenities: {
            wifi: true,
            wifiSpeed: '100 Mbps',
            outlets: false,
            outdoorSeating: true,
            petFriendly: true,
            specialtyCoffee: true,
            veganOptions: true,
            noiseLevel: 'Lively'
        },
        images: [
            'https://images.unsplash.com/photo-1525610553991-2bede1a236e2?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1522992319-0365e5f11656?auto=format&fit=crop&w=1000&q=80'
        ],
        description: 'Immerse yourself in lush greenery! Verdant is a glass-enclosed botanical cafe serving ceremonial grade Uji matcha, floral teas, and organic farm-to-table brunch options in a sunlit garden setting.',
        menu: [
            { name: 'Ceremonial Iced Uji Matcha', price: '$6.50', category: 'Matcha' },
            { name: 'Rose Water Cold Brew', price: '$5.90', category: 'Coffee' },
            { name: 'Pistachio Milk Cardamom Latte', price: '$6.25', category: 'Coffee' },
            { name: 'Wild Mushroom Tartine', price: '$13.50', category: 'Food' }
        ],
        reviews: [
            {
                user: 'Liam O’Connor',
                avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
                rating: 5,
                date: 'Yesterday',
                comment: 'The photography spot of the year! Truly stunning plant aesthetics and the matcha latte was pure perfection.'
            }
        ]
    },
    {
        id: 'cafe-4',
        name: 'Pulse & Press Espresso',
        tagline: 'Sleek Scandinavian micro-roastery for coffee purists',
        rating: 4.6,
        reviewCount: 165,
        priceLevel: '$$',
        address: '89 Innovation Plaza, Tech District',
        city: 'Metropolis',
        lat: 37.789229,
        lng: -122.401116,
        phone: '+1 (555) 456-7890',
        website: 'https://pulseandpress.example.com',
        openNow: true,
        hours: '6:30 AM - 5:00 PM',
        distance: '0.8 miles',
        amenities: {
            wifi: true,
            wifiSpeed: '250 Mbps',
            outlets: true,
            outdoorSeating: true,
            petFriendly: false,
            specialtyCoffee: true,
            veganOptions: true,
            noiseLevel: 'Quiet'
        },
        images: [
            'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=80'
        ],
        description: 'Minimalist Scandinavian interior focused on precision brewing. Featuring rotating guest coffee origins, light roasts, fiber optic internet, and standing work counters for digital nomads.',
        menu: [
            { name: 'Espresso Flight (3 Origins)', price: '$7.00', category: 'Coffee' },
            { name: 'Nitro Cold Brew w/ Vanilla Foam', price: '$5.75', category: 'Coffee' },
            { name: 'Swedish Cinnamon Bun (Kanelbulle)', price: '$4.50', category: 'Bakery' },
            { name: 'Smoked Salmon Bagel', price: '$10.50', category: 'Food' }
        ],
        reviews: [
            {
                user: 'Aria Thorne',
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
                rating: 4,
                date: '4 days ago',
                comment: 'Great coffee quality and super fast Wi-Fi! Slightly minimal seating but perfect for focused work.'
            }
        ]
    },
    {
        id: 'cafe-5',
        name: 'Moonlight Espresso & Lounge',
        tagline: 'Late-night coffee, mocktails & live acoustic sessions',
        rating: 4.8,
        reviewCount: 310,
        priceLevel: '$$',
        address: '612 Starlight Boulevard, Arts Quarter',
        city: 'Metropolis',
        lat: 37.761229,
        lng: -122.414116,
        phone: '+1 (555) 987-6543',
        website: 'https://moonlightespresso.example.com',
        openNow: true,
        hours: '10:00 AM - 12:00 AM',
        distance: '1.5 miles',
        amenities: {
            wifi: true,
            wifiSpeed: '90 Mbps',
            outlets: true,
            outdoorSeating: true,
            petFriendly: true,
            specialtyCoffee: true,
            veganOptions: true,
            noiseLevel: 'Moderate'
        },
        images: [
            'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1000&q=80'
        ],
        description: 'For night owls and creatives. Moonlight stays open late into the evening offering artisanal espresso drinks, botanical non-alcoholic mocktails, dessert pairings, and soft ambient acoustic music.',
        menu: [
            { name: 'Espresso Martini Mocktail', price: '$7.50', category: 'Specialty' },
            { name: 'Spanish Cortado', price: '$4.25', category: 'Coffee' },
            { name: 'Tiramisu Slice', price: '$6.50', category: 'Bakery' },
            { name: 'Warm Churros w/ Chocolate', price: '$7.00', category: 'Food' }
        ],
        reviews: [
            {
                user: 'David Kim',
                avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
                rating: 5,
                date: '3 days ago',
                comment: 'Love that they stay open until midnight! Hard to find good night-time coffee spots with great music.'
            }
        ]
    },
    {
        id: 'cafe-6',
        name: 'The Daily Grind Bakery',
        tagline: 'French sourdough bakery & stone-ground espresso',
        rating: 4.5,
        reviewCount: 142,
        priceLevel: '$',
        address: '204 Bakers Lane, Old Town',
        city: 'Metropolis',
        lat: 37.772229,
        lng: -122.404116,
        phone: '+1 (555) 678-9012',
        website: 'https://dailygrindbakery.example.com',
        openNow: true,
        hours: '6:00 AM - 4:00 PM',
        distance: '0.4 miles',
        amenities: {
            wifi: false,
            wifiSpeed: '0 Mbps',
            outlets: false,
            outdoorSeating: true,
            petFriendly: true,
            specialtyCoffee: false,
            veganOptions: true,
            noiseLevel: 'Lively'
        },
        images: [
            'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80'
        ],
        description: 'Authentic Parisian style bakery with fresh baguettes, flaky croissants baked hourly, and rich dark roast drip coffee. Simple, delicious, and budget-friendly morning stop.',
        menu: [
            { name: 'Butter Croissant & Coffee Combo', price: '$5.00', category: 'Combo' },
            { name: 'Pain au Chocolat', price: '$3.50', category: 'Bakery' },
            { name: 'Cappuccino', price: '$4.00', category: 'Coffee' },
            { name: 'Ham & Gruyère Quiche', price: '$7.50', category: 'Food' }
        ],
        reviews: [
            {
                user: 'Chloe Dubois',
                avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
                rating: 5,
                date: '5 days ago',
                comment: 'The freshest croissants outside of Paris! Get here early before the Pain au Chocolat sells out.'
            }
        ]
    }
];

if (typeof window !== 'undefined') {
    window.INITIAL_CAFES = INITIAL_CAFES;
}
