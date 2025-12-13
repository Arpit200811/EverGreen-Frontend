import api from "./axios";

export const getTickets = () => api.get("/tickets");

export const assignEngineer = (id, engineerId) =>
  api.put(`/tickets/${id}/assign`, { engineerId });

export const updateCost = (id, estimatedCost) =>
  api.put(`/tickets/${id}`, { estimatedCost });
