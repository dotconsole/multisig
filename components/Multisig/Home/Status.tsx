import { ImSpinner10 } from 'react-icons/im'
export default function Status({ currentStatus, contractAddress, dapp }: { currentStatus: ICurrentStatus; contractAddress: string; dapp: { explorer: string } }) {

  return (
    <div className="md:mx-auto">
      <div className="flex">
        <ImSpinner10 className="mr-2 text-xl font-bold text-yellow-700"/>
        <p className="mb-3 font-bold text-yellow-700 uppercase">Status</p>
      </div>
      <ul className="grid grid-cols-1 mt-3 text-sm md:gap-4 md:grid-cols-3">
        <li className="py-2 font-bold md:text-center">Address:<br/>
        <a target="_blank" rel="noopener noreferrer" href={`${dapp?.explorer}/address/${contractAddress}`}>
          <span className="text-xs font-bold text-yellow-700 break-words text-opacity-80 hover:text-opacity-100 hover:cursor-pointer md:text-sm">{contractAddress}</span>
        </a></li>
        <li className="py-2 font-bold md:ml-4 md:text-center">Total Signers: {currentStatus.signers?.length}</li>
        <li className="py-2 font-bold md:text-center">Required Approvals: {currentStatus.reqApprovals}</li>
        <li className="py-2 font-bold md:text-center">Total Proposals: {currentStatus.proposals?.length}</li>
        <li className="py-2 font-bold md:text-center">Pending Proposals: {currentStatus.pending}</li>
        <li className="py-2 font-bold uppercase md:text-center">{currentStatus.isSigner ? <span className="text-green-500 uppercase">You are a signer</span> : <span className="text-red-500">You are not a signer</span> }</li>
      </ul>
    </div>
  )
}
