import React from 'react'
import { motion } from 'framer-motion'
import { Github, Linkedin, Twitter } from 'lucide-react'

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 shadow-md mt-8">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-600 dark:text-gray-300 mb-4 md:mb-0">
            © 2024 Web3 Explorer. All rights reserved.
          </div>
          <div className="flex space-x-4">
            <motion.a
              href="https://github.com/aftabdivan/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Github className="text-gray-600 dark:text-gray-300" />
            </motion.a>
            <motion.a
              href="https://x.com/divanaftab"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Twitter className="text-gray-600 dark:text-gray-300" />
            </motion.a>
            <motion.a
              href="https://in.linkedin.com/in/aftab-divan-39b9041bb"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Linkedin className="text-gray-600 dark:text-gray-300" />
            </motion.a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
