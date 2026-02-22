
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  flavors: string[];
  status: string;
  image: string;
  description: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedFlavor?: string;
  crates?: number;
}

export type View = 'LOGIN' | 'CATALOG' | 'PRODUCT_DETAIL' | 'ADMIN' | 'REGISTRATION' | 'CART' | 'PROFILE' | 'ADMIN_LOGIN';

export interface User {
  name: string;
  role: string;
  avatar?: string;
  companyName?: string;
  cnpj?: string;
  email?: string;
  phone?: string;
  businessCategory?: string;
  address?: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_at_time: number;
  selected_flavor?: string;
  product: Product;
}

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: string;
  delivery_address: string;
  created_at: string;
  user: User;
  items: OrderItem[];
}
