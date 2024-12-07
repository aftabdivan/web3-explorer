import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { AnimatePresence, motion } from 'framer-motion'

import { User } from '../types'

import 'react-toastify/dist/ReactToastify.css'

type GameFiTabProps = {
  currentUser: User
  updateUser?: (user: User) => void
}

const GameFiTab: React.FC<GameFiTabProps> = ({ currentUser, updateUser }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [gameState, setGameState] = useState({
    isPlaying: false,
    score: 0,
    timeLeft: 10,
  })

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (gameState.isPlaying && gameState.timeLeft > 0) {
      timer = setTimeout(() => {
        setGameState((prevState) => ({
          ...prevState,
          score: prevState.score + Math.floor(Math.random() * 10) + 1,
          timeLeft: prevState.timeLeft - 1,
        }))
      }, 1000)
    } else if (gameState.isPlaying && gameState.timeLeft === 0) {
      endGame()
    }
    return () => clearTimeout(timer)
  }, [gameState])

  const playToEarn = () => {
    setIsLoading(true)
    setGameState({ isPlaying: true, score: 0, timeLeft: 10 })
  }

  const endGame = () => {
    const earnedTokens = gameState.score
    const updatedUser = {
      ...currentUser,
      gameTokens: currentUser.gameTokens + earnedTokens,
      tokenBalance: currentUser.tokenBalance + earnedTokens,
    }
    updateUser && updateUser(updatedUser)
    setIsLoading(false)
    setGameState({ isPlaying: false, score: 0, timeLeft: 10 })
    toast.success(`Game Over! You earned ${earnedTokens} game tokens!`)
  }

  const withdrawToWallet = async () => {
    setIsLoading(true)
    try {
      const amount = parseInt(withdrawAmount)
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Please enter a valid amount')
      }
      if (amount > currentUser.gameTokens) {
        throw new Error('Insufficient game tokens')
      }

      await simulateBlockchainTransaction(amount)

      const updatedUser = {
        ...currentUser,
        gameTokens: currentUser.gameTokens - amount,
        tokenBalance: currentUser.tokenBalance + amount,
      }
      updateUser && updateUser(updatedUser)
      setWithdrawAmount('')
      toast.success(`Successfully withdrawn ${amount} tokens to your wallet!`)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const simulateBlockchainTransaction = (amount: number): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(
          `Simulated blockchain transaction of ${amount} tokens completed`
        )
        resolve()
      }, 2000)
    })
  }

  return (
    <motion.div
      className="gamefi-tab"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        GameFi Hub
      </h2>
      <motion.div
        className="game-info bg-gradient-to-r from-green-500 to-teal-600 text-white p-6 rounded-lg shadow-lg mb-8"
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <p className="text-2xl mb-2">
          <strong>Game Tokens:</strong> {currentUser.gameTokens}
        </p>
      </motion.div>

      <AnimatePresence>
        {gameState.isPlaying ? (
          <motion.div
            className="game-container bg-white p-6 rounded-lg shadow-md mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <p className="text-xl mb-2">
              Playing game... Current score: {gameState.score}
            </p>
            <p className="text-lg mb-4">
              Time left: {gameState.timeLeft} seconds
            </p>
            <motion.div className="progress-bar bg-gray-200 rounded-full h-4 overflow-hidden">
              <motion.div
                className="h-full bg-blue-600"
                initial={{ width: '100%' }}
                animate={{ width: `${(gameState.timeLeft / 10) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </motion.div>
          </motion.div>
        ) : (
          <motion.button
            onClick={playToEarn}
            className="w-full bg-green-600 text-white p-3 rounded-lg text-xl font-semibold hover:bg-green-700 transition duration-300 mb-8"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isLoading}
          >
            {isLoading ? 'Initializing Game...' : 'Play to Earn'}
          </motion.button>
        )}
      </AnimatePresence>

      <div className="withdraw-section bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold mb-4 text-gray-700">
          Withdraw Game Tokens to Wallet
        </h3>
        <div className="flex space-x-4">
          <input
            type="number"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            placeholder="Amount"
            className="flex-grow p-2 border rounded"
          />
          <motion.button
            onClick={withdrawToWallet}
            className="bg-purple-600 text-white p-2 rounded hover:bg-purple-700 transition duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isLoading || !withdrawAmount}
          >
            {isLoading ? 'Processing...' : 'Withdraw to Wallet'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default GameFiTab
