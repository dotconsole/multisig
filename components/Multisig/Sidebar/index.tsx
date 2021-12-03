import { ImDatabase, ImHome, ImPlus } from "react-icons/im";
import { HiBeaker } from "react-icons/hi";

const icons = [
  { name: 'proposals', icon: <ImHome /> }, 
  { name: 'create', icon: <ImPlus /> },
  // { name: 'multisig', icon: <ImDatabase />, directsTo: '/' },
  // { name: 'assets', icon: <HiBeaker />, directsTo: '/' },

]
export default function Sidebar({ expandSidebar, setShowing, showing }: { expandSidebar: boolean; setShowing: any; showing: string }) {
  return (
    <div className={`${!expandSidebar ? 'w-[55px]': 'w-[110px]'} p-1 bg-yellow-700 h-screen fixed`}>
      <div>
        {
          !expandSidebar ? <div className="mt-3">
          {
            icons.map(icon => <div onClick={() => setShowing(icon.name)}
              className={`flex items-center justify-center ${showing === icon.name && 'bg-white text-yellow-700'} hover:bg-white hover:text-yellow-700 p-2 border rounded-md mb-4 cursor-pointer bg-yellow-700 text-white`} key={icon.name}>
                <span className="text-2xl">{icon.icon}</span>
              </div>
            )
          } </div>: <div className="flex flex-col items-center py-2 space-y-4 font-bold text-white">
            <p>Home</p>
            <p>Create</p>
            {/* <p>Proposals</p> */}
            <div className="w-full border border-b border-white"></div>
            <p>Assets</p>
          </div>
        } 
      </div>
    </div>
  )
}
