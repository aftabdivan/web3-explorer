import React, { useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { Web3Provider } from '@ethersproject/providers'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { useWeb3React, Web3ReactProvider } from '@web3-react/core'

import DeFiTabPage from '@components/DeFiTab'
import Footer from '@components/Footer'
import Navbar from '@components/Navbar'
import { getLibrary } from '@util/web3'
import BlockchainTimeCapsulePage from '@pages/BlockchainTimeCapsulePage'
import BlockExplorerPage from '@pages/BlockExplorerPage'
import DashboardPage from '@pages/DashboardPage'
import GameFiPage from '@pages/GameFiPage'
import LoginPage from '@pages/LoginPage'
import NFTPage from '@pages/NFTPage'
import SettingsPage from '@pages/SettingsPage'
import SignupPage from '@pages/SignupPage'
import SmartContractsPage from '@pages/SmartContractsPage'
import WalletPage from '@pages/WalletPage'
import store from '@redux/store'

import theme from './theme'
import { User } from './types'
import { injectedConnector } from './util/web3'

import 'react-toastify/dist/ReactToastify.css'

const initialUsers: User[] = [
  {
    id: 1,
    username: 'alice',
    password: 'pass123',
    address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    ethBalance: '2.5',
    tokenBalance: 1000,
    nfts: [
      {
        id: 1,
        name: "Alice's NFT #1",
        image: 'https://via.placeholder.com/150',
      },
    ],
    gameTokens: 500,
    avatar: 'https://via.placeholder.com/50',
    email: '',
    phoneNumber: '',
  },
  {
    id: 2,
    username: 'bob',
    password: 'pass456',
    address: '0x37Ec9a8aBFa094b24054422564e68B08aF3114B4',
    ethBalance: '1.8',
    tokenBalance: 750,
    nfts: [
      { id: 2, name: "Bob's NFT #1", image: 'https://via.placeholder.com/150' },
    ],
    gameTokens: 300,
    avatar: 'https://via.placeholder.com/50',
    email: '',
    phoneNumber: '',
  },
]

const WalletConnector: React.FC = () => {
  const { activate } = useWeb3React()

  useEffect(() => {
    const connectWalletOnPageLoad = async () => {
      if (localStorage.getItem('isWalletConnected') === 'true') {
        try {
          await activate(injectedConnector)
          localStorage.setItem('isWalletConnected', 'true')
        } catch (error) {
          console.error('Failed to connect to wallet:', error)
        }
      }
    }
    connectWalletOnPageLoad()
  }, [activate])

  return null
}

const App: React.FC = () => {
  const { active, account } = useWeb3React()
  const [darkMode, setDarkMode] = useState(false)
  const [users, setUsers] = useState<User[]>(() => {
    const storedUsers = localStorage.getItem('users')
    return storedUsers ? JSON.parse(storedUsers) : initialUsers
  })
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('currentUser')
    return storedUser ? JSON.parse(storedUser) : null
  })

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const handleLogin = (username: string, password: string) => {
    const user = users.find(
      (u) => u.username === username && u.password === password
    )
    if (user) {
      setCurrentUser(user)
      return true
    }
    return false
  }

  const handleSignup = (user: User) => {
    const newUser: User = {
      id: users.length + 1,
      username: user.username,
      password: user.password,
      address: `0x${Math.random().toString(16).substr(2, 40)}`,
      ethBalance: '0',
      tokenBalance: 0,
      nfts: [],
      gameTokens: 0,
      avatar: 'https://via.placeholder.com/50',
      email: user.email,
      phoneNumber: user.phoneNumber,
    }
    setUsers([...users, newUser])
    setCurrentUser(newUser)
  }

  const handleLogout = () => {
    setCurrentUser(null)
  }

  const updateUser = (updatedUser: User) => {
    setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)))
    if (currentUser && currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser)
    }
  }

  const updateUsers = (updatedUsers: User[]) => {
    setUsers(updatedUsers)
  }

  const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({
    element,
  }) => {
    return currentUser ? element : <Navigate to="/login" replace />
  }

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users))
  }, [users])

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser))
    } else {
      localStorage.removeItem('currentUser')
    }
  }, [currentUser])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Provider store={store}>
        <Web3ReactProvider getLibrary={getLibrary}>
          <Router>
            <div
              className={`min-h-screen flex flex-col ${darkMode ? 'dark' : ''}`}
            >
              <ToastContainer position="top-right" autoClose={5000} />
              <WalletConnector />
              {currentUser && (
                <Navbar
                  darkMode={darkMode}
                  toggleDarkMode={toggleDarkMode}
                  onLogout={handleLogout}
                />
              )}
              <main className="flex-grow container mx-auto px-4 py-8">
                <Routes>
                  <Route
                    path="/login"
                    element={<LoginPage onLogin={handleLogin} />}
                  />
                  <Route
                    path="/signup"
                    element={<SignupPage onSignup={handleSignup} />}
                  />
                  <Route
                    path="/"
                    element={
                      <PrivateRoute
                        element={<DashboardPage currentUser={currentUser!} />}
                      />
                    }
                  />
                  <Route
                    path="/wallet"
                    element={
                      <PrivateRoute
                        element={
                          <WalletPage
                            currentUser={currentUser!}
                            updateUser={updateUser}
                          />
                        }
                      />
                    }
                  />
                  <Route
                    path="/defi"
                    element={
                      <PrivateRoute
                        element={
                          <DeFiTabPage
                            currentUser={currentUser!}
                            updateUser={updateUser}
                            users={users}
                            updateUsers={updateUsers}
                          />
                        }
                      />
                    }
                  />
                  <Route
                    path="/gamefi"
                    element={
                      <PrivateRoute
                        element={
                          <GameFiPage
                            currentUser={currentUser!}
                            updateUser={updateUser}
                          />
                        }
                      />
                    }
                  />
                  <Route
                    path="/nft"
                    element={
                      <PrivateRoute
                        element={
                          <NFTPage
                            currentUser={currentUser!}
                            updateUser={updateUser}
                          />
                        }
                      />
                    }
                  />
                  <Route
                    path="/time-capsule"
                    element={<BlockchainTimeCapsulePage />}
                  />
                  <Route
                    path="/settings"
                    element={
                      <PrivateRoute
                        element={
                          <SettingsPage
                            currentUser={currentUser!}
                            updateUser={updateUser}
                            // users={users}
                          />
                        }
                      />
                    }
                  />
                  <Route
                    path="/smart-contracts"
                    element={<SmartContractsPage />}
                  />
                  <Route
                    path="/block-explorer"
                    element={<BlockExplorerPage />}
                  />
                </Routes>
              </main>
              {currentUser && <Footer />}
            </div>
          </Router>
        </Web3ReactProvider>
      </Provider>
    </ThemeProvider>
  )
}

export default App
