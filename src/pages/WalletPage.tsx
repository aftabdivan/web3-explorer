import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'

import Web3Wallet from '@components/Web3Wallet'

import { User } from '../types'

type WalletPageProps = {
  currentUser: User
  updateUser: (user: User) => void
}

const WalletPage: React.FC<WalletPageProps> = ({ currentUser, updateUser }) => {
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [bankName, setBankName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [ifscCode, setIfscCode] = useState('')
  const [otp, setOtp] = useState('')
  const [showOtpInput, setShowOtpInput] = useState(false)
  const [transactionType, setTransactionType] = useState<
    'deposit' | 'withdraw' | null
  >(null)
  const [generatedOtp, setGeneratedOtp] = useState('')

  const generateOtp = () => {
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString()
    setGeneratedOtp(newOtp)
    return newOtp
  }

  const sendNotification = (type: 'sms' | 'email', message: string) => {
    console.log(`Simulated ${type.toUpperCase()} notification:`, message)
    toast.info(`${type.toUpperCase()} notification sent! (Check console)`)
  }

  const verifyBankDetails = () => {
    // Simulating bank verification process
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        const isValid =
          bankName.length > 0 &&
          accountNumber.length === 10 &&
          ifscCode.length === 11
        resolve(isValid)
      }, 1500)
    })
  }

  const handleTransaction = async (type: 'deposit' | 'withdraw') => {
    const transactionAmount = parseFloat(amount)

    if (isNaN(transactionAmount) || transactionAmount <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    if (
      type === 'withdraw' &&
      transactionAmount > parseFloat(currentUser.ethBalance)
    ) {
      toast.error('Insufficient balance for withdrawal')
      return
    }

    setIsLoading(true)

    try {
      const bankVerified = await verifyBankDetails()
      if (!bankVerified) {
        toast.error(
          'Bank details verification failed. Please check your information.'
        )
        setIsLoading(false)
        return
      }

      const generatedOtp = generateOtp()
      sendNotification(
        'sms',
        `Your OTP for the ${type} of ${transactionAmount} ETH is: ${generatedOtp}`
      )
      sendNotification(
        'email',
        `Your OTP for the ${type} of ${transactionAmount} ETH is: ${generatedOtp}`
      )

      setShowOtpInput(true)
      setTransactionType(type)
    } catch (error) {
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const verifyOtpAndCompleteTransaction = async () => {
    setIsLoading(true)

    try {
      if (otp !== generatedOtp) {
        toast.error('Invalid OTP. Please try again.')
        setIsLoading(false)
        return
      }

      const transactionAmount = parseFloat(amount)
      let updatedBalance: number

      if (transactionType === 'deposit') {
        updatedBalance = parseFloat(currentUser.ethBalance) + transactionAmount
      } else {
        updatedBalance = parseFloat(currentUser.ethBalance) - transactionAmount
      }

      const updatedUser = {
        ...currentUser,
        ethBalance: updatedBalance.toFixed(2),
      }

      updateUser(updatedUser)
      toast.success(
        `Successfully ${
          transactionType === 'deposit' ? 'deposited' : 'withdrawn'
        } ${transactionAmount} ETH`
      )
      sendNotification(
        'sms',
        `Your ${transactionType} of ${transactionAmount} ETH was successful.`
      )
      sendNotification(
        'email',
        `Your ${transactionType} of ${transactionAmount} ETH was successful.`
      )

      setAmount('')
      setShowOtpInput(false)
      setOtp('')
      setTransactionType(null)
      setGeneratedOtp('')
    } catch (error) {
      toast.error('Transaction failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="wallet-page">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        Wallet
      </h2>
      <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg">
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
            Current Balance
          </h3>
          <p className="text-2xl font-bold text-gray-600 dark:text-gray-300">
            {currentUser.ethBalance} ETH
          </p>
        </div>
        <form className="space-y-4">
          <div>
            <label
              htmlFor="bankName"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Bank Name
            </label>
            <input
              type="text"
              id="bankName"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
              required
            />
          </div>
          <div>
            <label
              htmlFor="accountNumber"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Account Number
            </label>
            <input
              type="text"
              id="accountNumber"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
              required
            />
          </div>
          <div>
            <label
              htmlFor="ifscCode"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              IFSC Code
            </label>
            <input
              type="text"
              id="ifscCode"
              value={ifscCode}
              onChange={(e) => setIfscCode(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
              required
            />
          </div>
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Amount (ETH)
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
              required
            />
          </div>
          {showOtpInput ? (
            <>
              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Enter OTP
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                  required
                />
              </div>
              <motion.button
                type="button"
                onClick={verifyOtpAndCompleteTransaction}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isLoading}
              >
                {isLoading
                  ? 'Processing...'
                  : 'Verify OTP and Complete Transaction'}
              </motion.button>
            </>
          ) : (
            <div className="flex space-x-4">
              <motion.button
                type="button"
                onClick={() => handleTransaction('deposit')}
                className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Deposit'}
              </motion.button>
              <motion.button
                type="button"
                onClick={() => handleTransaction('withdraw')}
                className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Withdraw'}
              </motion.button>
            </div>
          )}
        </form>
      </div>
      <Web3Wallet />
    </div>
  )
}

export default WalletPage
