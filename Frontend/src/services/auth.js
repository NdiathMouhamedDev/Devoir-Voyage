import api from "../api";

export async function registerUser(data) {
  return await api.post("/register", data);
}

export async function loginUser(data) {
  return await api.post("/login", data);
}

export async function logoutUser() {
  return await api.post("/logout");
}

export async function forgotPassword(data) {
  return await api.post("/forgot-password", data);
}

export async function resetPassword(data) {
  return await api.post("/reset-password", data);
}

export async function getProfile() {
  return await api.get("/user");
}

export async function updateProfile(data) {
  return await api.put("/user", data);
}


export async function updatePassword(data) {
  return await api.put("/user/password", data);
}


export async function getEvents() {
  return await api.get("/events");
}

export async function createEvent(data) {
  return await api.post("/events", data);
}

export async function updateEvent(id, data) {
  return await api.put(`/events/${id}`, data);
}


export async function deleteEvent(id) {
  return await api.delete(`/events/${id}`);
}
