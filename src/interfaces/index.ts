export interface IUser {
  id: string;
  clerk_user_id: string;
  name: string;
  email: string;
  profile_pic: string;
  is_admin: boolean;
  is_active: boolean;
  is_seller: boolean;
  created_at: string;
}

export interface IProduct {
  id: number;
  seller_id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  available_stock: number;
  created_at: string;
  images: string[];
  quantity: number;
}

export interface IAddress {
  name: string;
  phone_number: number;
  address: string;
  neighborhood: string;
  number: number;
  id: number;
}

export interface IOrderItem {
  id: number;
  sub_total: number;
  tax_shipping_fee: number;
  total: number;
  payment_id: string;
  order_status: string;
  addresses: IAddress;
  order_items: {
    name: string;
    price: number;
    quantity: number;
    total: number;
    image: string;
  }[];
  created_at: string;
}
