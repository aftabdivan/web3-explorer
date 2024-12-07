import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'

import { User } from '../types'

type GameFiPageProps = {
  currentUser: User
  updateUser: (user: User) => void
}

interface Character {
  name: string
  health: number
  attack: number
  defense: number
}

const GameFiPage: React.FC<GameFiPageProps> = ({ currentUser, updateUser }) => {
  const [gameScore, setGameScore] = useState(0)
  const [gameActive, setGameActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const [selectedGame, setSelectedGame] = useState<
    'clickerGame' | 'guessNumber' | null
  >(null)
  const [targetNumber, setTargetNumber] = useState(0)
  const [guess, setGuess] = useState('')

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (gameActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1)
        if (selectedGame === 'clickerGame') {
          setGameScore((prevScore) => prevScore + 1)
        }
      }, 1000)
    } else if (timeLeft === 0) {
      endGame()
    }
    return () => clearInterval(interval)
  }, [gameActive, timeLeft, selectedGame])

  const startGame = (game: 'clickerGame' | 'guessNumber') => {
    setSelectedGame(game)
    setGameActive(true)
    setGameScore(0)
    setTimeLeft(30)
    if (game === 'guessNumber') {
      setTargetNumber(Math.floor(Math.random() * 100) + 1)
    }
  }

  const endGame = () => {
    setGameActive(false)
    let earnedTokens = 0
    if (selectedGame === 'clickerGame') {
      earnedTokens = Math.floor(gameScore / 10)
    } else if (selectedGame === 'guessNumber') {
      earnedTokens = gameScore > 0 ? 20 : 0
    }
    const updatedUser = {
      ...currentUser,
      gameTokens: currentUser.gameTokens + earnedTokens,
    }
    updateUser(updatedUser)
    toast.success(`Game Over! You earned ${earnedTokens} game tokens!`)
    setSelectedGame(null)
  }

  const handleGuess = () => {
    const userGuess = parseInt(guess)
    if (isNaN(userGuess)) {
      toast.error('Please enter a valid number')
      return
    }
    if (userGuess === targetNumber) {
      setGameScore(100)
      endGame()
    } else {
      setGameScore(Math.max(0, gameScore - 10))
      toast.info(userGuess > targetNumber ? 'Too high!' : 'Too low!')
    }
    setGuess('')
  }

  return (
    <div className="gamefi-page">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        GameFi
      </h2>
      <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg">
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
            Your Game Tokens
          </h3>
          <p className="text-2xl font-bold text-gray-600 dark:text-gray-300">
            {currentUser.gameTokens}
          </p>
        </div>
        {!gameActive && (
          <div className="space-y-4">
            <motion.button
              onClick={() => startGame('clickerGame')}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Clicker Game
            </motion.button>
            <motion.button
              onClick={() => startGame('guessNumber')}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Number Guessing Game
            </motion.button>
          </div>
        )}
        {gameActive && selectedGame === 'clickerGame' && (
          <div className="space-y-4">
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Time left: {timeLeft} seconds
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Score: {gameScore}
            </p>
            <motion.button
              onClick={() => setGameScore(gameScore + 1)}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Click Me!
            </motion.button>
          </div>
        )}
        {gameActive && selectedGame === 'guessNumber' && (
          <div className="space-y-4">
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Time left: {timeLeft} seconds
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Score: {gameScore}
            </p>
            <input
              type="number"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
              placeholder="Enter your guess (1-100)"
            />
            <motion.button
              onClick={handleGuess}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Submit Guess
            </motion.button>
          </div>
        )}
      </div>
    </div>
  )
}

export default GameFiPage
