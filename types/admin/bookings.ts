export interface Amount {
  subTotal: number;
  vat: number;
  delivery: number;
  totalAmount: number;
}

export interface User {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  userCustomId: string;
  phoneNumber: string;
}

export interface Duration {
  startDate: string;
  endDate: string;
  totalDuration: number;
}

export interface Billboard {
  _id: string;
  mediaType: string;
  status: string;
  mediaCustomId: string;
  description: string;
  nextAvailable: string;
  price: number;
  cityLga: string;
  dimension: string;
  state: string;
  createdByAdmin: string;
  favoriteCount: number;
  address: string;
  landmark: string;
  listingTitle: string;
  googleStreetlink: string;
  deletedAt: string | null;
  pictures: any[];
  __v: number;
  vaad_id?: string;
}

export interface FinishingDetails {
  eyelets: boolean;
  pocketTB: boolean;
  pocketLR: boolean;
  none: boolean;
}

export interface Print {
  finishingDetails: FinishingDetails;
  _id: string;
  name: string;
  description: string;
  price: number;
  favoriteCount: number;
  prototypeId: string;
  mediaCustomId: string;
  createdByAdmin: string;
  features: string[];
  pictures: any[];
  __v: number;
}

export interface OrderItem {
  duration?: Duration;
  orderSubRef: string;
  orderType: "Billboard" | "Print";
  orderStatus:
    | "Pending"
    | "Awaiting Confirmation"
    | "In progress"
    | "Completed"
    | "Awaiting Shipment"
    | "Shipped"
    | "Out for Delivery"
    | "Delivered"
    | "Expired"
    | "Cancelled";
  quantity: number;
  price: number;
  subtotal: number;
  billboardId?: Billboard;
  route?: string;
  finishingDetails?: FinishingDetails;
  printId?: Print;
  deliveryMethod?: string;
  deliveryAddress?: string;
  height?: string;
  width?: string;
  additionalPrintDesc?: string;
  designFile?: string;
  _id: string;
}

export interface Order {
  amount: Amount;
  _id: string;
  userId: User;
  orderCustomId: string;
  paymentStatus: string;
  paymentMethod: string;
  paymentType: string;
  orderItem: OrderItem[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Meta {
  page: number;
  limit: number;
  startDate: string;
  endDate: string;
  totalDocs: number;
}

export interface OrderData {
  status: string;
  data: {
    orders: Order[];
    totalOrders: number;
  };
  meta: Meta;
}
