import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogOut, Moon, Sun } from 'lucide-react'

type NavbarProps = {
  darkMode: boolean
  toggleDarkMode: () => void
  onLogout: () => void
}

const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  toggleDarkMode,
  onLogout,
}) => {
  const location = useLocation()
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', path: '/' },
    { id: 'wallet', label: 'Wallet', path: '/wallet' },
    { id: 'gamefi', label: 'GameFi', path: '/gamefi' },
    { id: 'defi', label: 'DeFi', path: '/defi' },
    { id: 'nft', label: 'NFTs', path: '/nft' },
    {
      id: 'smart_ontracts',
      label: 'Smart Contracts',
      path: '/smart-contracts',
    },
    {
      id: 'block_explorer',
      label: 'Block Explorer',
      path: '/block-explorer',
    },
    {
      id: 'time_capsule',
      label: 'Time Capsule',
      path: '/time-capsule',
    },
    { id: 'settings', label: 'Settings', path: '/settings' },
  ]

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <img
              src="/web3-explorer-logo.svg"
              alt="Web3 Explorer Logo"
              className="h-8 w-8 mr-2"
            />
            <span className="text-xl font-bold text-gray-800 dark:text-white">
              Web3 Explorer
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                to={tab.path}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === tab.path
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {tab.label}
              </Link>
            ))}
            <motion.button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {darkMode ? (
                <Sun className="text-yellow-400" />
              ) : (
                <Moon className="text-gray-800" />
              )}
            </motion.button>
            <motion.button
              onClick={onLogout}
              className="p-2 rounded-full bg-red-500 text-white"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <LogOut className="h-5 w-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
