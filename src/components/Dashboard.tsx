import React, { useState } from 'react'

import DeFiTab from '@components/DeFiTab'
import GameFiTab from '@components/GameFiTab'
import NFTTab from '@components/NFTTab'
import SettingsTab from '@components/SettingsTab'
import WalletTab from '@components/WalletTab'
import { capitalizeWord } from '@util/utils'

import { User } from '../types'

type DashboardProps = {
  currentUser: User
  updateUser: (user: User) => void
  users: User[]
}

const Dashboard: React.FC<DashboardProps> = ({
  currentUser,
  updateUser,
  users,
}) => {
  const [activeTab, setActiveTab] = useState('wallet')

  return (
    <div className="dashboard my-5">
      <h1 style={{ marginBottom: '1rem', color: '#2c3e50' }}>
        Welcome, {capitalizeWord(currentUser.username)}!
      </h1>
      <div className="tabs">
        <button
          onClick={() => setActiveTab('wallet')}
          className={activeTab === 'wallet' ? 'active' : ''}
        >
          Wallet
        </button>
        <button
          onClick={() => setActiveTab('defi')}
          className={activeTab === 'defi' ? 'active' : ''}
        >
          DeFi
        </button>
        <button
          onClick={() => setActiveTab('nft')}
          className={activeTab === 'nft' ? 'active' : ''}
        >
          NFT
        </button>
        <button
          onClick={() => setActiveTab('gamefi')}
          className={activeTab === 'gamefi' ? 'active' : ''}
        >
          GameFi
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={activeTab === 'settings' ? 'active' : ''}
        >
          Settings
        </button>
      </div>
      <div className="tab-content">
        {activeTab === 'wallet' && (
          <WalletTab currentUser={currentUser} updateUser={updateUser} />
        )}
        {activeTab === 'defi' && (
          <DeFiTab
            currentUser={currentUser}
            updateUser={updateUser}
            users={users}
          />
        )}
        {activeTab === 'nft' && <NFTTab currentUser={currentUser} />}
        {activeTab === 'gamefi' && (
          <GameFiTab currentUser={currentUser} updateUser={updateUser} />
        )}
        {activeTab === 'settings' && (
          <SettingsTab currentUser={currentUser} updateUser={updateUser} />
        )}
      </div>
    </div>
  )
}

export default Dashboard
