import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useWeb3React } from '@web3-react/core'

const FAUCET_AMOUNT = 100
const FAUCET_COOLDOWN = 3600000 // 1 hour in milliseconds

const CustomTestTokenFaucet: React.FC = () => {
  const { account, active } = useWeb3React()
  const [balance, setBalance] = useState(0)
  const [lastRequestTime, setLastRequestTime] = useState(0)

  useEffect(() => {
    if (active && account) {
      const storedBalance = localStorage.getItem(`testTokenBalance_${account}`)
      const storedLastRequestTime = localStorage.getItem(
        `lastRequestTime_${account}`
      )
      if (storedBalance) setBalance(parseInt(storedBalance))
      if (storedLastRequestTime)
        setLastRequestTime(parseInt(storedLastRequestTime))
    }
  }, [active, account])

  const requestTestTokens = () => {
    if (!active || !account) {
      toast.error('Please connect your wallet first')
      return
    }

    const currentTime = Date.now()
    if (currentTime - lastRequestTime < FAUCET_COOLDOWN) {
      const remainingTime = Math.ceil(
        (FAUCET_COOLDOWN - (currentTime - lastRequestTime)) / 60000
      )
      toast.error(
        `Please wait ${remainingTime} minutes before requesting again`
      )
      return
    }

    const newBalance = balance + FAUCET_AMOUNT
    setBalance(newBalance)
    setLastRequestTime(currentTime)
    localStorage.setItem(`testTokenBalance_${account}`, newBalance.toString())
    localStorage.setItem(`lastRequestTime_${account}`, currentTime.toString())
    toast.success(`${FAUCET_AMOUNT} test tokens added to your balance`)
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mt-6">
      <h2 className="text-2xl font-bold mb-4">Simulated Test Token Faucet</h2>
      <p className="mb-4">
        Use this faucet to get simulated test tokens for your application. No
        real blockchain interaction required!
      </p>
      {active && <p className="mb-4">Current Balance: {balance} TEST</p>}
      <button
        onClick={requestTestTokens}
        disabled={!active}
        className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
      >
        Request Test Tokens
      </button>
    </div>
  )
}

export default CustomTestTokenFaucet
