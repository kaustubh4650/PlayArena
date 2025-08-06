import axios from "axios";

const BASE_URL = "http://localhost:8080/users";
export const BASE_PAYMENT_URL = "http://localhost:8080/payment";

// Auth headers with token
const authHeaders = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// -------------------- USER APIs --------------------

// Get user by ID
export const getUserById = async (userId, token) => {
  const res = await axios.get(`${BASE_URL}/${userId}`, authHeaders(token));
  return res.data;
};

// Update user by ID
export const updateUserById = async (userId, updatedData, token) => {
  const res = await axios.put(
    `${BASE_URL}/${userId}`,
    updatedData,
    authHeaders(token)
  );
  return res.data;
};

// Register new user (no token required)
export const registerUser = async (userData) => {
  const res = await axios.post(`${BASE_URL}/register`, userData);
  return res.data;
};

// Change password
export const changePassword = async (data, token) => {
  const res = await axios.put(
    `${BASE_URL}/change-password`,
    data,
    authHeaders(token)
  );
  return res.data;
};

// -------------------- REVIEW APIs --------------------

// Add review for turf by user
export const addReview = async (turfId, userId, reviewData, token) => {
  const res = await axios.post(
    `${BASE_URL}/reviews/${turfId}/${userId}`,
    reviewData,
    authHeaders(token)
  );
  return res.data;
};

// Update review by reviewId
export const updateReview = async (reviewId, updatedData, token) => {
  const res = await axios.put(
    `${BASE_URL}/reviews/${reviewId}`,
    updatedData,
    authHeaders(token)
  );
  return res.data;
};

// Get all reviews by user
export const getUserReviews = async (userId, token) => {
  const res = await axios.get(
    `${BASE_URL}/${userId}/reviews`,
    authHeaders(token)
  );
  return res.data;
};

// Delete review by reviewId
export const deleteReview = async (reviewId, token) => {
  const res = await axios.delete(
    `${BASE_URL}/reviews/${reviewId}`,
    authHeaders(token)
  );
  return res.data;
};

// Get all reviews for a turf
export const getTurfReviews = async (turfId, token) => {
  const res = await axios.get(
    `${BASE_URL}/turfs/${turfId}/reviews`,
    authHeaders(token)
  );
  return res.data;
};

// -------------------- BOOKING APIs --------------------

// Create new booking
export const createBooking = async (bookingData, token) => {
  const res = await axios.post(
    `${BASE_URL}/bookings`,
    bookingData,
    authHeaders(token)
  );
  return res.data;
};

// Cancel booking by ID
export const cancelBooking = async (bookingId, token) => {
  const res = await axios.put(
    `${BASE_URL}/bookings/cancel/${bookingId}`,
    {},
    authHeaders(token)
  );
  return res.data;
};

// Get all bookings of a user
export const getUserBookings = async (userId, token) => {
  const res = await axios.get(
    `${BASE_URL}/bookings/${userId}`,
    authHeaders(token)
  );
  return res.data;
};

// Get booking by booking ID
export const getBookingById = async (bookingId, token) => {
  const res = await axios.get(
    `${BASE_URL}/booking/${bookingId}`,
    authHeaders(token)
  );
  return res.data;
};

// -------------------- PAYMENT APIs --------------------

export const createRazorpayOrder = async (bookingPayload, token) => {
  const res = await axios.post(
    `${BASE_PAYMENT_URL}/create-order`,
    bookingPayload,
    authHeaders(token)
  );
  return res.data;
};

export const validateSlotAvailability = async (slotId, bookingDate, token) => {
  const res = await axios.get(`${BASE_PAYMENT_URL}/validate-slot`, {
    params: { slotId, bookingDate },
    ...authHeaders(token),
  });
  return res.data;
};
