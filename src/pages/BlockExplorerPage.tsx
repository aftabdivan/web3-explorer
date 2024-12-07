import React, { useEffect, useState } from 'react'
import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'

const BlockExplorerPage: React.FC = () => {
  const { library } = useWeb3React<Web3Provider>()
  const [latestBlocks, setLatestBlocks] = useState<any[]>([])
  const [latestTransactions, setLatestTransactions] = useState<any[]>([])

  useEffect(() => {
    const fetchBlockchainData = async () => {
      if (library) {
        try {
          const latestBlockNumber = await library.getBlockNumber()
          const blocks = []
          const transactions = []

          for (let i = 0; i < 5; i++) {
            const block = await library.getBlock(latestBlockNumber - i)
            blocks.push(block)

            if (block.transactions.length > 0) {
              const tx = await library.getTransaction(block.transactions[0])
              transactions.push(tx)
            }
          }

          setLatestBlocks(blocks)
          setLatestTransactions(transactions)
        } catch (error) {
          console.error('Error fetching blockchain data:', error)
        }
      }
    }

    fetchBlockchainData()
    const interval = setInterval(fetchBlockchainData, 15000) // Refresh every 15 seconds

    return () => clearInterval(interval)
  }, [library])

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div className="block-explorer-page">
      <h1 className="text-3xl font-bold mb-6">Block Explorer</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Latest Blocks</h2>
          <ul>
            {latestBlocks.map((block) => (
              <li key={block.number} className="mb-4 p-4 border rounded">
                <p>
                  <strong>Block Number:</strong> {block.number}
                </p>
                <p>
                  <strong>Timestamp:</strong>{' '}
                  {new Date(block.timestamp * 1000).toLocaleString()}
                </p>
                <p>
                  <strong>Transactions:</strong> {block.transactions.length}
                </p>
                <p>
                  <strong>Gas Used:</strong> {block.gasUsed.toString()}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Latest Transactions</h2>
          <ul>
            {latestTransactions.map((tx) => (
              <li key={tx.hash} className="mb-4 p-4 border rounded">
                <p>
                  <strong>Hash:</strong> {formatAddress(tx.hash)}
                </p>
                <p>
                  <strong>From:</strong> {formatAddress(tx.from)}
                </p>
                <p>
                  <strong>To:</strong> {formatAddress(tx.to)}
                </p>
                <p>
                  <strong>Value:</strong> {ethers.utils.formatEther(tx.value)}{' '}
                  ETH
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default BlockExplorerPage
