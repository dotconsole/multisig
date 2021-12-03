import { useState } from 'react'
import Head from 'next/head'
import Sidebar from "../components/Multisig/Sidebar";
import Home from '../components/Multisig/Home';
import { HiChevronDoubleRight, HiChevronDoubleLeft } from "react-icons/hi"
import multisigAPI from '../scripts/WakandaInuAPI'
import { useConnection } from '../scripts/zustand';
import MultisigLayout from '../components/Layout/MultisigLayout';

export default function Multisig() {
  const [expandSidebar, toggleSideBar] = useState(false)
  const [showing, setShowing] = useState('proposals')
  const connection = useConnection()

  const connect = async() => {
    await multisigAPI.connect(connection, 'multisig')
  }

  const userAddress = multisigAPI.address;
  
  return (
    <MultisigLayout>
      <Head>
        <title>Multisig dApp</title>
        <meta name="description" content="Wakanda Inu dApp World" />
        <link rel="icon" href="favicon.ico" />
        <link rel="shortcut icon" href="/logo.svg" />
      </Head>

      <div className="fixed z-10 w-full px-10 py-2 bg-black shadow bg-opacity-80">
        <div className="flex justify-between">
          <div className="flex">
            <img className="" src="/logo.svg" alt="wkd-logo" width="50"/>
            <div className="flex-col justify-center hidden ml-3 md:flex">
              <p className="font-bold text-red-400">Multisig</p>
              <p className="text-white">The African Dog</p>
            </div>
          </div>

          <div className="flex items-center w-1/4 mr-10 text-white md:w-1/5 md:mr-0">
            <div className="flex justify-center flex-1">
              <p className={`tracking-widest text-center text-yellow-300 hover:text-opacity-50 ${!userAddress && 'text-sm'}`}>
                { 
                  userAddress && connection.networkName !== 'UNKNOWN' ? `${userAddress.substr(0, 3)}...${userAddress.substr(userAddress.length-3)}` : connection.networkName === 'UNKNOWN' ? 'INVALID NETWORK' : ''
                }
              </p>
            </div>
            
            <div className="text-center cursor-pointer" onClick={connect}>
              <button className={`${connection.networkName && 'hidden'} hover:text-yellow-500`}>Connect</button>
              <p className={`text-yellow-500 md:text-base text-xs ml-3`}>{connection.networkName}</p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="pt-[66px]">
          <Sidebar expandSidebar={expandSidebar} setShowing={setShowing} showing={showing}/>
        </div>
        <p className={`fixed text-yellow-700 hover:text-opacity-50 text-xl cursor-pointer ${!expandSidebar ? 'ml-[52px]': 'ml-[110px]'}`} onClick={() => toggleSideBar(!expandSidebar)}>
          {!expandSidebar ? <HiChevronDoubleRight /> : <HiChevronDoubleLeft />}
        </p>
      </div>
      <Home expandSidebar={expandSidebar} showing={showing} multisigAPI={multisigAPI as unknown as IMultisigAPI}/>
    </MultisigLayout>
  )
}

