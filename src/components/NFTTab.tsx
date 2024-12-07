import React from 'react'
import { motion } from 'framer-motion'

import { User } from '../types'

type NFTTabProps = {
  currentUser: User
}

const NFTTab: React.FC<NFTTabProps> = ({ currentUser }) => {
  return (
    <motion.div
      className="nft-tab"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        NFT Gallery
      </h2>
      <p className="text-center text-gray-600 dark:text-gray-300">
        NFT features coming soon!
      </p>
    </motion.div>
  )
}

export default NFTTab
