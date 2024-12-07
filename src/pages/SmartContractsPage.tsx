import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useWeb3React } from '@web3-react/core'

import CustomTestTokenFaucet from '../components/CustomTestTokenFaucet'

interface DeployedContract {
  id: string
  address: string
  name: string
  symbol: string
  deploymentFee: number
}

const DEPLOYMENT_FEE = 10 // 10 test tokens

const SmartContractsPage: React.FC = () => {
  const { account, active } = useWeb3React()
  const [contractName, setContractName] = useState('')
  const [contractSymbol, setContractSymbol] = useState('')
  const [deployedContracts, setDeployedContracts] = useState<
    DeployedContract[]
  >([])
  const [balance, setBalance] = useState(0)
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(
    null
  )

  useEffect(() => {
    if (active && account) {
      const storedContracts = localStorage.getItem(
        `deployedContracts_${account}`
      )
      const storedBalance = localStorage.getItem(`testTokenBalance_${account}`)
      if (storedContracts) setDeployedContracts(JSON.parse(storedContracts))
      if (storedBalance) setBalance(parseInt(storedBalance))
    }
  }, [active, account])

  const handleDeploy = () => {
    if (!active || !account) {
      toast.error('Please connect your wallet first')
      return
    }

    if (balance < DEPLOYMENT_FEE) {
      toast.error('Insufficient balance to deploy contract')
      return
    }

    if (!contractName || !contractSymbol) {
      toast.error('Please enter both contract name and symbol')
      return
    }

    if (contractName.length > 50) {
      toast.error('Token name must be 50 characters or less')
      return
    }

    if (contractSymbol.length > 11) {
      toast.error('Token symbol must be 11 characters or less')
      return
    }

    const newContract: DeployedContract = {
      id: Date.now().toString(),
      address: `0x${Math.random().toString(16).substr(2, 40)}`,
      name: contractName,
      symbol: contractSymbol.toUpperCase(),
      deploymentFee: DEPLOYMENT_FEE,
    }

    const updatedContracts = [...deployedContracts, newContract]
    const newBalance = balance - DEPLOYMENT_FEE

    setDeployedContracts(updatedContracts)
    setBalance(newBalance)
    localStorage.setItem(
      `deployedContracts_${account}`,
      JSON.stringify(updatedContracts)
    )
    localStorage.setItem(`testTokenBalance_${account}`, newBalance.toString())

    toast.success(`Contract deployed at ${newContract.address}`)
    setContractName('')
    setContractSymbol('')
  }

  const handleDelete = (id: string) => {
    setDeleteConfirmation(id)
  }

  const confirmDelete = (id: string) => {
    const updatedContracts = deployedContracts.filter(
      (contract) => contract.id !== id
    )
    setDeployedContracts(updatedContracts)
    localStorage.setItem(
      `deployedContracts_${account}`,
      JSON.stringify(updatedContracts)
    )
    setDeleteConfirmation(null)
    toast.success('Contract deleted successfully')
  }

  return (
    <div className="smart-contracts-page">
      <h1 className="text-3xl font-bold mb-6">Smart Contracts</h1>
      <CustomTestTokenFaucet />
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mt-6">
        <h2 className="text-2xl font-bold mb-4">Deploy New Token Contract</h2>
        <p className="mb-4">Current Balance: {balance} TEST</p>
        <div className="mb-4">
          <label
            htmlFor="contractName"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Token Name (max 50 characters)
          </label>
          <input
            type="text"
            id="contractName"
            value={contractName}
            onChange={(e) => setContractName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="e.g. Decentralized Finance Token"
            maxLength={50}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="contractSymbol"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Token Symbol (max 11 characters)
          </label>
          <input
            type="text"
            id="contractSymbol"
            value={contractSymbol}
            onChange={(e) => setContractSymbol(e.target.value.toUpperCase())}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="e.g. DFT"
            maxLength={11}
          />
        </div>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Deployment Fee: {DEPLOYMENT_FEE} TEST
        </p>
        <button
          onClick={handleDeploy}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={!active || balance < DEPLOYMENT_FEE}
        >
          Deploy Contract
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mt-6">
        <h2 className="text-2xl font-bold mb-4">Deployed Contracts</h2>
        {deployedContracts.length === 0 ? (
          <p>No contracts deployed yet.</p>
        ) : (
          <ul>
            {deployedContracts.map((contract) => (
              <li key={contract.id} className="mb-4 p-4 border rounded">
                <p>
                  <strong>Name:</strong> {contract.name}
                </p>
                <p>
                  <strong>Symbol:</strong> {contract.symbol}
                </p>
                <p>
                  <strong>Address:</strong> {contract.address}
                </p>
                <p>
                  <strong>Deployment Fee:</strong> {contract.deploymentFee} TEST
                </p>
                {deleteConfirmation === contract.id ? (
                  <div className="mt-2">
                    <p className="text-red-500">
                      Are you sure you want to delete this contract?
                    </p>
                    <button
                      onClick={() => confirmDelete(contract.id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded mr-2 mt-2"
                    >
                      Confirm Delete
                    </button>
                    <button
                      onClick={() => setDeleteConfirmation(null)}
                      className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded mt-2"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleDelete(contract.id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded mt-2"
                  >
                    Delete
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default SmartContractsPage
