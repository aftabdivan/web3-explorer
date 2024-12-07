import { toast } from 'react-toastify'

import store, { AppDispatch } from '@redux/store'

export const showErrorToastMessage = (message: string) => {
  toast.error(message)
  toast.clearWaitingQueue()
}

export const showSuccessToastMessage = (message: string) => {
  toast.success(message)
  toast.clearWaitingQueue()
}

export const capitalizeWord = (name: string) => {
  return name[0].toUpperCase() + name.slice(1)
}

export const { dispatch } = store
