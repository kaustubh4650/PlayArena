import axios from "axios";

const BASE_URL = "http://localhost:8080/turfs";

// Get all turfs
export const getAllTurfs = async () => {
  const res = await axios.get(`${BASE_URL}`);
  return res.data;
};

// Get turf by ID
export const getTurfById = async (turfId) => {
  const res = await axios.get(`${BASE_URL}/${turfId}`);
  return res.data;
};

// Get slots by turf ID
export const getSlotsByTurfId = async (turfId) => {
  const res = await axios.get(`${BASE_URL}/${turfId}/slots`);
  return res.data;
};

// Get reviews by turf ID
export const getReviewsByTurfId = async (turfId) => {
  const res = await axios.get(`${BASE_URL}/${turfId}/reviews`);
  return res.data;
};
