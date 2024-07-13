export interface RegisterUser{
    firstName:string,
    secondName:string,
    email:string,
    password:string,
    dateOfBirth:string,
    gender:string,
    marketingSource:string,
}
export interface UserAuth{
    userName:string,
    email:string,
    userId:string
}
export interface LoginUser{
    email:string,
    password:string

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
    images:string[]
}
export interface Slidervalue{
    upper:number,
    lower:number
}
