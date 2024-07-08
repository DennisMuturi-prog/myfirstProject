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
