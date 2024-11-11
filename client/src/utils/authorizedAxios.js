import axios from 'axios'
import { toast } from 'react-toastify'
import { handleLogoutAPI, refreshTokenAPI } from '~/apis'
import { interceptorLoadingElements } from './formatters'

let autorizedAxiosInstance = axios.create()
let refreshTokenPromise = null
autorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10
autorizedAxiosInstance.defaults.withCredentials = true

autorizedAxiosInstance.interceptors.request.use(
  (config) => {
    interceptorLoadingElements(true)
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
autorizedAxiosInstance.interceptors.response.use(
  (response) => {
    interceptorLoadingElements(false)
    return response
  },
  (error) => {
    interceptorLoadingElements(false)
    let errorMessage = error?.message
    if (error.response?.data?.message) {
      errorMessage = error.response?.data?.message
    }
    if (error.response?.status === 401) {
      handleLogoutAPI().then(() => {
        location.href('/login')
      })
    }
    const originalRequest = error.config
    if (error.response?.status === 410 && originalRequest) {
      if (!refreshTokenPromise) {
        const refreshToken = localStorage.getItem('refreshToken')
        refreshTokenPromise = refreshTokenAPI(refreshToken)
          .then((res) => {
            const { accessToken } = res.data
            localStorage.setItem('accessToken', accessToken)
            autorizedAxiosInstance.defaults.headers.Authorization = `Bearer ${accessToken}`
          })
          .catch((_err) => {
            handleLogoutAPI().then(() => {
              location.href = '/login'
            })
            return Promise.reject(_err)
          })
          .finally(() => {
            refreshTokenPromise = null
          })
      }
      return refreshTokenPromise.then(() => {
        return autorizedAxiosInstance(originalRequest)
      })
    }
    if (error.response?.status !== 410) {
      toast.error(errorMessage)
    }
    return Promise.reject(error)
  }
)
export default autorizedAxiosInstance
