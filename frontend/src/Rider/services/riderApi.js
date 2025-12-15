import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const riderApi = {
    // Get orders assigned to the rider (Mock Implementation)
    getAssignedOrders: async () => {
        try {
            // Read from LocalStorage "Database"
            const localOrders = JSON.parse(localStorage.getItem('mock_orders') || '[]');

            // In a real app, we would filter by rider ID here.
            // For this demo, we assume ALL mock orders are assigned to THIS rider.
            return { data: localOrders };
        } catch (error) {
            console.error("API Error:", error);
            return { data: [] };
        }
    },

    // Get mock history
    getOrderHistory: async () => {
        // Return only delivered orders from Mock DB
        const localOrders = JSON.parse(localStorage.getItem('mock_orders') || '[]');
        const history = localOrders.filter(o => o.status === 'delivered');
        return { data: history };
    },

    getOrderDetails: async (orderId) => {
        const localOrders = JSON.parse(localStorage.getItem('mock_orders') || '[]');
        const order = localOrders.find(o => o.id === parseInt(orderId) || o.displayId === orderId);
        return { data: order };
    },

    // Update Order Status (Active DB connection)
    updateOrderStatus: async (orderId, status) => {
        try {
            const localOrders = JSON.parse(localStorage.getItem('mock_orders') || '[]');

            // Find and Update
            const updatedOrders = localOrders.map(order => {
                if (order.id === parseInt(orderId) || order.displayId === orderId) {
                    return { ...order, status: status };
                }
                return order;
            });

            // Save back to DB
            localStorage.setItem('mock_orders', JSON.stringify(updatedOrders));
            return { data: { success: true } };

        } catch (error) {
            console.error("Update Error:", error);
            return { data: { success: false } };
        }
    },

    // Update Location
    updateLocation: async (lat, lng) => {
        try {
            await axios.post(`${API_URL}/rider/location`, { lat, lng });
        } catch (error) {
            console.error("Location Update Failed", error);
        }
    }
};
