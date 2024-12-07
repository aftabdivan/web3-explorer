import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'

import { NFT, User } from '../types'

type NFTPageProps = {
  currentUser: User
  updateUser: (user: User) => void
}

const NFTPage: React.FC<NFTPageProps> = ({ currentUser, updateUser }) => {
  const [mintName, setMintName] = useState('')

  const mintNFT = () => {
    if (!mintName) {
      toast.error('Please enter a name for your NFT')
      return
    }

    const existingNFT = currentUser.nfts.find(
      (nft) => nft.name.toLowerCase() === mintName.toLowerCase()
    )

    if (existingNFT) {
      toast.error('An NFT with this name already exists')
      return
    }

    const newNFT: NFT = {
      id: currentUser.nfts.length + 1,
      name: mintName,
      image: `https://picsum.photos/seed/${Math.random()}/200/200`,
    }

    const updatedUser = {
      ...currentUser,
      nfts: [...currentUser.nfts, newNFT],
    }

    updateUser(updatedUser)
    toast.success('NFT minted successfully!')
    setMintName('')
  }

  return (
    <div className="nft-page">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        NFT Collection
      </h2>
      <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg mb-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          Mint New NFT
        </h3>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={mintName}
            onChange={(e) => setMintName(e.target.value)}
            placeholder="Enter NFT name"
            className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
          />
          <motion.button
            onClick={mintNFT}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Mint NFT
          </motion.button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentUser.nfts.map((nft: any) => (
          <motion.div
            key={nft.id}
            className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <img
              src={nft.image}
              alt={nft.name}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              {nft.name}
            </h3>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default NFTPage
