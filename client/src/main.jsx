//import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
// Config Material UI
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import GlobalStyles from '@mui/material/GlobalStyles'
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
//Confirm dialog
import { ConfirmProvider } from 'material-ui-confirm'
const persistor = persistStore(store)
//Inject Store
import { injectStore } from './utils/authorizedAxios.js'
injectStore(store)
createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <BrowserRouter
        future={{
          v7_relativeSplatPath: true,
          v7_startTransition: true
        }}
        basename='/'
      >
        <CssVarsProvider theme={theme}>
          <ConfirmProvider
            defaultOptions={{
              allowClose: false,
              dialogProps: { maxWidth: 'xs' },
              buttonOrder: ['confirm', 'cancel'],
              cancellationButtonProps: { color: 'inherit' },
              confirmationButtonProps: {
                variant: 'outlined'
              }
            }}
          >
            <GlobalStyles styles={{ a: { textDecoration: 'none' } }} />
            <CssBaseline />
            <App />
            <ToastContainer
              position='bottom-left'
              theme='colored'
              autoClose={2000}
            />
          </ConfirmProvider>
        </CssVarsProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>
)
