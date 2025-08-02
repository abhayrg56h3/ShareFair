import React, { useContext, useEffect, useState } from "react";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import { ArrowLeft, ArrowRight } from "@mui/icons-material";
import axios from "axios";
import { myContext } from "./AuthContext";
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { FaExchangeAlt, FaCalendarAlt } from 'react-icons/fa';
import {
  FaPlus,
  FaHandshake,
  FaReceipt,
  FaArrowAltCircleUp,
} from "react-icons/fa";
export default function Recent({ currUserTotalExpenses, emailOfPaidBy,currUserSettledExpenses }) {
  const [recentActivity, setRecentActivity] = useState([]);
  const { currUser } = useContext(myContext);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const numberOfPages = Math.ceil(recentActivity.length / itemsPerPage);
  const currActivity = recentActivity.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  const [groupAdded, setGroupAdded] = useState([]);
  const [currUserShare, setCurrUserShare] = useState([]);
  const getServiceColor = (num) => {
    switch (num) {
      case 1:  return "bg-amber-100 text-amber-800";      // Food & Drinks 🍔
      case 2:  return "bg-emerald-100 text-emerald-800";  // Travel 🚗
      case 3:  return "bg-violet-100 text-violet-800";    // Entertainment 🎬
      case 4:  return "bg-rose-100 text-rose-800";        // Shopping 🛍️
      case 5:  return "bg-sky-100 text-sky-800";          // Health & Fitness 🏋️
      case 6:  return "bg-indigo-100 text-indigo-800";    // Rent & Bills 🏠
      case 7:  return "bg-lime-100 text-lime-800";        // Salary 💰
      case 8:  return "bg-orange-100 text-orange-800";    // Education 📚
      case 9:  return "bg-teal-100 text-teal-800";        // Investments 📈
      case 10: return "bg-pink-100 text-pink-800";        // Gifts & Donations 🎁
      case 11: return "bg-cyan-100 text-cyan-800";        // Tech & Gadgets 💻
      case 12: return "bg-red-100 text-red-800";          // Emergencies 🚑
      case 13: return "bg-yellow-100 text-yellow-800";    // Miscellaneous 🎭
      default: return "bg-gray-100 text-gray-800";        // Default ❓
    }
  };
  
  const getServiceColorr = (num) => {
    switch (num) {
      case 1:  return "hover:border-amber-800";       // Food & Drinks 🍔
      case 2:  return "hover:border-emerald-800";     // Travel 🚗
      case 3:  return "hover:border-violet-800";      // Entertainment 🎬
      case 4:  return "hover:border-rose-800";        // Shopping 🛍️
      case 5:  return "hover:border-sky-800";         // Health & Fitness 🏋️
      case 6:  return "hover:border-indigo-800";      // Rent & Bills 🏠
      case 7:  return "hover:border-lime-800";        // Salary 💰
      case 8:  return "hover:border-orange-800";      // Education 📚
      case 9:  return "hover:border-teal-800";        // Investments 📈
      case 10: return "hover:border-pink-800";        // Gifts & Donations 🎁
      case 11: return "hover:border-cyan-800";        // Tech & Gadgets 💻
      case 12: return "hover:border-red-800";         // Emergencies 🚑
      case 13: return "hover:border-yellow-800";      // Miscellaneous 🎭
      default: return "hover:border-gray-800";        // Default ❓
    }
  };
  

  const formatDate = (date) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    async function fetchActivity() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/recent/getActivity/${currUser.email}`
        );
        setGroupAdded(response.data);
        // console.log(response.data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchActivity();
  }, []);

  useEffect(() => {
    if (!currUserTotalExpenses || !currUser) {
      return;
    }

    const shareList = currUserTotalExpenses.map(function (expense) {
      const split = expense.splits.find(function (split) {
        return split.email == currUser.email;
      });

      const share = split?.share;

      return share;
    });

    console.log(shareList);

    setCurrUserShare(shareList);
  }, [currUserTotalExpenses, currUser]);

  useEffect(() => {
    if (
      !currUserTotalExpenses ||
      !emailOfPaidBy ||
      !groupAdded ||
      !currUserShare ||
      !currUserSettledExpenses ||
      !currUser
    ) {
      return;
    }

    let activity = [];




    currUserSettledExpenses.map((function(expense){
      if(currUser.email==expense.who){
        console.log(currUser.email,expense.who);
        const obj = {
          type: "Settled",
          who: "You",
          whom:expense.whomName,
          money:expense.amount,
          date: expense.createdAt,
          groupName:expense.groupName
  
        };
        activity.push(obj);
      }

      else{
        console.log(currUser.email,expense.who);
        const obj = {
          type: "Settled",
          who:expense.whoName ,
          whom:"You",
          money:expense.amount,
          date: expense.createdAt,
          groupName:expense.groupName
  
        };
        activity.push(obj);
      }
     
    }))





    

    currUserTotalExpenses.map(function (expense, index) {
      // console.log((1 - currUserShare[index] / 100) * expense.amount,-1 * (currUserShare[index] / 100) * expense.amount);
      let money =
        expense.paidBy == currUser._id
          ? (1 - currUserShare[index] / 100) * expense.amount
          : -1 * (currUserShare[index] / 100) * expense.amount;
          if(emailOfPaidBy[index]?.email === currUser.email){
      const obj = {
        type: "Expense",
        who: "You",
        money: money,
        date: expense.createdAt,
        groupName: expense.groupName,
        desc: expense.desc,
      };

      activity.push(obj);
    }
    else{
      const obj = {
        type: "Expense",
        who: emailOfPaidBy[index]?.name,
        money: money,
        date: expense.createdAt,
        groupName: expense.groupName,
        desc: expense.desc,
      };

      activity.push(obj);
    }
    });

    // groupAdded.sort((a,b)=>b.date-a.date);

    groupAdded.map(function (group, index) {
      if(group.whoEmail==currUser.email){
        const obj = {
          type: "Group",
          who: "You",
          groupName: group.name,
          date: group.createdAt,
        };
        activity.push(obj);
      }
      else{
        const obj = {
          type: "Group",
          who: group.who,
          groupName: group.name,
          date: group.createdAt,
        };
        activity.push(obj);
      }
     
    });

    // console.log()
    activity.sort((a, b) => new Date(b.date) - new Date(a.date));


    setRecentActivity(activity);


    // console.log(activity);
  }, [currUserTotalExpenses,currUserSettledExpenses,currUser, currUserShare, groupAdded, emailOfPaidBy]);

  // useEffect(() => {
  //   if (!recentActivity) {
  //     return;
  //   }
  //   console.log("qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq", recentActivity);
  //   console.log(currUserTotalExpenses.length, groupAdded.length);
  // }, [recentActivity]);

  return (
    <div className="max-w-4xl  relative mx-auto p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      {/* Header */}
      <div className="mb-8 flex items-center   gap-4">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Recent Activity
        </h2>
        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
          {recentActivity.length} activities
        </span>
      </div>

      {/* Activity Cards */}
      <div className="space-y-2 mb-8 max-h-screen  overflow-y-scroll">
        {currActivity.map((r) => (
          <div
            // key={r._id}
            className={`group flex items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border-l-4 border-transparent ${getServiceColorr(
              Math.floor(Math.random()*13)
            )}`}
          >
            {/* Icon Section */}
            {r.type!="Settled" &&  <div
              className={`flex-shrink-0 w-12 h-12 rounded-lg ${getServiceColor(
                Math.floor(Math.random()*13)
              )} flex items-center justify-center mr-4`}
            >
           {r.type=="Expense"?<FaReceipt className="text-lg" />:<GroupAddIcon className="w-6 h-6" />}   
            </div>}
           

            {/* Main Content */}
            <div className="flex-grow">
              {r.type == "Expense" ? (
                <div>
                   
                  <p className="text-slate-600">
                    <span className="font-bold text-red-400">
                    {r?.who}
                    </span>{" "}
                    added{" "}
                    <span className="font-bold text-red-400">
                      {r?.desc}
                    </span>{" "}
                {r?.groupName?'in':''}    {" "}
                    <span className="font-bold text-red-400">
                      {r?.groupName}
                    </span>
                  </p>

                  <p className="text-slate-600">
                    You{" "}
                    {r?.money >= 0 ? (
                      <span className="font-bold text-emerald-600">
                        get back
                      </span>
                    ) : (
                      <span className="font-bold text-rose-600">owe</span>
                    )}{" "}
                    <span className="font-bold">₹{Math.abs(r?.money.toFixed(2))}</span>
                    {r.date && (
                      <div className="text-[14px]  font-bold text-blue-500 mt-1">
                        {formatDate(r.date)}
                      </div>
                    )}
                  </p>
                </div>
              ) : r.type=="Settled"? (
                <div className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100">
                <div className="p-2 bg-green-100 rounded-lg text-green-600">
                  <FaExchangeAlt className="text-lg" /> {/* Use appropriate icon */}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-purple-800">{r.who}</span>
                    <span className="text-gray-400 text-sm">→</span>
                    <span className="font-semibold text-teal-800">{r.whom}</span>
                   
                  </div>
                  
                  <div className="mt-1.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                        ₹{r.money}
                      </span>
                      {r.groupName && <span className="bg-blue-100 font-bold text-[13px] text-blue-500 rounded-[2px] p-[2px]">in {r.groupName}</span>} 
                    </div>
                    
                    {r.date && (
                      <div className="flex items-center gap-1.5 text-blue-500">
                        <FaCalendarAlt className="text-sm opacity-70" /> {/* Date icon */}
                        <span className="text-sm font-medium">
                          {formatDate(r.date)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              ): (
                <div>
                  <p className="text-slate-600">
                    <span className="font-bold text-red-400">{r.who}</span>{" "}
                    created the group{" "}
                    <span className="font-bold text-red-400">
                      {r?.groupName}
                    </span>{" "}
                    {r.date && (
                      <div className="text-[14px]  font-bold text-blue-500 mt-1">
                        {formatDate(r.date)}
                      </div>
                    )}
                    {/* in{" "} */}
                    {/* <span className="font-medium text-slate-800">
                      {r.group}
                    </span> */}
                  </p>

                 
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => setPage(Math.max(page - 1, 1))}
          disabled={page === 1}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
            page === 1
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-purple-50 text-purple-600 hover:shadow-sm"
          }`}
        >
          <ArrowLeft className="w-5 h-5" />
          Previous
        </button>

        <div className="flex items-center gap-2">
          {Array.from({ length: numberOfPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setPage(i + 1)}
              className={`w-8 h-8 rounded-md transition-colors ${
                page === i + 1
                  ? "bg-purple-600 text-white"
                  : "text-purple-600 hover:bg-purple-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <button
          onClick={() => setPage(Math.min(page + 1, numberOfPages))}
          disabled={page === numberOfPages}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
            page === numberOfPages
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-purple-50 text-purple-600 hover:shadow-sm"
          }`}
        >
          Next
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
