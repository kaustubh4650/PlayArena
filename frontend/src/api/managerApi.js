import axios from "axios";

const BASE_URL = "http://localhost:8080/managers";

// Set auth token header helper
const authHeaders = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// ================== MANAGER APIs ==================

// Get manager by ID
export const getManagerById = async (id, token) => {
  const res = await axios.get(`${BASE_URL}/${id}`, authHeaders(token));
  return res.data;
};

// Update manager details
export const updateManagerById = async (id, data, token) => {
  const res = await axios.put(`${BASE_URL}/${id}`, data, authHeaders(token));
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

// ================== TURF APIs ==================

// Get turf by turfId
export const getTurfById = async (turfId, token) => {
  const res = await axios.get(
    `${BASE_URL}/turfs/${turfId}`,
    authHeaders(token)
  );
  return res.data;
};

// Update turf (form-data)
export const updateTurf = async (turfId, formData, token) => {
  const res = await axios.put(`${BASE_URL}/turfs/${turfId}`, formData, {
    ...authHeaders(token),
    headers: {
      ...authHeaders(token).headers,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// Create turf (form-data)
export const createTurf = async (managerId, formData, token) => {
  const res = await axios.post(`${BASE_URL}/turfs/${managerId}`, formData, {
    ...authHeaders(token),
    headers: {
      ...authHeaders(token).headers,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// Get all turfs by managerId
export const getTurfsByManager = async (managerId, token) => {
  const res = await axios.get(
    `${BASE_URL}/${managerId}/turfs`,
    authHeaders(token)
  );
  return res.data;
};

// Delete turf
export const deleteTurf = async (turfId, token) => {
  const res = await axios.delete(
    `${BASE_URL}/turfs/${turfId}`,
    authHeaders(token)
  );
  return res.data;
};

// ================== BOOKING APIs ==================

// Get bookings by turfId
export const getBookingsByTurfId = async (turfId, token) => {
  const res = await axios.get(
    `${BASE_URL}/bookings/${turfId}`,
    authHeaders(token)
  );
  return res.data;
};

// ================== SLOT APIs ==================

// Create slot for turf
export const createSlot = async (turfId, data, token) => {
  const res = await axios.post(
    `${BASE_URL}/turfs/${turfId}/slots`,
    data,
    authHeaders(token)
  );
  return res.data;
};

// Get all slots for a turf
export const getSlotsByTurfId = async (turfId, token) => {
  const res = await axios.get(
    `${BASE_URL}/turfs/${turfId}/slots`,
    authHeaders(token)
  );
  return res.data;
};

// Get slot by slotId
export const getSlotById = async (slotId, token) => {
  const res = await axios.get(
    `${BASE_URL}/slots/${slotId}`,
    authHeaders(token)
  );
  return res.data;
};

// Update slot
export const updateSlot = async (slotId, data, token) => {
  const res = await axios.put(
    `${BASE_URL}/slots/${slotId}`,
    data,
    authHeaders(token)
  );
  return res.data;
};

// Delete slot
export const deleteSlot = async (slotId, token) => {
  const res = await axios.delete(
    `${BASE_URL}/slots/${slotId}`,
    authHeaders(token)
  );
  return res.data;
};
