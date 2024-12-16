import { toast } from 'react-toastify'

export const handleFeatureInDevelopment = () => {
  toast.warn('This feature is under development!', {
    position: 'bottom-right',
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light'
  })
}
