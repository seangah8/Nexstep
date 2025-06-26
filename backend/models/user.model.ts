import { ObjectId } from "mongodb"

// Replace this with your actual User interface

export interface UserModel {
    _id: string | ObjectId
    username: string
}

export interface UserWithPasswordModel extends UserModel{
  password: string
}


export interface CredentialsModel {
    username: string
    password: string
}