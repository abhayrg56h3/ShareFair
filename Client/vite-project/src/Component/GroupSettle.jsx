import React, { useContext, useState,useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { myContext } from './AuthContext';
import axios from 'axios';

export default function GroupSettle({ group, groupMembers,showSettle,setShowSettle }) {
  const { currUser } = useContext(myContext);
  const [sender, setSender] = useState(currUser);
  const [receiver, setReceiver] = useState(currUser);
  const [amount, setAmount] = useState(null);
  const [identity, setIdentity] = useState(-1);
  const {friendKey,groupKey,setFriendKey,setGroupKey}=useContext(myContext);
  function handleClick(member) {
    if (identity === 1) setSender(member);
    else if (identity === 2) setReceiver(member);
    setIdentity(-1);
  }
 
  

  async function handleSend(){
         try{
      const res=await axios.post(`${import.meta.env.VITE_API_URL}/groupsettle/add`,{
        who:{
            name:sender.name,
            email:sender.email
        },
        whom:{
            name:receiver.name,
            email:receiver.email
        },
        amount:amount,
        groupId:group._id
      });

      setGroupKey(prevKey => prevKey + 1);
         }
         catch(err){
            console.log(err);
         }

         try{
            const response=await axios.post(`${import.meta.env.VITE_API_URL}/settle/add`,{who:sender,whom:receiver,amount:amount,groupName:group.name})
            // window.location.reload();
            // setFriendKey(friendKey+1);
            // setFriendDependency(false);
            
            setShowSettle(false);
            }
            catch(err){
             console.log(err);
            }
  }

  return (
    <div className="max-w-sm mx-auto bg-white rounded-2xl relative shadow-xl overflow-hidden space-y-4 transition-all duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-rose-400 px-4 py-3 flex justify-between items-center">
        <h2 className="text-lg font-bold text-white tracking-wide">SETTLE UP</h2>
        <button className="p-1 rounded-full hover:bg-white/10 transition-colors">
          <CloseIcon onClick={()=>setShowSettle(false)} className="text-white/90 text-lg" />
        </button>
      </div>

      {/* Main Content */}
      <div className="px-4 pb-4 space-y-4">
        {/* Avatars Section */}
        <div className="flex flex-col items-center space-y-4">
          <div className="flex -space-x-2 relative">
            <div className="relative group">
              <img 
                src={sender?.profilePicture || "https://avatar.vercel.sh/1"}
                alt="Payer"
                className="w-16 h-16 rounded-full border-2 border-white shadow cursor-pointer transform transition-transform hover:scale-105"
                onClick={() => setIdentity(1)}
                style={{ borderColor: identity === 1 ? '#ef4444' : 'white' }}
              />
              <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            
            <div className="self-center mx-1">
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
            
            <div className="relative group">
              <img 
                src={receiver?.profilePicture || "https://avatar.vercel.sh/2"}
                alt="Recipient"
                className="w-16 h-16 rounded-full border-2 border-white shadow cursor-pointer transform transition-transform hover:scale-105"
                onClick={() => setIdentity(2)}
                style={{ borderColor: identity === 2 ? '#e11d48' : 'white' }}
              />
              <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          <div className="text-center space-y-1">
            <div className="text-xs font-medium text-rose-500/90">Payment Direction</div>
            <div className="flex items-center space-x-1 text-base font-bold">
              <span 
                className="text-red-700 cursor-pointer hover:text-red-800 transition-colors"
                onClick={() => setIdentity(1)}
              >
                {sender?._id === currUser._id ? 'YOU' : sender?.name.toUpperCase()}
              </span>
              <span className="text-red-300">→</span>
              <span 
                className="text-rose-700 cursor-pointer hover:text-rose-800 transition-colors"
                onClick={() => setIdentity(2)}
              >
                {receiver?._id === currUser._id ? 'YOU' : receiver?.name.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Member Selection */}
        {identity !== -1 && (
          <div className="bg-rose-50/50 rounded-lg p-2 space-y-1 animate-fade-in">
            <div className="text-xs font-semibold text-rose-600 px-2">
              SELECT {identity === 1 ? 'SENDER' : 'RECEIVER'}
            </div>
            <ul className="max-h-32 overflow-y-auto space-y-1">
              {group.members.map(function(member, index){
                if(member.email!=currUser.email){
                   return ( <li
                    key={member._id}
                    onClick={() => handleClick(groupMembers[index])}
                    className="flex items-center p-1 rounded cursor-pointer hover:bg-rose-100/50 transition-colors"
                  >
                    <img 
                      src={groupMembers[index]?.profilePicture || "https://avatar.vercel.sh/3"} 
                      className="w-6 h-6 rounded-full mr-2 border border-rose-200"
                      alt={member.name}
                    />
                    <span className="text-gray-700 text-sm font-medium">{member.name}</span>
                    {(identity === 1 && sender?._id === groupMembers[index]?._id) ||
                    (identity === 2 && receiver?._id === groupMembers[index]?._id) ? (
                      <CheckIcon className="ml-auto text-red-600 text-sm" />
                    ) : null}
                  </li>)
                }
              })}
            </ul>
          </div>
        )}

        {/* Amount Input */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-red-600">AMOUNT</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl text-red-500">₹</span>
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-lg font-bold border-2 border-rose-200 rounded-lg 
                         focus:outline-none focus:border-red-500 focus:ring-3 focus:ring-red-100
                         transition-all duration-200 placeholder:text-red-200"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 pb-3 flex justify-end space-x-2">
        <button onClick={()=>setShowSettle(false)} className="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded transition-colors duration-200 font-semibold">
          Cancel
        </button>
        <button onClick={handleSend} className="px-4 py-1.5 bg-gradient-to-r from-red-500 to-rose-600 hover:to-rose-700 
                           text-white rounded font-semibold shadow hover:shadow-md transition-transform transform hover:scale-105">
          SETTLE NOW
        </button>
      </div>
    </div>
  );
}
