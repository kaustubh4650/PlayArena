import axiosInstance from "./axiosInstance";

// Get user profile
export const getUserProfile = async () => {
  const res = await axiosInstance.get("/users/profile");
  return res.data;
};

// Update user profile
export const updateUserProfile = async (payload) => {
  const res = await axiosInstance.put("/users/profile", payload);
  return res.data;
};

// Get all user bookings
export const getUserBookings = async () => {
  const res = await axiosInstance.get("/users/bookings");
  return res.data;
};

// Add booking
export const addBooking = async (payload) => {
  const res = await axiosInstance.post("/users/bookings", payload);
  return res.data;
};
