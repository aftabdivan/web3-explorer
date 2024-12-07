import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useWeb3React } from '@web3-react/core'
import confetti from 'canvas-confetti'
import { ethers } from 'ethers'
import { Clock, Lock, Unlock } from 'lucide-react'

interface TimeCapsule {
  id: string
  message: string
  unlockDate: number
  creator: string
  category: string
  isOpened: boolean
}

const categories = [
  'Personal Goal',
  'Prediction',
  'Message to Future Self',
  'Time Capsule Challenge',
]

const BlockchainTimeCapsulePage: React.FC = () => {
  const { account } = useWeb3React()
  const [capsules, setCapsules] = useState<TimeCapsule[]>([])
  const [newCapsule, setNewCapsule] = useState({
    message: '',
    category: categories[0],
  })
  const [selectedCapsule, setSelectedCapsule] = useState<TimeCapsule | null>(
    null
  )
  const [isRevealing, setIsRevealing] = useState(false)

  useEffect(() => {
    const storedCapsules = localStorage.getItem('timeCapsules')
    if (storedCapsules) {
      setCapsules(JSON.parse(storedCapsules))
    }
  }, [])

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setNewCapsule((prev) => ({ ...prev, [name]: value }))
  }

  const createTimeCapsule = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!account) {
      toast.error('Please connect your wallet first')
      return
    }

    if (!newCapsule.message || !newCapsule.category) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      // Simulate blockchain interaction
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const unlockDate = Date.now() + 60000 // +1 minute from now

      const capsule: TimeCapsule = {
        id: ethers.utils.id(newCapsule.message + Date.now().toString()),
        message: newCapsule.message,
        unlockDate: unlockDate,
        creator: account,
        category: newCapsule.category,
        isOpened: false,
      }

      const updatedCapsules = [...capsules, capsule]
      setCapsules(updatedCapsules)
      localStorage.setItem('timeCapsules', JSON.stringify(updatedCapsules))

      toast.success('Time Capsule created successfully!')
      setNewCapsule({ message: '', category: categories[0] })
    } catch (error) {
      console.error('Error creating Time Capsule:', error)
      toast.error('Failed to create Time Capsule. Please try again.')
    }
  }

  const openTimeCapsule = async (capsule: TimeCapsule) => {
    setSelectedCapsule(capsule)
    if (Date.now() < capsule.unlockDate) {
      const remainingTime = new Date(capsule.unlockDate - Date.now())
      toast.error(
        `This capsule is still locked for ${remainingTime.getUTCMinutes()} minutes and ${remainingTime.getUTCSeconds()} seconds.`
      )
    } else {
      setIsRevealing(true)
      await new Promise((resolve) => setTimeout(resolve, 3000)) // Simulating blockchain interaction
      setIsRevealing(false)

      const updatedCapsules = capsules.map((c) =>
        c.id === capsule.id ? { ...c, isOpened: true } : c
      )
      setCapsules(updatedCapsules)
      localStorage.setItem('timeCapsules', JSON.stringify(updatedCapsules))

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    }
  }

  const getProgressBarWidth = (capsule: TimeCapsule) => {
    const totalTime = capsule.unlockDate - (capsule.unlockDate - 60000)
    const elapsedTime = Date.now() - (capsule.unlockDate - 60000)
    return Math.min((elapsedTime / totalTime) * 100, 100)
  }

  return (
    <div className="blockchain-time-capsule-page">
      <h1 className="text-3xl font-bold mb-6">Blockchain Time Capsule</h1>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-2xl font-bold mb-4">Create a New Time Capsule</h2>
        <form onSubmit={createTimeCapsule} className="space-y-4">
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={newCapsule.message}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            ></textarea>
          </div>
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              value={newCapsule.category}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Create Time Capsule
          </button>
        </form>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Your Time Capsules</h2>
        {capsules.length === 0 ? (
          <p>You haven't created any Time Capsules yet.</p>
        ) : (
          <div className="space-y-4">
            {capsules.map((capsule) => (
              <div
                key={capsule.id}
                className="border rounded-lg p-4 relative overflow-hidden"
              >
                <div
                  className="absolute bottom-0 left-0 h-1 bg-blue-500 transition-all duration-1000"
                  style={{ width: `${getProgressBarWidth(capsule)}%` }}
                ></div>
                <div className="flex justify-between items-center mb-2">
                  <p className="font-bold">{capsule.category}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {capsule.isOpened ? (
                      <span className="text-green-500 flex items-center">
                        <Unlock size={16} className="mr-1" /> Opened
                      </span>
                    ) : (
                      <span className="text-red-500 flex items-center">
                        <Lock size={16} className="mr-1" /> Locked
                      </span>
                    )}
                  </p>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  <Clock size={16} className="inline mr-1" />
                  {new Date(capsule.unlockDate).toLocaleString()}
                </p>
                <button
                  onClick={() => openTimeCapsule(capsule)}
                  className={`mt-2 ${
                    capsule.isOpened
                      ? 'bg-green-500 hover:bg-green-700'
                      : 'bg-blue-500 hover:bg-blue-700'
                  } text-white font-bold py-2 px-4 rounded`}
                  disabled={isRevealing}
                >
                  {capsule.isOpened ? 'View Message' : 'Open Capsule'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedCapsule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">
              {selectedCapsule.category}
            </h3>
            {isRevealing ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4">Decrypting your time capsule...</p>
              </div>
            ) : (
              <>
                <p className="mb-4">{selectedCapsule.message}</p>
                <button
                  onClick={() => setSelectedCapsule(null)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default BlockchainTimeCapsulePage
