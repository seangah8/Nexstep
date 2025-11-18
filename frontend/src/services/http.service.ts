import Axios, { AxiosRequestConfig, Method } from 'axios'

const BASE_URL = import.meta.env.VITE_BASE_URL

const axios = Axios.create({ withCredentials: true })

export const httpService = {
    get<T = any>(endpoint: string, data?: Record<string, any>): Promise<T> {
        return ajax<T>(endpoint, 'GET', data)
    },
    post<T = any>(endpoint: string, data?: any): Promise<T> {
        return ajax<T>(endpoint, 'POST', data)
    },
    put<T = any>(endpoint: string, data?: any): Promise<T> {
        return ajax<T>(endpoint, 'PUT', data)
    },
    delete<T = any>(endpoint: string, data?: any): Promise<T> {
        return ajax<T>(endpoint, 'DELETE', data)
    }
}

async function ajax<T = any>(
    endpoint: string,
    method: Method = 'GET',
    data: any = null
): Promise<T> {
    const url = `${BASE_URL}${endpoint}`
    const params = method === 'GET' ? data : undefined

    const options: AxiosRequestConfig = {
        url,
        method,
        data,
        params
    }

    try {
        const res = await axios.request<T>(options)
        return res.data
    } 
    
    catch (err: any) {
        console.log(`Had issues ${method}ing to the backend, endpoint: ${endpoint}, with data: `, data)
        console.dir(err)

        if (err.response?.status === 401) {
            sessionStorage.clear()
            // window.location.assign('/')
        }

        throw err
    }
}
