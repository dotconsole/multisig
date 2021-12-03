const dappList = {
  multisig: {
    1337: {
      address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
      tokenAddress: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
      symbol: 'LOCAL',
      name: 'Local Network',
      explorer: '',
    },
    56: {
      address: '0xf720F3e6A411fa1Aa6491EB7D0cc827225b584e0',
      tokenAddress: '0x5344c20fd242545f31723689662ac12b9556fc3d',
      symbol: 'BSC',
      name: 'BSC Mainnet',
      explorer: 'https://bscscan.com/',
    },
    97: {
      address: '0x0317280C56d73276175293f04B94A8DA91719F6c',
      tokenAddress: '0x91b7F29859bd27DCe0fC3272C8a897D66956B743',
      symbol: 'TBSC',
      name: 'BSC Testnet',
      explorer: 'https://testnet.bscscan.com/',
    }
  }
}

export default dappList;
