import api from "../../api/axios"; // Use the shared axios instance with interceptors

export const riderApi = {
  // Get orders assigned to the rider + available orders
  getAssignedOrders: async () => {
    try {
      // GET /orders/ for rider (requires trailing slash)
      return await api.get("/orders/");
    } catch (error) {
      console.error("API Error:", error);
      return { data: [] };
    }
  },

  // Get order history
  getOrderHistory: async () => {
    try {
      const response = await api.get("/orders");
      // Filter locally for delivered/cancelled/done
      const history = response.data.filter(
        (o) => o.status === "delivered" || o.status === "cancelled"
      );
      return { data: history };
    } catch (error) {
      console.error("History API Error:", error);
      return { data: [] };
    }
  },

  getOrderDetails: async (orderId) => {
    return await api.get(`/orders/${orderId}`);
  },

  // Update Order Status
  updateOrderStatus: async (orderId, status) => {
    try {
      // PUT /orders/{id}/status?status=...
      const response = await api.put(
        `/orders/${orderId}/status?status=${status}`
      );
      return { data: response.data, success: true };
    } catch (error) {
      console.error("Update Error:", error);
      return { data: { success: false } };
    }
  },

  // Update Location
  updateLocation: async (lat, lng) => {
    try {
      await api.post(`/rider/location`, { lat, lng });
    } catch (error) {
      console.error("Location Update Failed", error);
    }
  },

  // Get Profile
  getProfile: async (userId) => {
    return await api.get(`/rider/profile/${userId}`);
  },
};
