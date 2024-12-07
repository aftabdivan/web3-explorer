// src/types.ts
export type NFT = {
  id: number
  name: string
  image: string
}

export interface User {
  id: string | number
  password?: string
  username: string
  email: string
  phoneNumber: string
  address: string
  ethBalance: string
  tokenBalance: number
  gameTokens: number
  nfts: NFT[]
  avatar: string
}
