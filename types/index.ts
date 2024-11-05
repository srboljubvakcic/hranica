export interface Delivery {
  id: string;
  name: string;
}

export interface Food {
  id: string;
  name: string;
  deliveryId: string;
  isAvailableToday: boolean;
}

export interface Vote {
  id: string;
  foodId: string;
  userId: string;
  additionalRequests?: string;
  date: string;
}