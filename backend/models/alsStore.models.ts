import { UserModel } from "./user.models"


export interface LoginTokenModel extends Omit<UserModel, '_id'> {
  _id: string
}

export interface AlsStoreModel {
  loggedinUser?: LoginTokenModel
}