import axios from "axios";

const BASE_URL = "http://localhost:8080/admin";

// Set auth token header helper
const authHeaders = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// Get all users
export const getAllUsers = async (token) => {
  const res = await axios.get(`${BASE_URL}/users`, authHeaders(token));
  return res.data;
};

// Get user by ID
export const getUserById = async (id, token) => {
  const res = await axios.get(`${BASE_URL}/users/${id}`, authHeaders(token));
  return res.data;
};

// Get all managers
export const getAllManagers = async (token) => {
  const res = await axios.get(`${BASE_URL}/managers`, authHeaders(token));
  return res.data;
};

// Get manager by ID
export const getManagerById = async (id, token) => {
  const res = await axios.get(`${BASE_URL}/managers/${id}`, authHeaders(token));
  return res.data;
};

// Delete manager by ID
export const deleteManagerById = async (id, token) => {
  const res = await axios.delete(
    `${BASE_URL}/managers/${id}`,
    authHeaders(token)
  );
  return res.data;
};

// Register a new manager
export const registerManager = async (managerData, token) => {
  const res = await axios.post(
    `${BASE_URL}/manager/register`,
    managerData,
    authHeaders(token)
  );
  return res.data;
};

// Get reviews by turf ID
export const getReviewsByTurfId = async (turfId, token) => {
  const res = await axios.get(
    `${BASE_URL}/${turfId}/reviews`,
    authHeaders(token)
  );
  return res.data;
};

// Get bookings by turfId
export const getBookingsByTurfId = async (turfId, token) => {
  const res = await axios.get(
    `${BASE_URL}/bookings/${turfId}`,
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

// Get all turfs
export const getAllTurfs = async (token) => {
  const res = await axios.get(`${BASE_URL}/turfs`, authHeaders(token));
  return res.data;
};
