import React from 'react'
import { motion } from 'framer-motion'
import { Gamepad2, Image, Wallet } from 'lucide-react'

import { User } from '../types'

type DashboardPageProps = {
  currentUser: User
}

const DashboardPage: React.FC<DashboardPageProps> = ({ currentUser }) => {
  return (
    <div className="dashboard-page">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        Dashboard
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg"
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <Wallet className="w-12 h-12 mb-4 text-blue-500" />
          <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
            Wallet Balance
          </h3>
          <p className="text-2xl font-bold text-gray-600 dark:text-gray-300">
            {currentUser.ethBalance} ETH
          </p>
          <p className="text-md text-gray-500 dark:text-gray-400">
            {currentUser.tokenBalance} Tokens
          </p>
        </motion.div>
        <motion.div
          className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg"
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <Gamepad2 className="w-12 h-12 mb-4 text-green-500" />
          <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
            GameFi Tokens
          </h3>
          <p className="text-2xl font-bold text-gray-600 dark:text-gray-300">
            {currentUser.gameTokens}
          </p>
          <p className="text-md text-gray-500 dark:text-gray-400">
            Play to earn more!
          </p>
        </motion.div>
        <motion.div
          className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg"
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <Image className="w-12 h-12 mb-4 text-purple-500" />
          <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
            NFT Collection
          </h3>
          <p className="text-2xl font-bold text-gray-600 dark:text-gray-300">
            Added NFT feature
          </p>
          <p className="text-md text-gray-500 dark:text-gray-400">
            Explore the NFT features!
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default DashboardPage
