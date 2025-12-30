/**
 * Data Management for Hotel System
 * Handles LocalStorage operations and state
 */

const STORAGE_KEYS = {
    ROOMS: 'hotel_rooms',
    BOOKINGS: 'hotel_bookings',
    GUESTS: 'hotel_guests'
};

// Initial Room Data
const INITIAL_ROOMS = [
    { id: 1, number: '101', type: 'Single', typeAr: 'غرفة منفردة', price: 100, capacity: 1, status: 'available', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80' },
    { id: 2, number: '102', type: 'Double', typeAr: 'غرفة مزدوجة', price: 180, capacity: 2, status: 'available', image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80' },
    { id: 3, number: '201', type: 'Suite', typeAr: 'جناح ملكي', price: 350, capacity: 4, status: 'available', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80' },
    { id: 4, number: '202', type: 'Deluxe', typeAr: 'غرفة ديلوكس', price: 250, capacity: 2, status: 'available', image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80' },
    { id: 5, number: '301', type: 'Family', typeAr: 'غرفة عائلية', price: 300, capacity: 5, status: 'available', image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80' },
    { id: 6, number: '302', type: 'Single', typeAr: 'غرفة منفردة', price: 100, capacity: 1, status: 'booked', image: 'https://images.unsplash.com/photo-1505691938895-1758d7eaa511?auto=format&fit=crop&w=800&q=80' }
];

const HotelData = {
    // Initialize data if not exists
    init() {
        if (!localStorage.getItem(STORAGE_KEYS.ROOMS)) {
            localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(INITIAL_ROOMS));
        }
        if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
            localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify([]));
        }
    },

    // Rooms logic
    getRooms() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.ROOMS)) || [];
    },

    saveRooms(rooms) {
        localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(rooms));
    },

    updateRoomStatus(roomId, status) {
        const rooms = this.getRooms();
        const room = rooms.find(r => r.id === parseInt(roomId));
        if (room) {
            room.status = status;
            this.saveRooms(rooms);
        }
    },

    // Bookings logic
    getBookings() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS)) || [];
    },

    addBooking(booking) {
        const bookings = this.getBookings();
        const newBooking = {
            id: Date.now(),
            status: 'pending',
            ...booking
        };
        bookings.push(newBooking);
        localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
        
        // Update room status
        this.updateRoomStatus(booking.roomId, 'booked');
        
        return newBooking;
    },

    updateBookingStatus(bookingId, status) {
        const bookings = this.getBookings();
        const booking = bookings.find(b => b.id === parseInt(bookingId));
        if (booking) {
            booking.status = status;
            localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
            
            // If booking is cancelled or finished, free up the room
            if (status === 'cancelled' || status === 'completed') {
                this.updateRoomStatus(booking.roomId, 'available');
            }
        }
    },

    // Stats for Admin
    getStats() {
        const rooms = this.getRooms();
        const bookings = this.getBookings();
        
        return {
            totalRooms: rooms.length,
            availableRooms: rooms.filter(r => r.status === 'available').length,
            totalBookings: bookings.length,
            activeBookings: bookings.filter(b => b.status === 'pending' || b.status === 'confirmed').length
        };
    }
};

// Initialize on load
HotelData.init();
