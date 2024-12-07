import React from 'react'
import { motion } from 'framer-motion'

import { User } from '../types'

type SettingsTabProps = {
  currentUser: User
  updateUser?: (user: User) => void
}

const SettingsTab: React.FC<SettingsTabProps> = ({
  currentUser,
  updateUser,
}) => {
  return (
    <motion.div
      className="settings-tab"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        Settings
      </h2>
      <p className="text-center text-gray-600 dark:text-gray-300">
        User settings and preferences coming soon!
      </p>
    </motion.div>
  )
}

export default SettingsTab
