export type SearchResponse = {
  success?: boolean;
  message?: string;
  data: Property[];
};

export type Room = {
  _id: string;
  roomNumber: number;
  roomCategory: string;
  roomType: string;
  pricePerMonth: number;
  pricePerDay: number;
  roomSize: number;
  maxOccupancy: number;
  vacancy: number;
  guestDetails: Object[];
  isFeatured: boolean;
  isOccupied: boolean;
  description: string;
  propertyId: string;
  propertyType: string;
  images: {
    roomImage: { label: string; url: string }[];
    washroomImage: { label: string; url: string }[];
    bedImage: { label: string; url: string }[];
    additionalImages: { label: string; url: string }[];
  };
  facilities: string[] | [];
  reviews?: Object[];
  complaints?: Object[];
};

export type Property = {
  _id: string;
  name: string;
  type: string;
  address: string;
  coOfLocation: { type: "Point"; coordinates: [number, number] };
  nearbyPlaces?: string[];
  images: { label: string; url: string }[];
  manager: {
    name: string;
    email?: string;
    phoneNumber: string;
  };
  owner_user_id: string;
  status?: string;
  permissions?: string[];
  facilities: string[] | [];
  isParkingSpaceAvailable?: boolean | "true" | "false" | string;
  isCoupleFriendly?: boolean;
  foodMenu?: object[];
  complaints?: Object[];
  isFeatured?: boolean;
};

export type groupedRooms = {
  roomType?: string;
  roomCategory?: string;
  data: Room[];
};

export type OrderProps = {
  roomType: string;
  roomCategory: string;
  from: Date | string;
  to: Date | string;
  numberOfGuests: number;
  guestName: string;
  guestEmail: string;
  guestPhoneNumber: number;
  propertyId: string;
  roomId: string;
  amount: number;
  userId: string;
};
