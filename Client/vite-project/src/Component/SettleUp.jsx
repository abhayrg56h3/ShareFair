import React, { useContext, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { myContext } from './AuthContext';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import Person4Icon from '@mui/icons-material/Person4';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
export default function SettleUp({friend,setShowSettle,currFriendMoney}) {

const {currUser}=useContext(myContext);
   const [sender,setSender]=useState(friend);
   const [receiver,setReceiver]=useState(currUser);
   const [amount,setAmount]=useState(0);
   const {friendDependency,setFriendDependency,setFriendKey,friendKey}=useContext(myContext);
   const navigate=useNavigate();
   function handleSwap(){
    setReceiver(sender);
    setSender(receiver);
   }


   async  function handleSave(){
          try{
          const response=await axios.post(`${import.meta.env.VITE_API_URL}/settle/add`,{who:sender,whom:receiver,amount:amount})
          // window.location.reload();
          setFriendKey(friendKey+1);
          setFriendDependency(false);
          setShowSettle(false);
          }
          catch(err){
           console.log(err);
          }


 }




 
  
   
  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden  space-y-8">
      {/* Top Section */}
      <div className="flex justify-between px-2 pt-1 pb-1  bg-green-300 items-center border-b-2 border-gray-100 ">
        <h2 className="!text-[20px] mb-0 font-bold text-white">Settle Up</h2>
        <button className="p-1  rounded-full transition-colors duration-200">
          <CloseIcon onClick={()=>setShowSettle(false)} className="text-white hover:!text-gray-200" />
        </button>
      </div>

      {/* Mid Section */}
      <div className="space-y-6 p-6">
        <div className="flex justify-center -space-x-3">
          <img 
            src={sender.profilePicture=="" ? "https://media.istockphoto.com/id/1345388323/vector/human-silhouette-isolated-vector-icon.jpg?s=612x612&w=0&k=20&c=a1wg9LYywdqDUG-t9rifrf16XEdWZbWe7ajuYxJTxEI=":sender.profilePicture}
            alt="Payer" 
            className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
          />
          <img 
            src={receiver.profilePicture=="" ? "https://media.istockphoto.com/id/1345388323/vector/human-silhouette-isolated-vector-icon.jpg?s=612x612&w=0&k=20&c=a1wg9LYywdqDUG-t9rifrf16XEdWZbWe7ajuYxJTxEI=":receiver.profilePicture}
            alt="Recipient" 
            className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
          />
        </div>
        
        <div className="text-center text-lg font-semibold">
          <div><SwapHorizIcon onClick={handleSwap} className='cursor-pointer bg-orange-400 rounded-[5px] text-white'/></div>
          
          <span className="text-purple-600">{currUser==sender?'You':sender.name}</span> <span className='text-[15px]'>sending to</span>{' '}
          <span className="text-green-600">{currUser==receiver?'You':receiver.name}</span>
        </div>

        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
          <input
            type="number"
            placeholder="0.00"
            value={amount!=0 && amount}
            onChange={(e)=>setAmount(e.target.value)}
            className="w-full py-3 pl-8 pr-4 text-xl border-2 border-gray-200 rounded-lg 
                     focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
          />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex justify-end space-x-4 p-2">
        <button className="px-6 py-2 text-gray-600 hover:bg-gray-50 rounded-lg 
                          transition-colors duration-200 border-2 border-gray-200">
          Cancel
        </button>
        <button onClick={handleSave} className="px-6 py-2 bg-red-400 hover:bg-red-500 text-white 
                          rounded-lg transition-colors duration-200 shadow-md">
          Save
        </button>
      </div>
    </div>
  );
}