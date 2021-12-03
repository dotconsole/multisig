import { FC } from "react"

const Modal : FC = ({ children }) => {
  return(
    <div className="fixed top-0 left-0 z-10 w-full h-screen mt-0 overflow-hidden bg-gray-500 bg-opacity-80 backdrop-filter backdrop-blur-sm">
      <div className="w-full h-screen space-y-5 overflow-y-auto text-center bg-white border-2 shadow md:mt-20 md:h-auto md:rounded-xl md:mx-auto md:w-4/5 hover:shadow-lg lg:w-2/3">
        {children}
      </div>
    </div>
  )
} 

export default Modal