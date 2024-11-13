import axios from 'axios'
import { toast } from 'react-toastify'
import { refreshTokenAPI } from '~/apis'
import { interceptorLoadingElements } from './formatters'
import { logoutUserAPI } from '~/redux/user/userSlice'

let axiosReduxStore
export const injectStore = (mainStore) => {
  axiosReduxStore = mainStore
}
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
    if (error.response?.status === 401) {
      axiosReduxStore.dispatch(logoutUserAPI(false))
    }
    const originalRequests = error.config
    if (error.response?.status === 410 && originalRequests) {
      if (!refreshTokenPromise) {
        refreshTokenPromise = refreshTokenAPI()
          .then((data) => data?.accessToken)
          .catch((_err) => {
            axiosReduxStore.dispatch(logoutUserAPI(false))
            return Promise.reject(_err)
          })
          .finally(() => {
            refreshTokenPromise = null
          })
      }
      return refreshTokenPromise.then(() => {
        return autorizedAxiosInstance(originalRequests)
      })
    }
    let errorMessage = error?.message
    if (error.response?.data?.message) {
      errorMessage = error.response?.data?.message
    }
    if (error.response?.status !== 410) {
      toast.error(errorMessage)
    }
    return Promise.reject(error)
  }
)
export default autorizedAxiosInstance
