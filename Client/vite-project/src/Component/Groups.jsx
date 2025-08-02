import axios from "axios";
import { Send, Users, Circle } from "lucide-react";
import io from "socket.io-client";
import React, { useContext, useEffect, useState,useRef } from "react";
import { myContext } from "./AuthContext";
import GroupSettle from "./GroupSettle";
import { m } from "framer-motion";
const socket = io(`${import.meta.env.VITE_API_URL}`, {
  withCredentials: true,
});
import {
  FaPlus,
  FaHandshake,
  FaReceipt,
  FaArrowAltCircleUp,
} from "react-icons/fa";
export default function Groups({
  groupSettlesList,
  group,
  expenses,
  setExpenses,
  groupMembers,
  showSettle,
  setShowSettle,
  isChatOpen
}) {
  const [paidBy, setPaidBy] = useState([]);
  const { currUser ,currGroup ,lightMode ,setMenuBar,menuBar} = useContext(myContext);
  const [currUserShare, setCurrUserShare] = useState([]);
   const [messages, setMessages] = useState([]);
      const [groupUserCount, setGroupUserCount] = useState(0);
      const [text, setText] = useState("");
       const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
  
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
  
    useEffect(() => {
      scrollToBottom();
    }, [messages]);
  
  
      useEffect(()=>{
        socket.emit("join-room", currGroup._id);
        socket.on("receive-message", (msg) => {
        setMessages((prev) => [...prev, msg]);
      });
      socket.on("group-user-count", (count) => {
        setGroupUserCount(count); // 👈 update state
      });
      return () => {
        socket.off("receive-message");
        socket.off("group-user-count");
        socket.emit("leave-room", currGroup._id);
      };
  
  },[currGroup?._id]);
  
  
  
  useEffect(() => {
      async function fetchMessages() {
          try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/message/${currGroup._id}`, {
              withCredentials: true
          });

         console.log(response.data);
          setMessages(response.data);
          } catch (error) {
          console.error("Error fetching messages:", error);
          }
      }
      
      if (currGroup) {
          fetchMessages();
      }
  }, [currGroup?._id]);
  
   
  async function sendMessage(){
    if (!text.trim()) return;
    const messageData = {
      group: currGroup._id,
      sender: currUser._id,
      text: text.trim(),
      senderName: currUser.name || "Unknown User",
      senderPicture: currUser.profilePicture || "",
    };
  
    socket.emit("send-message", messageData);
  
    setText("");
  }
  
    
   const handleKeyPress = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    };
  
    const formatTime = (timestamp) => {
      return new Date(timestamp).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthsShort = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Generates a date string in ISO format (MongoDB style)
  function getDate(i) {
    let date = new Date(); // Current date
    date.setMonth(date.getMonth() - i); // Subtract `i` months
    return date.toISOString();
  }

  useEffect(() => {
    async function fetchName() {
      if (!expenses) {
        return;
      }
      try {
        const paidByName = await Promise.all(
          expenses.map(async function (e) {
            if (e.settled == false) {
              const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/user/getname/${e.paidBy}`
              );
              return response.data;
            }
          })
        );

        // console.log("paidByName",paidByName);

        setPaidBy(paidByName);
      } catch (err) {
        console.log(err);
      }
    }
    fetchName();
  }, [expenses]);

  useEffect(() => {
    if (!currUserShare) {
      return;
    }

    for (var i = 0; i < currUserShare.length; i++) {
      console.log(currUserShare[i]);
    }
  }, [currUserShare]);

  useEffect(() => {
    function getShare() {
      if (!expenses || expenses.length === 0) return;

      const shareList = expenses.map((e) => {
        if (e.settled == false) {
          // Using .find to directly get the split where the email matches
          const splitForUser = e.splits.find(
            (split) => currUser.email === split.email
          );
          // Return share or default to 0 if not found
          return splitForUser ? splitForUser.share : 0;
        }
      });

      // console.log("ShareList",shareList);

      setCurrUserShare(shareList);
    }
    getShare();
  }, [expenses, currUser.email]);

  useEffect(() => {
    if (groupSettlesList == null) {
      return;
    }
    async function fetchExpenses() {
      try {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/expense/fetch`, {
          id: group._id,
        });
        const settledList = groupSettlesList.map((s) => {
          return {
            who: { name: s.who.name, email: s.who.email },
            whom: { name: s.whom.name, email: s.whom.email },
            amount: s.amount,
            createdAt: s.createdAt,
            settled: true,
          };
        });

        // Process normal expenses and add a flag 💸
        const normalExpenses = res.data.map((expense) => ({
          ...expense,
          settled: false,
        }));

        // Combine both lists into one final list 📝

        const combinedList = [...normalExpenses, ...settledList];
        console.log("combined List", combinedList);
        setExpenses(combinedList);
      } catch (err) {
        console.log(err);
      }
    }
    fetchExpenses();
  }, [group, groupSettlesList]);

  //   async function addExpense(){

  //   }

  useEffect(() => {
    console.log(close);
    if (close == true) {
      setAddWindow(false);
      setClose(false);
    }
  }, [close]);

  let index1 = 0;
  let index2 = 0;


  if(isChatOpen){
    return  <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
 {/* Header */}
 <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
   <div className="flex items-center justify-between">
     <div className="flex items-center space-x-3">
       <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
         <Users className="w-5 h-5 text-white" />
       </div>
       <div>
         <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Group Chat</h1>
         <p className="text-sm text-gray-500 dark:text-gray-400">
           {groupUserCount} members online
         </p>
       </div>
     </div>
     <div className="flex items-center space-x-2 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-full">
       <Circle className="w-3 h-3 text-green-500 fill-current" />
       <span className="text-sm font-medium text-green-700 dark:text-green-400">
         Active
       </span>
     </div>
   </div>
 </div>

 {/* Messages Area */}
 <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
   <div className="space-y-6">
     {messages.map((msg) => (
       <div
         key={msg._id}
         className={`flex ${msg.sender === currUser._id ? 'justify-end' : 'justify-start'}`}
       >
         <div className={`flex max-w-[70%] ${msg.sender === currUser._id ? 'flex-row-reverse' : 'flex-row'}`}>
           <img
             src={msg.senderPicture}
             alt={msg.senderName}
             className="w-10 h-10 rounded-full object-cover flex-shrink-0"
           />
           <div className={`mx-3 ${msg.sender === currUser._id ? 'text-right' : 'text-left'}`}>
             <div className="flex items-center mb-1">
               <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                 {msg.senderName}
               </span>
               <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                 {formatTime(msg.createdAt)}
               </span>
             </div>
             <div
               className={`px-4 py-3 rounded-2xl ${
                 msg.sender === currUser._id
                   ? 'bg-blue-500 text-white rounded-tr-md'
                   : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-tl-md'
               }`}
             >
               <p className="text-sm leading-relaxed">{msg.text}</p>
             </div>
           </div>
         </div>
       </div>
     ))}
   </div>
 </div>

 {/* Input Area */}
 <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
   <div className="flex items-end space-x-4">
     <div className="flex-1 relative">
       <textarea
         ref={inputRef}
         value={text}
         onChange={(e) => setText(e.target.value)}
         onKeyPress={handleKeyPress}
         placeholder="Type your message..."
         className="w-full max-h-32 min-h-[48px] px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
         rows="1"
         onInput={(e) => {
           e.target.style.height = 'auto';
           e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
         }}
       />
     </div>
     <button
       onClick={sendMessage}
       disabled={!text.trim()}
       className="w-12 h-12 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-xl flex items-center justify-center transition-colors duration-200 disabled:cursor-not-allowed"
     >
       <Send className="w-5 h-5" />
     </button>
   </div>
   <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
     Press Enter to send, Shift + Enter for new line
   </p>
 </div>
</div>
  }

  return (

    
    <div
      className={`max-w-3xl mx-auto relative   p-4 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen `}
    >
      {expenses.length === 0 ? (
        <div className={`text-center py-12 `}>
          <div className="text-4xl mb-4 text-gray-300">📭</div>
          <h2 className="text-xl text-gray-500 font-medium">
            No expenses found
          </h2>
        </div>
      ) : (
        <div className={`space-y-3 `}>
          {expenses
            // Sort by date in descending order (most recent first)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            // Group expenses by month & year, and inject a heading whenever the group changes
            .reduce((acc, expense, index, arr) => {
              const date = new Date(expense.createdAt);
              const year = date.getFullYear();
              const month = months[date.getMonth()];
              const prevDate =
                index > 0 ? new Date(arr[index - 1].createdAt) : null;

              // Add header if it's the first item or the month/year changes
              if (
                !prevDate ||
                date.getMonth() !== prevDate.getMonth() ||
                date.getFullYear() !== prevDate.getFullYear()
              ) {
                acc.push(
                  <div
                    key={`${month}-${year}`}
                    className="sticky top-0 bg-white/90 backdrop-blur-sm z-10 py-1 mt-3"
                  >
                    <h2 className="text-lg font-semibold text-slate-800 border-l-4 border-purple-600 pl-2">
                      {month} {year}
                    </h2>
                  </div>
                );
              }

              // Expense item

              {
                expense.settled == false
                  ? acc.push(
                      <div
                        key={expense.desc + expense.createdAt}
                        className="group flex gap-3 p-2 h-[120px] bg-white rounded-md shadow-sm hover:shadow-md transition-all"
                      >
                        {/* Date Badge */}
                        <div className="flex flex-col items-center justify-center w-9 h-9 bg-purple-100 rounded-md">
                          <span className="text-[11px] font-bold text-purple-600 uppercase">
                            {monthsShort[date.getMonth()]}
                          </span>
                          <span className="text-[11px] font-bold text-purple-800">
                            {date.getDate()}
                          </span>
                        </div>

                        {/* Expense Details */}
                        <div className="flex-grow">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="p-1.5 bg-amber-100 rounded-md text-amber-600">
                              <FaReceipt className="text-lg" />
                            </div>
                            <div>
                              <h3 className="!text-[17px] font-semibold text-slate-800">
                                {expense.desc}
                              </h3>
                              <p className="text-xs  text-slate-500">
                                <span
                                  className={`font-bold ${
                                    expense.groupName
                                      ? "bg-blue-200"
                                      : "bg-white"
                                  }  p-1 rounded-[5px] text-blue-600`}
                                >
                                  {expense.groupName ? expense.groupName : ""}
                                </span>
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <div className="flex items-center h-[30px] gap-1 p-1.5 bg-blue-50 rounded-md">
                              <span className="text-[10px] text-slate-600">
                                {expense.paidBy == currUser._id
                                  ? "You"
                                  : paidBy[index]?.name}{" "}
                                paid
                              </span>
                              <span className="text-[10px] font-bold text-blue-600">
                                ₹{expense.amount.toFixed(2)}
                              </span>
                            </div>
                            <div
                              className={`flex items-center h-[30px] gap-1 p-1.5 ${
                                currUser._id != expense.paidBy
                                  ? " bg-red-100"
                                  : " bg-emerald-50"
                              } rounded-md`}
                            >
                              <span className="text-[10px] text-slate-600">
                                {currUser._id == expense.paidBy
                                  ? "You lent"
                                  : `${paidBy[index]?.name} lent you`}
                              </span>
                              <span
                                className={`${
                                  currUser._id == expense.paidBy
                                    ? "text-emerald-600"
                                    : "text-red-500"
                                } text-[10px] font-bold `}
                              >
                                ₹
                                {currUser._id == expense.paidBy
                                  ? (
                                      (1 - currUserShare[index] / 100) *
                                      expense.amount
                                    ).toFixed(2)
                                  : (
                                      (currUserShare[index] / 100) *
                                      expense.amount
                                    ).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  : acc.push(
                    <div className="group flex gap-3 h-[120px] p-2 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    {/* Date Badge */}
                    <div className="flex flex-col items-center justify-center w-11 h-11 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl text-white">
                      <span className="text-[11px] font-bold uppercase tracking-wide">
                        {monthsShort[date.getMonth()]}
                      </span>
                      <span className="text-[11px] font-bold leading-none">
                        {date.getDate()}
                      </span>
                    </div>
                  
                    {/* Expense Details */}
                    <div className="flex-grow">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-2  bg-amber-100/80 rounded-lg text-amber-600">
                            <FaHandshake className="text-[14px]" />
                          </div>
                          <p className="text-[10px] text-slate-600">
                            <span className="font-medium bg-purple-100/50 px-2 py-1 rounded-md text-purple-700 border border-purple-200">
                              {group.name}
                            </span>
                          </p>
                        </div>
                        <span className="text-[11px] font-bold bg-green-100/80 text-green-700 px-2 py-1 rounded-full">
                          Settled
                        </span>
                      </div>
                  
                      <div className="mt-3 flex items-center gap-3">
                        <div className="flex-1 p-1   bg-blue-50/80 rounded-lg border border-blue-200">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center">
                              
                              <span className="ml-2 text-[12px] font-medium text-slate-700">
                                {expense.who.email === currUser.email ? "You" : expense.who.name}
                              </span>
                            </div>
                            
                         
                            <span className="text-blue-400 mx-1 text-[9px]"> paid to </span>
                            
                            <div className="flex items-center">
                              
                              <span className="ml-2 text-[12px] font-medium text-slate-700">
                                {expense.whom.email === currUser.email ? "You" : expense.whom.name}
                              </span>
                            </div>
                          </div>
                          
                          <div className="mt-2 flex items-center justify-center gap-1">
                            <span className="text-[10px] text-slate-500">Transferred</span>
                            <span className="text-[15px] font-bold text-blue-600">
                              ₹{expense.amount.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                    );
              }

              return acc;
            }, [])}
        </div>
      )}
    </div>
  );
}
