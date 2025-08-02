import React, { useState } from "react";

export default function Share({ type, wit, currUser,members,setMembers }) {
  const [percentage,setPercentage]=useState(100);
  function handleChange(index,e){

   const newValue=Number(e.target.value) || 0;

          var sum=0;
  
          const newMembers=members.map(function(m,i){
            
             if(i==index){
                sum+=newValue;
              return newValue;
             }
             else{
              sum+=m;
             }
                
             return m;
          });

        
          setPercentage(sum);
          setMembers(newMembers);
  }


  function handleChangee(e,index){
    const newValue=Number(e.target.value) || 0;

    var sum=0;

    const newMembers=members.map(function(m,i){
      
       if(i==index){
          sum+=newValue;
        return newValue;
       }
       else{
        sum+=m;
       }
          
       return m;
    });

  
    setPercentage(sum);
    setMembers(newMembers);
  }



  

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-y-scroll ">
      <h1 className="!text-[20px]  bg-blue-400 text-white p-2">
        Split by percentages
      </h1>
      <div>
        {type == "Friend" ? (
         <ul className="flex flex-col pr-[30px] gap-y-4 ">
             <li className="flex  text-black p-2 rounded-[4px] justify-between items-center">
                    <div className="flex gap-x-2.5">
                {currUser && currUser.profilePicture ? (
                  <img
                    className=" w-8  h-8 rounded-full"
                    src={currUser.profilePicture}
                  />
                ) : (
                  <img
                    className="rounded-full w-8  h-8"
                    src="https://imgs.search.brave.com/b125XPj0IJ95T1gKRAHX5zA7hGyi7dJ96p0VKcYyGGY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9idXJz/dC5zaG9waWZ5Y2Ru/LmNvbS9waG90b3Mv/dHdvLXRvbmUtaW5r/LWNsb3VkLmpwZz93/aWR0aD0xMDAwJmZv/cm1hdD1wanBnJmV4/aWY9MCZpcHRjPTA"
                  />
                )}
                  <div>{currUser && currUser.name}</div>
              </div>
            

              <div className="flex ">
                      <input
                         onChange={(e)=>handleChangee(e,0)}
                        value={members[0]}
                        className="w-16 text-blue-500 font-bold border   px-2 py-1 focus:outline-none   focus:ring-offset-2 backdrop-blur-sm transition-all"
                        type="text"
                      />
                      <span className="bg-gray-300 p-1.5">%</span>
                    </div>
            </li>
            <li className="flex  text-black p-2 rounded-[4px] justify-between items-center">
                    <div className="flex gap-x-2.5">
                {wit && wit.profilePicture ? (
                  <img
                    className=" w-8  h-8 rounded-full"
                    src={wit.profilePicture}
                  />
                ) : (
                  <img
                    className="rounded-full w-8  h-8"
                    src="https://imgs.search.brave.com/b125XPj0IJ95T1gKRAHX5zA7hGyi7dJ96p0VKcYyGGY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9idXJz/dC5zaG9waWZ5Y2Ru/LmNvbS9waG90b3Mv/dHdvLXRvbmUtaW5r/LWNsb3VkLmpwZz93/aWR0aD0xMDAwJmZv/cm1hdD1wanBnJmV4/aWY9MCZpcHRjPTA"
                  />
                )}
                  <div>{wit && wit.name}</div>
              </div>
            

              <div className="flex ">
                      <input
                      onChange={(e)=>handleChangee(e,1)}
                      value={members[1]}
                        //  onChange={setMembers(...members,}
                        className="w-16 text-blue-500 font-bold border   px-2 py-1 focus:outline-none   focus:ring-offset-2 backdrop-blur-sm transition-all"
                        type="text"
                      />
                      <span className="bg-gray-300 p-1.5">%</span>
                    </div>
            </li>
          </ul>
        ) : (
          <ul className="flex flex-col pr-[30px] gap-y-4 ">
          

            {wit &&
              wit.members &&
              wit.members.map(function (m,index) {
                return (
                  <li className="flex  text-black p-2 rounded-[4px] justify-between items-center">
                    <div className="flex gap-x-2.5">
                      {m.profilePicture ? (
                        <img src={m.profilePicture} />
                      ) : (
                        <img
                          className="w-9  h-9 object-cover rounded-full"
                          src="https://imgs.search.brave.com/b125XPj0IJ95T1gKRAHX5zA7hGyi7dJ96p0VKcYyGGY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9idXJz/dC5zaG9waWZ5Y2Ru/LmNvbS9waG90b3Mv/dHdvLXRvbmUtaW5r/LWNsb3VkLmpwZz93/aWR0aD0xMDAwJmZv/cm1hdD1wanBnJmV4/aWY9MCZpcHRjPTA"
                        />
                      )}
                      {m.name}
                    </div>

                    <div className="flex ">
                      <input
                      value={members[index]}
                      onChange={(e)=>handleChange(index,e)}
                        className="w-16 text-blue-500 font-bold border   px-2 py-1 focus:outline-none   focus:ring-offset-2 backdrop-blur-sm transition-all"
                        type="text"
                      />
                      <span className="bg-gray-300 p-1.5">%</span>
                    </div>
                  </li>
                );
              })}
          </ul>
        )}
      </div>

      <div className="flex mb-6 justify-between pl-[20px] pr-[20px]">
        <span className="text-2xl text-blue-500 font-bold">Total</span>
        <div className="flex flex-col items-end">
          <span className="font-bold text-green-500 after:content-['.00%']">{percentage}</span>
          <span className=" text-red-500 after:content-['.00%left']">{100-percentage}</span>
        </div>
      </div>
    </div>
  );
}
