import { ethers } from 'ethers';
import { Multisig__factory, Multisig, BEP20__factory } from '../typechain';
import { toast } from 'react-toastify'
import dappList from '../utils';

declare global {
  interface Window {
    ethereum: any;
  }
}

class WakandaInuAPI {
  address!: string;
  provider!: ethers.providers.Web3Provider;
  chainID!: number;
  connected = false;
  contractAddress!: string;
  contract!: Multisig; // Should support a union type of many contracts
  signer!: ethers.providers.JsonRpcSigner;
  networkName!: string;


  async connect(connection: ConnectionStore, dappName: string) {
    try {
      const { ethereum } = window;
      if (!ethereum) return;
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      this.provider = new ethers.providers.Web3Provider(ethereum);
      this.signer = this.provider.getSigner(accounts[0]);
      const { chainId } = await this.provider.getNetwork();
      this.chainID = chainId;
      this.address = await this.signer.getAddress();
      connection.setAddress(this.address)
      // connection.setNetwork({ networkSymbol: '', networkID: this.chainID, networkName: '' })
      // connection.setNetwork({ networkSymbol: network.symbol, networkID: this.chainID, networkName: network.name })
      ethereum.on('accountsChanged', async (accounts: string[]) => {
        if (accounts.length > 0) {
          const addr = ethers.utils.getAddress(accounts[0]);
          this.signer = this.provider.getSigner(addr);
          const { chainId } = await this.provider.getNetwork();
          this.chainID = chainId;
          this.address = await this.signer.getAddress();
          connection.setAddress(this.address)
          
        } else {
          // this.signer = null;
          this.connected = false;
          return;
        }
      });
      ethereum.on('chainChanged', async (_chainId: number) => {
        location.reload();
      });
    } catch(e) {
      console.log({ e })
      // toast(e.message)
    }
    try {
      if(this.chainID) {
        await this.getContract(dappName, connection)
      }
      // localStorage.setItem('connected', 'true')
    } catch(e) {
      console.log(e)
    }
    
    return this.address;
  }


  async getBEP20(address: string) {
    return BEP20__factory.connect(address, this.signer)
  }
  
  async getContract(dappName: string, connection: ConnectionStore): Promise<any> {

    const dapps = Object.keys(dappList)
    
    if(dapps.includes(dappName)) {
      try{
        const { address, symbol, name } = (dappList as any)[dappName][this.chainID]
        if(address && symbol && name) {
          if(dappName.toLowerCase() === 'multisig') {
            this.contractAddress = address;
            this.contract = Multisig__factory.connect(this.contractAddress, this.signer);
          }
          connection.setNetwork({ networkSymbol: symbol, networkID: this.chainID, networkName: name })
          return { address, symbol, name }
        } else {
          return null
        }
        // toast('Invalid Network')
      } catch(e) {
        this.address = ''
        connection.setNetwork({ networkName: 'UNKNOWN', networkID: this.chainID, networkSymbol: '' })
        console.log('invalid dapp')
      }
    }
  }


  async getMultisigStatus(): Promise<any> {
    try {
      const signers = await this.contract.getSigners()
      const reqApprovals = await this.contract.numApprovalsRequired()
      const count = await this.contract.proposalCount()
      const proposals = []
      for(let i = 0; i < Number(count); i++) {
        const _proposal = await this.contract.proposals(i)
        const isApproved = await this.contract.isApproved(i, this.address)
        const isRejected = await this.contract.isRejected(i, this.address)
        proposals.push({ ..._proposal, proposalIndex: i, completed: _proposal['state'] < 1 ? false : true, isApproved, isRejected })
      }
      const isSigner = await this.contract.isSigner(this.address)
      return { signers, reqApprovals: Number(reqApprovals), count: Number(count), proposals, isSigner };
    }  catch(e: any) {
      console.log(e.data.message)
    }
  }



  async multisigVote(proposalIndex: number, command: string, proposalType: number) {
    let tx
    try {
      if(command === 'revoke') {
        tx = await this.contract.revokeApproval(proposalIndex)
        toast.success('Revoked Approval')
      }
      
      if(command === 'reject') {
        tx = await this.contract.rejectProposal(proposalIndex)
        toast.success('Rejected Proposal')

      }
      
      if(command === 'approve') {
        tx = await this.contract.approveProposal(proposalIndex)
        toast.success('Approved Proposal')
      }
      
      if(command === 'execute') {
        if(proposalType < 5) {
          tx = await this.contract.executeRemoteProposal(proposalIndex)
        } else {
          tx = await this.contract.executeMultisigProposal(proposalIndex)
        }
        toast.success('Executed  Proposal')

      }
      return tx
    } catch(e: any) {
      handleError(e)
    }
  }

  async getTokenDecimals(tokenAddress: string, bep20: boolean = false) {
    const token = await this.getBEP20(tokenAddress);
    if(bep20) {
      const decimals = await token.decimals()
      return decimals
    } 
  }



  requestTransferOwnership = async (targetContract: string, newOwner: string) => {
    try {
      const tx = await this.contract.requestTransferOwnership(targetContract, newOwner)
      toast.success('Proposal: Transfer Ownership Of WKD Contract')
      return tx
    } catch(e: any) {
      handleError(e)
    }
  }
  
  requestTokenWithdrawalOnTarget = async (targetContract: string, tokenAddress: string) => {
    try {
      const tx = await this.contract.requestTokenWithdrawalOnTarget(targetContract, tokenAddress)
      toast.success('Proposal: Withdraw BEP20 Token From WKD Contract')
      return tx
    }catch(e){
      handleError(e)
    }
  }
  requestETHWithdraw = async (targetContract: string) => {
    try {
      const tx = await this.contract.requestETHWithdraw(targetContract)
      toast.success('Proposal: Withdraw BNB From WKD Contract')
      return tx
    }catch(e){
      handleError(e)
    }
  }
  requestTokenOfTargetWithdrawal = async (targetContract: string) => {
    try {
      const tx = await this.contract.requestTokenOfTargetWithdrawal(targetContract)
      toast.success('Proposal: Withdraw WKD In WKD Contract')
      return tx
    }catch(e){
      handleError(e)
    }
  }
  requestAddNewSigner = async (newSigner: string) => this.contract.requestAddNewSigner(newSigner)
  
  requestUpdateReqApprovals = async (amount: number) => {
    try {
      const tx = await this.contract.requestUpdateReqApprovals(amount)
      toast.success('Proposal: Change Number Of Approvals Required To Execute')
      return tx
    }catch(e){
      handleError(e)
    }
  }
  requestTransferETH = async (to: string, amount: string) => {
    try {
      const tx = await this.contract.requestTransferETH(to, ethers.utils.parseEther(amount))
      toast.success('Proposal: Transfer BNB From Multisig To A Receiver')
      return tx
    }catch(e) {
      handleError(e)
    }
  }
  
  requestTokenTransfer = async (tokenAddress: string, to: string, amount: string) => {
    try {
      const decimals = this.getTokenDecimals(tokenAddress);
      const tx = await this.contract.requestTokenTransfer(tokenAddress, to, ethers.utils.parseUnits(amount, Number(decimals)))
      toast.success('Proposal: BEP20 Token Transfer From Multisig To A Receiver')
      return tx
    }catch(e) {
      handleError(e)
    }
  }
  
  requestReplaceSigner = async (previousSigner: string, newSigner: string) => {
    const signers = await this.contract.getSigners();
    const signerIndex = signers.indexOf(previousSigner)
    const tx = await this.contract.requestReplaceSigner(previousSigner, newSigner, signerIndex)
    toast.success('Proposal: Replace An Existing Signer With A New One')
    return tx
  }

}

export default new WakandaInuAPI();



const handleError = (e: any) => {
  if(e.data) {
    const { message } = e.data
    toast.error(message.substr(message.indexOf("'")))
  } else {
    toast.error(e.message || 'An error occurred')
  }
}