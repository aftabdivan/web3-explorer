import React, { useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import { AnimatePresence, motion } from 'framer-motion'
import * as Yup from 'yup'

import { User } from '../types'

import 'react-toastify/dist/ReactToastify.css'

type WalletTabProps = {
  currentUser: User
  updateUser?: (user: User) => void
}

const WalletTab: React.FC<WalletTabProps> = ({ currentUser, updateUser }) => {
  const [isLoading, setIsLoading] = useState(false)

  const addFundsSchema = Yup.object().shape({
    accountName: Yup.string().required('Account name is required'),
    accountNumber: Yup.string()
      .required('Account number is required')
      .matches(/^\d{10}$/, 'Account number must be 10 digits'),
    routingNumber: Yup.string()
      .required('Routing number is required')
      .matches(/^\d{9}$/, 'Routing number must be 9 digits'),
    amount: Yup.number()
      .required('Amount is required')
      .positive('Amount must be positive')
      .max(10000, 'Maximum amount is 10,000'),
  })

  const withdrawFundsSchema = Yup.object().shape({
    amount: Yup.number()
      .required('Amount is required')
      .positive('Amount must be positive')
      .max(parseFloat(currentUser.ethBalance), 'Insufficient funds'),
    destinationAccount: Yup.string().required(
      'Destination account is required'
    ),
  })

  const simulateBankTransfer = (amount: number): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Simulated bank transfer of ${amount} completed`)
        resolve()
      }, 2000)
    })
  }

  const sendNotification = (type: 'email' | 'sms', message: string) => {
    console.log(`Sending ${type}: ${message}`)
    toast.success(`${type.toUpperCase()} sent: ${message}`)
  }

  const handleAddFunds = async (values: any, { resetForm }: any) => {
    setIsLoading(true)
    try {
      await simulateBankTransfer(values.amount)
      const updatedUser = {
        ...currentUser,
        ethBalance: (
          parseFloat(currentUser.ethBalance) + values.amount
        ).toFixed(4),
      }
      updateUser && updateUser(updatedUser)
      resetForm()
      sendNotification(
        'email',
        `${values.amount} ETH has been added to your wallet.`
      )
      sendNotification('sms', `${values.amount} ETH added to your wallet.`)
    } catch (error) {
      toast.error('Failed to add funds. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleWithdrawFunds = async (values: any, { resetForm }: any) => {
    setIsLoading(true)
    try {
      await simulateBankTransfer(values.amount)
      const updatedUser = {
        ...currentUser,
        ethBalance: (
          parseFloat(currentUser.ethBalance) - values.amount
        ).toFixed(4),
      }
      updateUser && updateUser(updatedUser)
      resetForm()
      sendNotification(
        'email',
        `${values.amount} ETH has been withdrawn from your wallet to account ${values.destinationAccount}.`
      )
      sendNotification(
        'sms',
        `${values.amount} ETH withdrawn to account ${values.destinationAccount}.`
      )
    } catch (error) {
      toast.error('Failed to withdraw funds. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const convertToCrypto = (amount: number) => {
    const ethPrice = 2000
    const btcPrice = 30000
    return {
      eth: (amount / ethPrice).toFixed(6),
      btc: (amount / btcPrice).toFixed(6),
    }
  }

  return (
    <motion.div
      className="wallet-tab"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ToastContainer position="top-right" autoClose={5000} />
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Wallet Dashboard
      </h2>
      <motion.div
        className="wallet-info bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg shadow-lg mb-8"
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <p className="text-xl mb-2">
          <strong>Address:</strong> {currentUser.address}
        </p>
        <p className="text-2xl mb-2">
          <strong>ETH Balance:</strong> {currentUser.ethBalance} ETH
        </p>
        <p className="text-xl">
          <strong>Token Balance:</strong> {currentUser.tokenBalance} TOKENS
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          className="add-funds"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-2xl font-semibold mb-4 text-gray-700">
            Add Funds
          </h3>
          <Formik
            initialValues={{
              accountName: '',
              accountNumber: '',
              routingNumber: '',
              amount: '',
            }}
            validationSchema={addFundsSchema}
            onSubmit={handleAddFunds}
          >
            {({ values }: any) => (
              <>
                <Form className="space-y-4">
                  <div>
                    <Field
                      name="accountName"
                      placeholder="Account Name"
                      className="w-full p-2 border rounded"
                    />
                    <ErrorMessage
                      name="accountName"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div>
                    <Field
                      name="accountNumber"
                      placeholder="Account Number"
                      className="w-full p-2 border rounded"
                    />
                    <ErrorMessage
                      name="accountNumber"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div>
                    <Field
                      name="routingNumber"
                      placeholder="Routing Number"
                      className="w-full p-2 border rounded"
                    />
                    <ErrorMessage
                      name="routingNumber"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div>
                    <Field
                      name="amount"
                      type="number"
                      placeholder="Amount in ETH"
                      className="w-full p-2 border rounded"
                    />
                    <ErrorMessage
                      name="amount"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <motion.button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processing...' : 'Add Funds'}
                  </motion.button>
                </Form>
                <AnimatePresence>
                  {values.amount && (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-4 text-gray-600"
                    >
                      Equivalent:{' '}
                      {convertToCrypto(parseFloat(values.amount)).eth} ETH /{' '}
                      {convertToCrypto(parseFloat(values.amount)).btc} BTC
                    </motion.p>
                  )}
                </AnimatePresence>
              </>
            )}
          </Formik>
        </motion.div>

        <motion.div
          className="withdraw-funds"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-2xl font-semibold mb-4 text-gray-700">
            Withdraw Funds
          </h3>
          <Formik
            initialValues={{ amount: '', destinationAccount: '' }}
            validationSchema={withdrawFundsSchema}
            onSubmit={handleWithdrawFunds}
          >
            <Form className="space-y-4">
              <div>
                <Field
                  name="amount"
                  type="number"
                  placeholder="Amount in ETH"
                  className="w-full p-2 border rounded"
                />
                <ErrorMessage
                  name="amount"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div>
                <Field
                  name="destinationAccount"
                  placeholder="Destination Account"
                  className="w-full p-2 border rounded"
                />
                <ErrorMessage
                  name="destinationAccount"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <motion.button
                type="submit"
                className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700 transition duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Withdraw Funds'}
              </motion.button>
            </Form>
          </Formik>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default WalletTab
