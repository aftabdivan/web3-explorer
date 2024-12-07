import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'

import CustomTestTokenFaucet from './CustomTestTokenFaucet'
import WalletConnectModal from './WalletConnectModal'

const Web3Wallet: React.FC = () => {
  const { account, active, library, deactivate } = useWeb3React<Web3Provider>()
  const [balance, setBalance] = useState<string>('0')
  const [recipient, setRecipient] = useState<string>('')
  const [amount, setAmount] = useState<string>('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    if (active && account && library) {
      fetchBalance()
    }
  }, [active, account, library])

  const fetchBalance = async () => {
    if (library && account) {
      try {
        const balance = await library.getBalance(account)
        setBalance(ethers.utils.formatEther(balance))
      } catch (error) {
        console.error('Error fetching balance:', error)
        toast.error('Failed to fetch balance')
      }
    }
  }

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleDisconnect = async () => {
    try {
      deactivate()
      toast.success('Wallet disconnected')
    } catch (error) {
      console.error('Failed to disconnect:', error)
      toast.error('Failed to disconnect wallet')
    }
  }

  const handleTransfer = async () => {
    if (library && account) {
      try {
        const signer = library.getSigner()
        const tx = await signer.sendTransaction({
          to: recipient,
          value: ethers.utils.parseEther(amount),
        })
        toast.info('Transaction sent. Waiting for confirmation...')
        await tx.wait()
        toast.success('Transfer successful')
        fetchBalance()
        setRecipient('')
        setAmount('')
      } catch (error) {
        console.error('Transfer failed:', error)
        toast.error(
          'Transfer failed. Please check the recipient address and amount.'
        )
      }
    }
  }

  return (
    <div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Web3 Wallet</h2>
        {!active ? (
          <button
            onClick={handleOpenModal}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Connect Wallet
          </button>
        ) : (
          <div>
            <p className="mb-2">Connected Account: {account}</p>
            <p className="mb-4">Balance: {balance} ETH</p>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Recipient Address"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <button
              onClick={handleTransfer}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
            >
              Transfer
            </button>
            <button
              onClick={handleDisconnect}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Disconnect Wallet
            </button>
          </div>
        )}
        <WalletConnectModal
          isOpen={isModalOpen}
          closeModal={handleCloseModal}
        />
      </div>
      {active && <CustomTestTokenFaucet />}
    </div>
  )
}

export default Web3Wallet
