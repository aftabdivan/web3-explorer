import React, { Fragment, useState } from 'react'
import { toast } from 'react-toastify'
import { Dialog, Transition } from '@headlessui/react'
import { useWeb3React } from '@web3-react/core'

import { injectedConnector } from '../util/web3'

interface WalletConnectModalProps {
  isOpen: boolean
  closeModal: () => void
}

const WalletConnectModal: React.FC<WalletConnectModalProps> = ({
  isOpen,
  closeModal,
}) => {
  const { activate } = useWeb3React()
  const [isConnecting, setIsConnecting] = useState(false)

  const [, updateState] = React.useState({})
  const forceUpdate = React.useCallback(() => updateState({}), [])

  const connectWallet = async () => {
    setIsConnecting(true)
    try {
      await activate(injectedConnector, undefined, true)
      forceUpdate()
      toast.success('Wallet connected successfully')
      closeModal()
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      toast.error(
        'Failed to connect wallet. Please make sure MetaMask is installed and unlocked.'
      )
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Connect Your Wallet
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Connect your wallet to interact with the Web3 features of
                    this application.
                  </p>
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={connectWallet}
                    disabled={isConnecting}
                  >
                    {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default WalletConnectModal
