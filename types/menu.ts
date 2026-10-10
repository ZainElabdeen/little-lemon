export type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
};

export type MenuItemInput = Omit<MenuItem, "id">;