import API from "./axios";

export const getTickets = (status) =>
  API.get("/tickets", { params: { status } });

export const assignEngineer = (id, engineerId) =>
  API.put(`/tickets/${id}/assign`, { engineerId });

export const reassignEngineer = (id, engineerId) =>
  API.put(`/tickets/${id}/reassign`, { engineerId });

export const startTicket = (id) =>
  API.put(`/tickets/${id}/start`);

export const completeTicket = (id) =>
  API.put(`/tickets/${id}/complete`);

export const cancelTicket = (id) =>
  API.put(`/tickets/${id}/cancel`);

export const updateEstimatedCost = (id, estimatedCost) =>
  API.put(`/tickets/${id}/estimatedCost`, { estimatedCost });

export const addTicketLog = (id, note) =>
  API.post(`/tickets/${id}/logs`, { note });

export const createTicket = (data) =>
   API.post("/tickets", data);