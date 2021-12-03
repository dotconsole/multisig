// import { Multisig } from "./typechain"
interface ConnectionStore {
  address: string | null;
  networkID: number | null;
  networkName: string;
  networkSymbol: string;
  setAddress: (addr: string) => void;
  setNetwork: (network: Network) => void;
}

type Network = {
  networkID: number;
  networkName: string;
  networkSymbol: string;
}

type NewProposal = {
  newOwner: string;
  previousSigner: string;
  newSigner: string;
  targetContract: string;
  tokenAddress: string;
  from: string;
  to: string;
  amount: number;
}

interface IMultisigAPI { 
  contractAddress: string; 
  contract: any;
  getMultisigStatus: () => { isSigner: boolean; signers: string[]; reqApprovals: number; count: number; proposals: any[] };
} 

type BasicRequired = {
  amount: number;
  to: string;
  data: string;
  from: string;
}

interface IProposal extends BasicRequired{ 
  proposalIndex: number; 
  completed: boolean; 
  proposalType: number;
  numApprovals: number;
  numRejections: number;
  state: number;
  targetContract: string;
  isApproved: boolean;
  isRejected: boolean;
}

interface IProposalType {
  name: string;
  description: string;
  creationFields: string[];
  proposalType: number;
  create: (proposal: NewProposal) => Promise<any>;
}

type ICurrentStatus = { isSigner: boolean; signers: string[]; reqApprovals: number; count: number; proposals: IProposal[]; pending: number }
