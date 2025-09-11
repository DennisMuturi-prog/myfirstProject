import { Timestamp } from "@angular/fire/firestore";

export interface RegisterUser{
    firstName:string,
    secondName:string,
    email:string,
    password:string,
    dateOfBirth:string,
    gender:string,
    marketingSource:string,
}

export interface UserDocument {
  dateOfBirth: Timestamp;
  firstName: string;
  gender: string;
  imageUrl: string;
  marketingSource: string;
  secondName: string;
}
export interface UserAuth{
    userName:string,
    email:string,
    userId:string,
    profileImageUrl:string,
}
export interface LoginUser{
    email:string,
    password:string

}
export interface ServerProduct {
  title: string;
  category: string;
  price: number;
  original_price: number;
  pid: string;
  return_policy: string;
  brand: string;
  avg_rating: number;
  discount: string;
  images: string[];
}
export interface Product{
    title:string,
    category:string,
    price:number,
    original_price:number,
    pid:string,
    return_policy:string,
    brand:string,
    avg_rating:number,
    discount:string,
    images:string[],
    inCart:boolean
}
export interface Slidervalue{
    upper:number,
    lower:number
}
export interface CartProduct {
  title: string;
  category: string;
  price: number;
  original_price: number;
  pid: string;
  return_policy: string;
  brand: string;
  avg_rating: number;
  discount: string;
  images: string[];
  id:string,
  quantity:number
}
