import multisigAPI from "../../../scripts/WakandaInuAPI"

export const proposalState = ["PENDING", "PASSED", "REJECTED"]

export const fieldNames = {
  targetContract: 'Target Contract',
  newOwner: 'New Owner',
  tokenAddress: 'Token Address',
  to: 'Receiver',
  amount: 'Amount',
  previousSigner: 'Previous Signer',
  newSigner: 'New Signer',
  signerIndex: 'Previous Signer Index',
  newNumReqApprovals: 'New Number Of Signers',
}

export const fieldAltNames = {
  targetContract: ['targetContract'],
  to: ['Receiver'],
  from: ['previousSigner'],
  amount: ['newNumReqApprovals', 'amount', 'signerIndex'],
}

// WakandaInuAPI.multisigVote(proposalIndex, command, _proposalType)
export const proposalType: IProposalType[] = [
  {
    name: "TRANSFER_TARGET_OWNERSHIP", 
    description: "Calls the transferOwnership function on the token contract",
    creationFields: ['targetContract', 'newOwner'],
    proposalType: 0,
    create: async (proposal: NewProposal) => multisigAPI.requestTransferOwnership(proposal.targetContract, proposal.newOwner)
  },
  {
    name: "WITHDRAW_TOKEN_FROM_TARGET", 
    description: "Calls the withdraw(address) function on the token contract",
    creationFields: ['targetContract', 'tokenAddress'],
    proposalType: 1,
    create: async (proposal: NewProposal) => multisigAPI.requestTokenWithdrawalOnTarget(proposal.targetContract, proposal.tokenAddress)
  },
  {
    name: "WITHDRAW_ETH_FROM_TARGET", 
    description: "Calls the withdraw() function on the token contract",
    creationFields: ['targetContract'],
    proposalType: 2,
    create: async (proposal: NewProposal) => multisigAPI.requestETHWithdraw(proposal.targetContract)
  },
  {
    name: "WITHDRAW_TOKENS_OF_TARGET", 
    description: "Withdraws all $WKD currently in the contract",
    creationFields: ['targetContract'],
    proposalType: 3,
    create: async (proposal: NewProposal) => multisigAPI.requestTokenOfTargetWithdrawal(proposal.targetContract)
  },
  {
    name: "TRANSFER_ETH_FROM_MULTISIG", 
    description: "Transfers BNB from this multisig to a provided address",
    creationFields: ['targetContract', 'to', 'amount'],
    proposalType: 4,
    create: async (proposal: NewProposal) => multisigAPI.requestTransferETH(proposal.to, `${proposal.amount}`)
  },
  {
    name: "TRANSFER_TOKEN_FROM_MULTISIG", 
    description: "Transfers token of given address from this multisig to a provided address",
    creationFields: ['targetContract', 'tokenAddress', 'to', 'amount'],
    proposalType: 5,
    create: async (proposal: NewProposal) => multisigAPI.requestTokenTransfer(proposal.tokenAddress, proposal.to, `${proposal.amount}`)
  },
  {
    name: "REPLACE_MULTISIG_SIGNER", 
    description: "Replaces a given signer at a given index with a new signer address",
    creationFields: ['targetContract', 'previousSigner', 'newSigner'],
    proposalType: 6,
    create: async (proposal: NewProposal) => multisigAPI.requestReplaceSigner(proposal.previousSigner, proposal.newSigner)
  },
  {
    name: "ADD_NEW_SIGNER", 
    description: "Adds new signer",
    creationFields: ['targetContract', 'newSigner'],
    proposalType: 7,
    create: async (proposal: NewProposal) => multisigAPI.requestAddNewSigner(proposal.newSigner)
  },
  {
    name: "UPDATE_REQ_APPROVALS", 
    description: "Updates the number of required approvals required to pass a proposal",
    creationFields: ['targetContract', 'newNumReqApprovals'],
    proposalType: 8,
    create: async (proposal: NewProposal) => multisigAPI.requestUpdateReqApprovals(proposal.amount)
  },
]  
