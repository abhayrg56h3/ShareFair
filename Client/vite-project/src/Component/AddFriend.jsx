import React, { useContext, useState } from 'react'
import { UserPlus, X, Mail, Send } from 'lucide-react';
   import { myContext } from './AuthContext';
   import axios from 'axios';
export default function AddFriend({setAddFriend}) {
    const { currUser,lightMode } = useContext(myContext);
    const [newEmail,setNewEmail]=useState('');
    async function handleAdd(){
            try{
                const response=await axios.post(`${import.meta.env.VITE_API_URL}/user/addFriend/${currUser._id}`,{email:newEmail});
                 if(response.status==200){
                  setAddFriend(false);
                 }
                 if(response.status==201){
                   setAddFriend(false);
                   alert("User is already friend");
                 }
                 if(response.status==202){
                  setAddFriend(false);
                  alert("You can't be a friend of yourself");
                 }
            }
        catch(err){
            alert("Some error occured")
            console.log(err);
        }
    }
  return (
   
<div className={`flex items-center justify-center p-4`}>
  <div className={`${lightMode ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'} rounded-2xl shadow-xl p-6 w-full max-w-md border relative overflow-hidden`}>
    {/* Gradient accent */}
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 rounded-t-2xl"></div>
    
    {/* Header */}
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-full ${lightMode ? 'bg-blue-100' : 'bg-blue-900/30'}`}>
          <UserPlus className={`w-5 h-5 ${lightMode ? 'text-blue-600' : 'text-blue-400'}`} />
        </div>
        <h2 className={`text-2xl font-bold ${lightMode ? 'text-gray-800' : 'text-gray-100'}`}>
          Invite Friends
        </h2>
      </div>
      <button 
        onClick={() => setAddFriend(false)}
        className={`p-2 rounded-full transition-all duration-200 hover:rotate-90 ${
          lightMode 
            ? 'hover:bg-red-50 text-gray-500 hover:text-red-500' 
            : 'hover:bg-red-900/30 text-gray-400 hover:text-red-400'
        }`}
      >
        <X className="w-5 h-5" />
      </button>
    </div>

    {/* Email Input */}
    <div className="mb-6">
      <label className={`block text-sm font-medium mb-3 ${lightMode ? 'text-gray-700' : 'text-gray-300'}`}>
        <Mail className="w-4 h-4 inline mr-2" />
        Email Address
      </label>
      <div className="relative">
        <input
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          placeholder="friend@example.com"
          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 placeholder-gray-400 pl-11 ${
            lightMode 
              ? 'border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 bg-white text-gray-700' 
              : 'border-gray-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-900/50 bg-gray-700 text-gray-100'
          }`}
        />
        <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${lightMode ? 'text-gray-400' : 'text-gray-500'}`} />
        
        {/* Validation indicator */}
        {newEmail && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {newEmail.includes('@') ? (
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            ) : (
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            )}
          </div>
        )}
      </div>
      
      {/* Helper text */}
      <p className={`text-xs mt-2 ${lightMode ? 'text-gray-500' : 'text-gray-400'}`}>
        We'll send them an invitation to join your group
      </p>
    </div>

    {/* Action Button */}
    <div className="mt-6">
      <button 
        onClick={handleAdd}
        disabled={!newEmail || !newEmail.includes('@')}
        className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-offset-2 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${
          !newEmail || !newEmail.includes('@')
            ? 'bg-gray-300 text-gray-500'
            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white focus:ring-blue-500 transform hover:scale-105'
        }`}
      >
        <Send className="w-5 h-5" />
        Send Invitation
      </button>
    </div>

    {/* Optional: Recent invites indicator */}
    <div className={`mt-4 p-3 rounded-xl ${lightMode ? 'bg-gray-50' : 'bg-gray-700/50'}`}>
      <p className={`text-xs text-center ${lightMode ? 'text-gray-600' : 'text-gray-400'}`}>
        💡 Tip: Friends will receive an email with a link to join
      </p>
    </div>
  </div>
</div>
  )
}