import { UserModel, CredentialsModel } from "../models/user.models"

export const userService = {
    getEmptyCredentials,
    login,
}

function getEmptyCredentials() : CredentialsModel{
    return { username: '' }
}

function login(credentials : CredentialsModel) : UserModel {
    return {username : credentials.username}
}