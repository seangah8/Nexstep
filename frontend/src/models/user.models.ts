
export interface UserModel {
    _id: string
    username: string
}

export interface UserWithPasswordModel extends UserModel{
  password: string
}

export interface CredentialsModel {
    username: string
    password: string
}