
import { useState } from "react";
import { ImTab, ImUsers } from "react-icons/im";
import { BsHandThumbsDownFill, BsHandThumbsUpFill } from "react-icons/bs";
import { ethers } from "ethers";

import { proposalState, proposalType } from './utils'
import WakandaInuAPI from "../../../scripts/WakandaInuAPI";

const hasToFrom = (toFrom: string) => toFrom !== ethers.constants.AddressZero

const multisigVote = async (proposalIndex: number, command: string, _proposalType: number) => {
  await WakandaInuAPI.multisigVote(proposalIndex, command, _proposalType)
}

export default function Proposals({ proposals, reqApprovals }: { proposals: any[]; reqApprovals: number }) {
  const [showing, setShowing] = useState('pending')
  return (
    <div className="mt-5 md:mx-auto">
      <div className="flex">
        <ImTab className="text-xl mr-2 mt-[2px] font-bold text-yellow-700"/>
        <p className="mb-3 font-bold text-yellow-700 uppercase">Proposals</p>
      </div>
      <div className="">
        <div className="flex space-x-10 font-thin border-b border-yellow-700 border-opacity-30">
          <p className={`${showing === 'pending' ? 'border-b border-yellow-700 font-normal' : ''} pb-1 cursor-pointer`} onClick={() => setShowing('pending')}>Pending</p>
          <p className={`${showing === 'completed' ? 'border-b border-yellow-700 font-normal' : ''} pb-1 cursor-pointer`} onClick={() => setShowing('completed')}>Completed</p>
        </div>
        <div className="">
            { showing === 'pending' ?
              proposals.filter(p => p['completed'] === false).map(_p => <div key={_p.proposalIndex}>
                <Proposal proposal={_p} reqApprovals={reqApprovals}/>
              </div>) :
              proposals.filter(p => p['completed'] === true).map(_p => <div key={_p.proposalIndex}>
                <Proposal proposal={_p} reqApprovals={reqApprovals}/>
              </div>)
            }

        </div>
      </div>
    </div>
  )
}

const Proposal = ({ proposal, reqApprovals }: { proposal: IProposal; reqApprovals: number }) => {
  const [expand, toggleExpand] = useState(false)
  const { state, amount, from, to, proposalType: _proposalType, numApprovals, numRejections, data, targetContract, completed, isApproved, proposalIndex } = proposal


  const canExecute = (Number(numApprovals) === reqApprovals) && !completed

  const canRevoke = !completed && isApproved

  const fieldItems = [
    {
      name: 'target contract',
      item: targetContract
    }, {
      name: 'proposal index',
      item: proposalIndex
    }, {
      name: 'from',
      item: hasToFrom(from) ? from : '-'
    }, {
      name: 'to',
      item: hasToFrom(to) ? to : '-'
    }, {
      name: 'data',
      item: data !== '0x307830' ? data : '-'
    }, {
      name: 'amount',
      item: Number(amount) > 0 ? Number(amount) : '-'
    }, {
      name: 'what it does',
      item: proposalType[Number(_proposalType)].description
    }, {
      name: 'rejections',
      item: Number(numRejections) > 0 ? Number(numRejections) : '-'
    },
  ]
  
  return(
    <div className={`bg-white shadow rounded md:rounded-lg text-xs mr-1 mt-5 md:text-sm`}>
      <div className={`font-bold grid grid-cols-4 text-center cursor-pointer hover:bg-gray-100 p-2 ${expand && 'bg-gray-100'}`} onClick={() => toggleExpand(!expand)}>
        <p className="">{proposalIndex}</p>
        
        <p className="">{proposalType[_proposalType].name.substr(0, proposalType[_proposalType].name.indexOf('_'))}</p>
        
        <p className="flex justify-center text-xs text-gray-400"><ImUsers className="mt-[2px] text-center "/>{Number(numApprovals)} of {reqApprovals}</p>
        
        <p className={`${state === 0 ? 'text-red-300' : state === 1 ? 'text-green-500' : 'text-red-700'}`}>{proposalState[state]}</p>
      </div>
      <div className={`${!expand && 'hidden'} bg-white md:rounded-lg rounded mt-4 text-center md:px-4`}>
        <p className="my-5 font-bold text-center">{proposalType[_proposalType].name}</p>
        <div className="grid items-center grid-cols-1 gap-3 p-2 md:grid-cols-3">
          
          {
            fieldItems.map(field => <FieldItem key={field.name} name={field.name} item={field.item} />)
          }

        </div>
        <div className="flex justify-center md:mt-5">
          
          <button 
            onClick={async(e: any) => {
              const command = e.target['innerText'].toLowerCase()
              await multisigVote(proposalIndex, command, _proposalType)
            }}
            disabled={completed} className={`${completed ? 'bg-gray-200 text-gray-400 cursor-auto' : 'bg-yellow-600 hover:bg-opacity-80 text-white'}  font-bold rounded py-1 px-3 mr-2 mb-5  w-[100px]`}>
            {
              canExecute ? 'Execute' : 'Approve'
            }
          </button>
          <button
            onClick={async(e: any) => {
              const command = e.target['innerText'].toLowerCase()
              await multisigVote(proposalIndex, command, _proposalType)
            }}
            disabled={completed} className={`${completed ? 'bg-gray-200 text-gray-400 cursor-auto' : 'bg-red-600 hover:bg-opacity-80 text-white'}  font-bold rounded py-1 px-3 mr-2 mb-5  w-[100px]`}>
            {
              canRevoke ? 'Revoke' : 'Reject' 
            }
          </button>
        </div>
      </div>
    </div>
  )
}

const FieldItem= ({ name, item }: { name: string; item: any }) => {
  return <p>
    <span className="font-bold capitalize">{name}</span> <br/>
    {item}
  </p>
}