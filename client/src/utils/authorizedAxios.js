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
        refreshTokenPromise = refreshTokenAPI()
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
