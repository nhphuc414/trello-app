import { API_ROOT } from '~/utils/constants'

import autorizedAxiosInstance from '~/utils/authorizedAxios'
import { toast } from 'react-toastify'

// Auth
export const registerUserAPI = async (data) => {
  const res = await autorizedAxiosInstance.post(
    `${API_ROOT}/v1/users/register`,
    data
  )
  toast.success(
    'Account created successfully! Please check and verify your account before logging in!',
    {
      theme: 'colored',
      autoClose: 5000
    }
  )
  return res.data
}
export const verifyUserAPI = async (data) => {
  const res = await autorizedAxiosInstance.put(
    `${API_ROOT}/v1/users/verify`,
    data
  )
  toast.success(
    'Account verified successfully! Now you can login to enjoy our services!',
    {
      theme: 'colored',
      autoClose: 5000
    }
  )
  return res.data
}
export const refreshTokenAPI = async () => {
  const res = await autorizedAxiosInstance.put(
    `${API_ROOT}/v1/users/refresh_token`
  )
  return res.data
}
//Board
export const fetchBoardsAPI = async (searchPath) => {
  const res = await autorizedAxiosInstance.get(
    `${API_ROOT}/v1/boards${searchPath}`
  )
  return res.data
}
export const updateBoardDetailsAPI = async (id, data) => {
  const res = await autorizedAxiosInstance.put(
    `${API_ROOT}/v1/boards/${id}`,
    data
  )
  return res.data
}
export const moveCardToDifferentColumnAPI = async (data) => {
  const res = await autorizedAxiosInstance.put(
    `${API_ROOT}/v1/boards/supports/moving_card`,
    data
  )
  return res.data
}
//Column
export const createNewColumnAPI = async (data) => {
  const res = await autorizedAxiosInstance.post(`${API_ROOT}/v1/columns`, data)
  return res.data
}
export const updateColumnDetailsAPI = async (id, data) => {
  const res = await autorizedAxiosInstance.put(
    `${API_ROOT}/v1/columns/${id}`,
    data
  )
  return res.data
}
export const deleteColumnDetailsAPI = async (id) => {
  const res = await autorizedAxiosInstance.delete(
    `${API_ROOT}/v1/columns/${id}`
  )
  return res.data
}
//Card
export const createNewCardAPI = async (data) => {
  const res = await autorizedAxiosInstance.post(`${API_ROOT}/v1/cards`, data)
  return res.data
}
