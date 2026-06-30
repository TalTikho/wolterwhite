export type Product = {
  _id: string;
  pname: string;
  pdescription: string;
  price: string;
  image: string;
};

export type Restaurant = {
  _id: string;
  name: string;
  address?: string;
  image?: string;
  addressX?: number;
  addressY?: number;
  products?: { pname: string }[];
};
