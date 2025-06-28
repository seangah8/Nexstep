import { UserModel, CredentialsModel } from "../models/user.models"
import { httpService } from "./http.service"

export const userService = {
    query,
    get,
    remove,
    add,
    update,
    signup,
    login,
    logout,
    getLoggedinUser,
    getEmptyCredentials,
}

async function query(): Promise<UserModel[]> {
  return await httpService.get(`user`)
}

async function get(userId : string) : Promise<UserModel> {
  return await httpService.get(`user/${userId}`)
}

async function remove(userId: string) : Promise<void> {
	await httpService.delete(`user/${userId}`)
}

async function add(credentials : CredentialsModel) : Promise<UserModel> {
	return await httpService.post('user', credentials)
}

async function update(user : UserModel) : Promise<UserModel> {
	await httpService.put(`user/${user._id}`, user)
    const loggedinUser = getLoggedinUser()
    if (loggedinUser?._id === user._id) 
        _saveLocalUser(user)
	return user
}

async function signup(credentials : CredentialsModel) :  Promise<UserModel> {
  const user : UserModel = await httpService.post('auth/signup', credentials)
  return _saveLocalUser(user)
}

async function login(credentials : CredentialsModel) :  Promise<UserModel> {
	const user : UserModel = await httpService.post('auth/login', credentials)
	return _saveLocalUser(user)
}

function getLoggedinUser(): UserModel | null{
  const userStr = sessionStorage.getItem('loggedInUser')
  if(!userStr) return null
  return JSON.parse(userStr)
}

async function logout(): Promise<void> {
  sessionStorage.removeItem('loggedInUser');
}

function getEmptyCredentials() : CredentialsModel{
    return { username: '', password: ''}
}


function _saveLocalUser(user : UserModel) : UserModel {
	sessionStorage.setItem('loggedInUser', JSON.stringify(user))
	return user
}

