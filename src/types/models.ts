export interface Item {
  id?: number;
  title: string;
  description: string;
  image_url: string;
  category: string;
  price: number;
  condition: "NEW" | "USED" | "DAMAGE" | "WOREST_CONDITION";
  status?: "AVAILABLE" | "OUT_OF_STOCK" | "RESERVED" | "SOLD";
  owner?: number;
}

export interface Exchange {
  id?: number;
  fromUserId: number;
  toUserId: number;
  offeredItemId: number;
  requestedItemId: number;
  status?: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED";
  message?: string;
}

export interface Message {
  id?: number;
  exchangeId: number;
  senderId: number;
  message: string;
  createdAt?: string;
  read?: boolean;
}
