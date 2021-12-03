import create, { SetState, GetState } from 'zustand'

export const useConnection = create<ConnectionStore>(
  (set: SetState<ConnectionStore>) => ({
    address: null,
    networkID: null,
    networkName: '',
    networkSymbol: '',
    setAddress: (address) => {
      set({ address })
    },
    setNetwork: (network) => {
      set({ networkName: network.networkName, networkID: network.networkID, networkSymbol: network.networkSymbol })
    }
  })
)
