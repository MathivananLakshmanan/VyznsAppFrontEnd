import api from "../../api/api";
import type { Item, Exchange, Message } from "../../types/models";

// Items
export const getAllItems = () => api.get("/items").then((r) => r.data);
export const getMyItems = () => api.get("/items/me").then((r) => r.data);
export const searchItems = (keywords: string) => api.get(`/items/search?keywords=${keywords}`).then((r) => r.data);
export const createItem = (data: Item) => api.post("/items", data).then((r) => r.data);
export const deleteItem = (id: number) => api.delete(`/items/${id}`).then((r) => r.data);
export const updateItem = (id: number, data: Partial<Item>) => api.patch(`/items/${id}`, data).then((r) => r.data);

// Exchanges
export const createExchange = (data: Exchange) => api.post("/api/exchange", data).then((r) => r.data);
export const getUserExchanges = (userId: number) => api.get(`/api/exchange/user/${userId}`).then((r) => r.data);
export const updateExchangeStatus = (exchangeId: number, status: string) =>
  api.put(`/api/exchange/${exchangeId}?status=${status}`).then((r) => r.data);

// Messages
export const sendMessage = (data: Message) => api.post("/api/messages", data).then((r) => r.data);
export const getChatHistory = (exchangeId: number) => api.get(`/api/messages/${exchangeId}`).then((r) => r.data);

// AI Chat
export const aiChat = (message: string) => api.post("/chat", { message }).then((r) => r.data);
