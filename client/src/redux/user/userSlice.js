import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
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
  }
})
export const { updateCurrentUser } = userSlice.actions
export const selectCurrentUser = (state) => {
  return state.user.currentUser
}
export const userReducer = userSlice.reducer
