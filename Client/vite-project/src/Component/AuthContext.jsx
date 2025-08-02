import React, { createContext, useEffect, useState } from 'react'
import axios from 'axios';
export const myContext=createContext();
export default function AuthContext({children}) {
    
    const [dashBoard,setDashBoard]=useState(true);
    const [expenses,setExpenses]=useState(false);
    const [recent,setRecent]=useState(false);
    const [currUser,setCurrUser]=useState(null);
    const [currFriend,setCurrFriend]=useState(null);
    const [currGroup,setCurrGroup]=useState(null);
    const [friendKey,setFriendKey]=useState(0);
    const [groupKey,setGroupKey]=useState(0);
    const [isAuthLoading, setIsAuthLoading] = useState(true);
    const [friendDependency,setFriendDependency]=useState(false);
    const [visible,setVisible]=useState(false);
    const [lightMode,setLightMode]=useState(true);
     const [menuBar, setMenuBar] = useState(false);
     const [loading,setLoading]=useState(false);
    useEffect(() => {
      const savedFriend = sessionStorage.getItem("currFriend");
      const savedGroup = sessionStorage.getItem("currGroup");
    
      if (savedFriend) {
        setCurrFriend(JSON.parse(savedFriend)); // Convert string back to object
      }
      if (savedGroup) {
        setCurrGroup(JSON.parse(savedGroup));
      }


      if(currFriend || currGroup){
        setDashBoard(false);
      }

      // console.log("savedFriend",savedFriend);
    }, []);
    
    useEffect(()=>{
    async  function fetchCurrUser(){
        try{


          setLoading(true);
          

          const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/getCurrUser`, {
            withCredentials:true 
        });
        console.log(response);
        if(response==null){
          setLoading(false);
            setCurrUser(null);
        }
        else{
        setCurrUser(response.data);
     setLoading(false);
        }

        }
        catch(err){
     console.log(err);
     setLoading(false);
        }
        finally{
          setLoading(false);
        }
      }
      fetchCurrUser();
    },[]);
  return (

       <myContext.Provider value={{menuBar,setMenuBar,visible,setVisible,friendDependency,setFriendDependency,dashBoard,currFriend,friendKey,isAuthLoading,setFriendKey,groupKey,setGroupKey, setCurrFriend,currGroup,setCurrGroup,setDashBoard,expenses,setExpenses,recent,setRecent,currUser,setCurrUser,lightMode,setLightMode}}>
{children}
       </myContext.Provider>
  
  )
}
