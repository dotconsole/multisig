import { useEffect, useState } from 'react'
import Status from "./Status";
import Proposals from "./Proposals";
import Create from "./Create";
import { useConnection } from '../../../scripts/zustand';

import dappList from '../../../utils'

export default function MultisigHome({ expandSidebar, showing, multisigAPI }: { multisigAPI: IMultisigAPI; expandSidebar: boolean; showing: string }) {
  const [currentStatus, setStatus] = useState<ICurrentStatus>({ isSigner: false, pending: 0, signers: [], reqApprovals: 0, count: 0, proposals: [] })
  const connection = useConnection()

  const dapp = (dappList as any)['multisig'][connection.networkID!]

  useEffect(() => {
    (async() => {
      if(connection.address && multisigAPI.contractAddress) {
        const status = await multisigAPI.getMultisigStatus()
        const pending = (status.proposals.filter((p: { state: number }) => p['state'] === 0).length)
        setStatus({ reqApprovals: status.reqApprovals, signers: status.signers, count: status.count, proposals: status.proposals, pending, isSigner: status.isSigner })
      }
    })();
  }, [multisigAPI.contractAddress, connection.address])
  
  return (
    <div className={`${!expandSidebar ? 'ml-[58px]': 'ml-[115px]'} mt-5 text-sm md:text-base md:pb-[700px]`}>
      <div className="mx-auto md:w-3/4">
        <p className="mb-5 md:text-2xl">Welcome to Wakanda Inu Committee Multisig Page</p>
        <Status currentStatus={currentStatus} contractAddress={multisigAPI.contractAddress} dapp={dapp}/>
        {
          showing === 'proposals' ?
          <Proposals reqApprovals={currentStatus.reqApprovals} proposals={currentStatus.proposals.reverse()} /> : showing === 'create' ? 
          <Create multisigAPI={multisigAPI} dapp={dapp}/> : null
        }
      </div>
    </div>
  )
}
