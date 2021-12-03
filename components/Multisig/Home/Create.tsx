import { useState } from 'react'
import { ImFolderUpload } from 'react-icons/im'

import Modal from '../../Modal'
import { proposalType, fieldNames } from './utils'

export default function Create({ multisigAPI, dapp }: { multisigAPI: IMultisigAPI; dapp: any; }) {
  return (
    <>
      <div className="mt-5 md:mx-auto">
        <div className="flex">
          <ImFolderUpload className="mr-2 text-xl font-bold text-yellow-700"/>
          <p className="mb-3 font-bold text-yellow-700 uppercase">Create Proposal</p>
        </div>
          <div className="grid grid-flow-row grid-cols-1 gap-3 widetab:grid-cols-2">
            {
              proposalType.map(( proposal: IProposalType) => <NewProposal 
                key={proposal.name} 
                proposal={proposal} 
                multisigAPI={multisigAPI}
                tokenAddress={dapp?.tokenAddress}
              />
              )
            }
        </div>
      </div>
    </>
  )
}

const NewProposal = ({ proposal, tokenAddress, multisigAPI }: { proposal: IProposalType; multisigAPI: IMultisigAPI; tokenAddress: string; }) => {
  const { name, description, proposalType } = proposal
  const [modal, toggleModal] = useState(false)
  const [createData, setCreateData] = useState<NewProposal>()


  const onChange = (e: any) => {
    const { name, value } = e.target
    setCreateData(prev => ({ ...prev, [name]: value }) as NewProposal)
  }

  return(
    <div className="text-xs md:text-sm">
      {
        modal && <Modal>
          <div className="p-8 md:pt-2">
            
            <p className="mb-10 text-2xl text-right cursor-pointer" onClick={() => toggleModal(false)}>x</p>

              <p className="my-5 font-bold">{proposal.name}</p>
              {
                proposal?.creationFields.map(field => <FormField 
                  key={field} 
                  id={field} 
                  name={(fieldNames as any)[field]}
                  value={
                    field === 'targetContract' && proposalType < 4 ? tokenAddress :
                    field === 'targetContract' && proposalType >= 4 ? multisigAPI.contractAddress : ''
                  }
                  onChange={onChange}
                />)
              }
            <div className="flex justify-center">
            <button 
              onClick={async () => {
                const tx = await proposal.create(createData as NewProposal)
                console.log(tx)
                if(tx) {
                  toggleModal(false)
                }
              }}
              className="px-6 py-2 text-base text-white bg-yellow-700 rounded hover:bg-opacity-80">
             Create
            </button>
        </div>
          </div>
        </Modal>
      }
      
      <div className="relative rounded md:rounded-lg bg-white md:mb-0 px-2 py-2 h-[150px] z-0">
        <p className="font-bold text-center">{name}</p>
        <div className="mt-3">
          <p className="font-bold">Description</p>
          <p>{description}</p>
        </div>
        <div className="flex justify-center">
          <div className="absolute bottom-0 mb-3">
            <button 
              onClick={() => {toggleModal(true); setCreateData(prev => ({ ...prev, targetContract: proposalType < 4 ? tokenAddress : multisigAPI.contractAddress } as NewProposal))}}
              className="px-4 py-1 text-white bg-yellow-700 rounded px- hover:bg-opacity-80">
              Make Request
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


const FormField = ({ name, id, value, onChange }: { name: string; id: string; value: string; onChange: any }) => {  
  return (
    <div className="flex flex-col items-center justify-center my-5">
      <label 
        className="px-1 py-1 font-bold text-left md:w-2/3 md:ml-10" 
        htmlFor={id}>{name}</label>
      <input 
        onChange={onChange}
        name={id}
        disabled={id === 'targetContract'}
        id={id}
        defaultValue={value}
        placeholder={name}
        className="w-full px-3 py-2 placeholder-gray-400 placeholder-opacity-50 border-2 border-yellow-400 rounded md:w-2/3 md:px-2 md:ml-10 focus:outline-none focus:ring-yellow-700 focus:ring-1 focus:ring-opacity-50" 
      />
    </div>
  )
}