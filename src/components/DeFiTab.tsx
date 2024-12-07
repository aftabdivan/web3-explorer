import React, { useState } from 'react'

import {
  capitalizeWord,
  showErrorToastMessage,
  showSuccessToastMessage,
} from '@util/utils'

import { User } from '../types'

type DeFiTabProps = {
  currentUser: User
  updateUser: (user: User) => void
  users: User[]
  updateUsers?: (users: User[]) => void
}

const DeFiTab: React.FC<DeFiTabProps> = ({
  currentUser,
  updateUser,
  users,
  updateUsers,
}) => {
  const [transferTo, setTransferTo] = useState('')
  const [transferAmount, setTransferAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const transferTokens = () => {
    setIsLoading(true)
    setTimeout(() => {
      const amount = parseInt(transferAmount)
      const recipientUser = users.find((u) => u.address === transferTo)

      if (currentUser.address === transferTo) {
        showErrorToastMessage('You cannot transfer funds to your own account.')
        setIsLoading(false)
        return
      }

      if (recipientUser) {
        if (+currentUser.tokenBalance < amount) {
          showErrorToastMessage(
            `You don't have enough money in your account to complete this transaction.`
          )
          setIsLoading(false)
          return
        }
        const updatedCurrentUser = {
          ...currentUser,
          tokenBalance: currentUser.tokenBalance - amount,
        }

        const updatedRecipientUser = {
          ...recipientUser,
          tokenBalance: recipientUser.tokenBalance + amount,
        }

        const updatedUsers = users.map((user) =>
          user.id === updatedCurrentUser.id
            ? updatedCurrentUser
            : user.id === updatedRecipientUser.id
            ? updatedRecipientUser
            : user
        )

        updateUser(updatedCurrentUser)
        updateUsers && updateUsers(updatedUsers)

        setTransferTo('')
        setTransferAmount('')
        showSuccessToastMessage(
          `Successfully transferred ${amount} tokens to ${capitalizeWord(
            recipientUser.username
          )}`
        )
      } else {
        showErrorToastMessage('Recipient not found')
      }
      setIsLoading(false)
    }, 2000)
  }

  return (
    <div className="defi-tab">
      <h2>DeFi Operations</h2>
      <div className="form-group">
        <label htmlFor="transferTo">Recipient Address</label>
        <input
          type="text"
          id="transferTo"
          value={transferTo}
          onChange={(e) => setTransferTo(e.target.value)}
          placeholder="0x..."
        />
      </div>
      <div className="form-group">
        <label htmlFor="transferAmount">Amount</label>
        <input
          type="number"
          id="transferAmount"
          value={transferAmount}
          onChange={(e) => setTransferAmount(e.target.value)}
          placeholder="0"
        />
      </div>
      <button
        onClick={transferTokens}
        className="btn btn-primary"
        disabled={isLoading || !transferTo || !transferAmount}
      >
        {isLoading ? 'Transferring...' : 'Transfer Tokens'}
      </button>
    </div>
  )
}

export default DeFiTab
