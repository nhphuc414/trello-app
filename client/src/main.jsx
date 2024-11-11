//import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// Config Material UI
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import theme from './theme.js'

//Config React Toastify
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Config Redux store
import { Provider } from 'react-redux'
import { store } from '~/redux/store'
//Config react-router-dom with BrowserRouter
import { BrowserRouter } from 'react-router-dom'

//Config Redux-Persist
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
const persistor = persistStore(store)
createRoot(document.getElementById('root')).render(
  <BrowserRouter basename='/'>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <CssVarsProvider theme={theme}>
          <CssBaseline />
          <App />
          <ToastContainer
            position='bottom-left'
            theme='colored'
            autoClose={2000}
          />
        </CssVarsProvider>
      </PersistGate>
    </Provider>
  </BrowserRouter>
)
