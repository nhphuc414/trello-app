import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import autorizedAxiosInstance from '~/utils/authorizedAxios'
import { API_ROOT } from '~/utils/constants'

const initialState = {
  currentUser: null
}
export const loginUserAPI = createAsyncThunk(
  'user/loginUserAPI',
  async (data) => {
    const res = await autorizedAxiosInstance.post(
      `${API_ROOT}/v1/users/login`,
      data
    )
    return res.data
  }
)
export const logoutUserAPI = createAsyncThunk(
  'user/logoutUserAPI',
  async (showSuccessMessage = true) => {
    const res = await autorizedAxiosInstance.delete(
      `${API_ROOT}/v1/users/logout`
    )
    if (showSuccessMessage) toast.success('Logged out successfully!')
    return res.data
  }
)
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateCurrentUser: (state, action) => {
      const user = action.payload

      state.currentUser = user
    }
  },
  extraReducers: (builder) => {
    builder.addCase(loginUserAPI.fulfilled, (state, action) => {
      state.currentUser = action.payload
    })
    builder.addCase(logoutUserAPI.fulfilled, (state) => {
      state.currentUser = null
    })
  }
})
export const { updateCurrentUser } = userSlice.actions
export const selectCurrentUser = (state) => {
  return state.user.currentUser
}
export const userReducer = userSlice.reducer
