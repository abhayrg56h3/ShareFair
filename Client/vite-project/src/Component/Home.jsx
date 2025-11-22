import React, { useContext, useEffect, useState } from "react";
import Dashboard from "./Dashboard";
import Recent from "./Recent";
import Friends from "./Friends";
import Expenses from "./Expenses";
import AddExpense from "./AddExpense";
import Share from "./Share";
import { myContext } from "./AuthContext";
import Groups from "./Groups";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import AddFriend from "./AddFriend";
import Loading from "./Loading";
import GroupSettle from "./GroupSettle";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import SettleUp from "./SettleUp";
import {
  FaPlus,
  FaHandshake,
  FaReceipt,
  FaArrowAltCircleUp,
} from "react-icons/fa";
import { Opacity } from "@mui/icons-material";
import { Chat } from "@mui/icons-material";
import { use } from "react";
import useEnhancedEffect from "@mui/material/utils/useEnhancedEffect";
import Settle from "../../../../Server/Models/Settle";

export default function Home() {
  const [addFriend, setAddFriend] = useState(false);
  const [groups, setGroups] = useState([]);
  const { currGroup, setCurrGroup } = useContext(myContext);
  const { currFriend, setCurrFriend } = useContext(myContext);
  const { currUser } = useContext(myContext);
  const navigate = useNavigate();
  const [addExpense, setAddExpense] = useState(false);
  const [share, setShare] = useState(false);
  const [category, setCategory] = useState("equal");
  const [wit, setWit] = useState(null);
  const [type, setType] = useState(null);
  const [friends, setFriends] = useState([]);
  const [members, setMembers] = useState([]);
  const [expensesList, setExpensesList] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);
  const [owedList, setOwedList] = useState([]);
  const [lentList, setLentList] = useState([]);
  const [lent, setLent] = useState(0);
  const [owed, setOwed] = useState(0);
  const expenseMap = new Map();
  const [emailOfPaidBy, setEmailOfPaidBy] = useState([]);
  const [currUserTotalExpenses, setCurrUserTotalExpenses] = useState([]);
  const [showSettle, setShowSettle] = useState(false);
  const [currUserSettledExpenses, setCurrUserSettledExpenses] = useState([]);
  const [settledExpenses, setSettledExpenses] = useState(false);
  const [currFriendMoney, setCurrFriendMoney] = useState(null);
  const { friendKey } = useContext(myContext);
  const { groupKey } = useContext(myContext);
  const [groupSettlesList, setGroupSettlesList] = useState(null);
  const { friendDependency, setFriendDependency } = useContext(myContext);
  const [resetDone, setResetDone] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { visible, setVisible } = useContext(myContext);

  // ... (Icons Logic kept exactly the same) ...
  const CheckCircleIcon = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  );

  const ScaleIcon = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.07 1 1 0 01-.285-1.05l1.715-5.349L11 4.477V4H9v.477l-3.162 1.254L7.95 9.88a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.668-1.07 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1zm-5 8.274l-.818 2.552c.25.112.526.174.818.174.291 0 .569-.062.818-.174L5 10.274zm10 0l-.818 2.552c.25.112.526.174.818.174.291 0 .569-.062.818-.174L15 10.274z"
        clipRule="evenodd"
      />
    </svg>
  );

  const ArrowDownIcon = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );

  const ArrowUpIcon = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );

  // ... (All Effects Logic kept exactly the same) ...
  useEffect(() => {
    if (!currUser) {
      return;
    }
    async function fetchSettledExpenses() {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/settle/fetch`,
          {
            email: currUser.email,
          }
        );
        setCurrUserSettledExpenses(res.data);
      } catch (err) {
        console.error("Error fetching settled expenses:", err);
      }
    }
    fetchSettledExpenses();
  }, [currUser, friendKey, groupKey]);

  useEffect(() => {
    async function fetchEmailFromId() {
      if (!currUserTotalExpenses) {
        return;
      }
      try {
        const res = await Promise.all(
          currUserTotalExpenses.map(async function (expense) {
            const r = await axios.get(
              `${import.meta.env.VITE_API_URL}/user/idtoemail/${
                expense.paidBy
              }`
            );
            return r.data;
          })
        );
        setEmailOfPaidBy(res);
      } catch (err) {
        console.log(err);
      }
    }
    fetchEmailFromId();
  }, [currUserTotalExpenses, friendKey, groupKey]);

  useEffect(() => {
    const fetchFriendName = async () => {
      if (!currUser || !currUser.friends) return;
      try {
        const dosts = await Promise.all(
          currUser.friends.map(async (friendId) => {
            const response = await axios.get(
              `${import.meta.env.VITE_API_URL}/user/getname/${friendId}`
            );
            return response.data;
          })
        );
        setFriends(dosts);
      } catch (err) {
        console.error("Error fetching friend names:", err);
      }
    };
    fetchFriendName();
  }, [currUser]);

  useEffect(() => {
    setSettledExpenses(false);
  }, [currFriend, friendKey]);

  useEffect(() => {
    async function fetchGroupSettles() {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/groupsettle/fetch`,
          {
            groupId: currGroup?._id,
          }
        );
        setGroupSettlesList(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchGroupSettles();
  }, [currGroup]);

  useEffect(() => {
    async function fetchId() {
      if (!currGroup) {
        return;
      }
      try {
        const member = await Promise.all(
          currGroup.members.map(async function (member) {
            const response = await axios.get(
              `${import.meta.env.VITE_API_URL}/user/emailtoid/${member.email}`
            );
            return response.data;
          })
        );
        setGroupMembers(member);
      } catch (err) {
        console.log(err);
      }
    }
    fetchId();
  }, [currGroup, groupKey]);

  useEffect(() => {
    if (!emailOfPaidBy) {
      return;
    }
    async function fetchExpenses() {
      if (!currUser || !currUserSettledExpenses) {
        return;
      }
      try {
        const expenses = await axios.post(
          `${import.meta.env.VITE_API_URL}/expense/getallexpenses`,
          { email: currUser.email }
        );
        setCurrUserTotalExpenses(expenses.data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchExpenses();
  }, [currUser, currUserSettledExpenses, currFriend, friendKey, groupKey]);

  useEffect(() => {
    if (!currUserSettledExpenses || !currUserTotalExpenses) {
      return;
    }
    currUserTotalExpenses.map(function (expense, index) {
      if (expense.paidBy === currUser._id) {
        expense.splits.map(function (split) {
          if (split.email != currUser.email) {
            const val = expenseMap.get(split.email) || 0;
            expenseMap.set(
              split.email,
              (split.share / 100) * expense.amount + val
            );
          }
        });
      } else {
        const split = expense.splits.find((s) => s.email === currUser.email);
        if (!split) return;
        const share = split.share / 100;
        const userEmail = emailOfPaidBy[index]?.email;
        if (!userEmail) return;
        const currentValue = expenseMap.get(userEmail) || 0;
        expenseMap.set(userEmail, currentValue - share * expense.amount);
      }
    });
    currUserSettledExpenses.map(function (se) {
      if (se.who == currUser.email) {
        const val = expenseMap.get(se.whom) || 0;
        expenseMap.set(se.whom, val + se.amount);
      } else {
        const val = expenseMap.get(se.who) || 0;
        expenseMap.set(se.who, val - se.amount);
      }
    });

    var totalLent = 0;
    var totalOwed = 0;
    var oList = [];
    var LList = [];
    expenseMap.forEach(function (value, key) {
      if (value < 0) {
        totalOwed += value;
        oList.push({ email: key, amount: value.toFixed(2) });
      } else if (value) {
        totalLent += value;
        LList.push({ email: key, amount: value.toFixed(2) });
      }
    });
    setLent(Number(totalLent.toFixed(2)));
    setOwed(Number(totalOwed.toFixed(2)));
    setLentList(LList);
    setOwedList(oList);
    setTimeout(() => {
      setFriendDependency(true);
    }, 100);
  }, [
    emailOfPaidBy,
    currFriend,
    currUserTotalExpenses,
    currUserSettledExpenses,
  ]);

  function recentClick() {
    setDashBoard(false);
    setRecent(true);
    setExpenses(false);
    setCurrFriend(false);
    setCurrGroup(false);
  }
  function expenseClick() {
    setDashBoard(false);
    setRecent(false);
    setExpenses(true);
    setCurrFriend(false);
    setCurrGroup(false);
  }
  function dashboardClick() {
    setDashBoard(true);
    setRecent(false);
    setExpenses(false);
    setCurrFriend(false);
    setCurrGroup(false);
  }
  function handleGroup(cur) {
    setDashBoard(false);
    setRecent(false);
    setExpenses(false);
    setCurrFriend(false);
    setCurrGroup(cur);
    const newShare = cur.members.map(function (m) {
      return m.share;
    });
    setMembers(newShare);
  }
  function handleFriend(friend) {
    setDashBoard(false);
    setRecent(false);
    setExpenses(false);
    setCurrGroup(false);
    setCurrFriend(friend);
    setMembers([50, 50]);
    setResetDone(false);
  }

  useEffect(() => {
    if (currFriend) {
      setType("Friend");
    } else if (currGroup) {
      setType("Group");
    }
  }, [currGroup, currFriend]);

  useEffect(() => {
    if (addExpense || showSettle || addFriend) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [addExpense, showSettle, addFriend]);

  useEffect(() => {
    async function fetchGroups() {
      if (!currUser) {
        return;
      }
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/group/fetch`,
          currUser
        );
        setGroups(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchGroups();
  }, [currUser]);

  useEffect(() => {
    if (!groupMembers) {
      return;
    }
  }, [groupMembers]);

  const { dashBoard, setDashBoard, expenses, setExpenses, recent, setRecent } =
    useContext(myContext);

  return (
    <>
      <style>
        {`
          .scrollbar-hide::-webkit-scrollbar {
              display: none;
          }
          .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
          }
        `}
      </style>
      <div className="w-full h-screen bg-gray-50 flex flex-col lg:flex-row overflow-hidden pt-[64px] font-sans">
        
        {/* --- Left Section (Sidebar/Navigation) --- 
            Strict Vertical Layout (No horizontal slider) */}
        <div
          className={`flex-none bg-white border-b lg:border-b-0 lg:border-r border-gray-200 
          w-full lg:w-80 h-auto max-h-[35vh] lg:max-h-full lg:h-full 
          overflow-y-auto overflow-x-hidden z-20 shadow-sm lg:shadow-none
          transition-all duration-300
          ${(addExpense || addFriend || showSettle) ? "opacity-50 pointer-events-none" : ""}`}
        >
          <div className="flex flex-col gap-6 p-4 lg:p-6">
            
            {/* Dashboard / Recent Links - VERTICAL LAYOUT (flex-col) */}
            <div className="flex flex-col gap-3 items-start w-full">
              <span
                className="w-full text-left px-3 py-2 text-lg lg:text-xl font-bold text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                onClick={dashboardClick}
              >
                Dashboard
              </span>
              <span
                className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                onClick={recentClick}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
                Recent Activity
              </span>
               {/* Mobile "All Expenses" Button - VERTICAL */}
               <div className="lg:hidden w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg cursor-pointer" onClick={expenseClick}>
                  <FaReceipt className="text-gray-400" /> All Expenses
               </div>
            </div>

            {/* All Expenses Section (Desktop Visual) */}
            <div className="hidden lg:block space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <h3 className="font-semibold text-[15px] flex items-center gap-2 text-gray-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-indigo-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Expenses
                </h3>
                <span
                  onClick={expenseClick}
                  className="text-xs font-medium text-indigo-600 cursor-pointer hover:text-indigo-800 transition-colors"
                >
                  View All
                </span>
              </div>
            </div>

            {/* Groups Section */}
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-purple-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                  <span>Groups</span>
                </h3>
                <div className="flex items-center gap-2">
                  <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {groups.length}
                  </span>
                  <span
                    className="text-xs font-medium text-gray-400 hover:text-purple-600 cursor-pointer transition-colors"
                    onClick={() => navigate("/creategroup")}
                  >
                    + Add
                  </span>
                </div>
              </div>
              <ul className="space-y-1 lg:space-y-2 max-h-40 lg:max-h-60 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-200">
                {groups &&
                  groups.map((group, ind) => (
                    <li
                      onClick={() => handleGroup(group)}
                      key={ind}
                      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-200 border border-transparent
                        ${currGroup?._id === group._id ? "bg-purple-50 border-purple-100" : "hover:bg-gray-50"}`}
                    >
                      <div className="h-8 w-8 bg-purple-100 text-purple-600 rounded-lg flex-shrink-0 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-700 truncate">{group.name}</p>
                        <p className="text-[10px] text-gray-400">
                          {group.members.length} members
                        </p>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>

            {/* Friends Section */}
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-emerald-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Friends</span>
                </h3>
                <div className="flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {currUser?.friends.length}
                </span>
                <span
                   className="text-xs font-medium text-gray-400 hover:text-emerald-600 cursor-pointer transition-colors"
                   onClick={() => setAddFriend(true)}
                >
                    + Add
                </span>
                </div>
              </div>
              <ul className="space-y-1 lg:space-y-2 max-h-40 lg:max-h-60 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-200">
                {friends &&
                  friends.map((friend) => (
                    <li
                      key={friend}
                      onClick={() => handleFriend(friend)}
                      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-200 border border-transparent
                          ${currFriend?._id === friend?._id ? "bg-emerald-50 border-emerald-100" : "hover:bg-gray-50"}`}
                    >
                      <div className="relative flex-shrink-0">
                        <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-blue-600"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-emerald-500 rounded-full border-2 border-white"></div>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-700 truncate"> {friend?.name}</p>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>

        {/* --- Center Section (Main Content) --- 
            Applied "scrollbar-hide" class here */}
        <div
          className={`flex-1 w-full h-full overflow-y-auto scrollbar-hide relative bg-gray-50 p-4 lg:p-8
          transition-opacity duration-300
          ${(addExpense || addFriend || showSettle) ? "opacity-30 pointer-events-none lg:opacity-30" : ""}`}
        >
          {/* Loading State */}
          {!dashBoard && !recent && !currFriend && !currGroup && !expenses && (
            <div className="flex justify-center items-center h-full">
              <Loading />
            </div>
          )}

          {/* Content Header */}
          {!recent && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 sticky top-0 bg-gray-50/95 backdrop-blur-sm z-10 py-2">
              <h1 className="text-2xl lg:text-3xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent truncate">
                {currGroup
                  ? currGroup.name
                  : dashBoard
                  ? "Dashboard"
                  : expenses
                  ? "All Expenses"
                  : currFriend
                  ? currFriend.name
                  : ""}
              </h1>

              {/* Action Buttons */}
              {!dashBoard && !expenses && (
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  <button
                    onClick={() => setAddExpense(true)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 text-sm font-medium shadow-md"
                  >
                    <FaPlus className="text-xs" />
                    <span>Add Expense</span>
                  </button>

                  {currFriend && (
                    <>
                    <button
                      onClick={() => setShowSettle(1)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 text-sm font-medium shadow-md"
                    >
                      <FaHandshake className="text-xs" />
                      <span>Settle Up</span>
                    </button>
                     <button
                     onClick={() => setSettledExpenses(1)}
                     className="flex items-center justify-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 hover:shadow-md transition-all duration-200 text-sm font-medium shadow-sm"
                   >
                     <ThumbUpAltIcon className="!text-sm text-gray-500" />
                     <span className="hidden sm:inline">Settled</span>
                   </button>
                   </>
                  )}

                  {currGroup && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsChatOpen(!isChatOpen)}
                        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium shadow-md ${isChatOpen ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-teal-600 text-white hover:bg-teal-700 hover:shadow-lg hover:-translate-y-0.5'}`}
                      >
                        <Chat className="!text-sm" />
                        <span>{isChatOpen ? "Close Chat" : "Chat"}</span>
                      </button>

                      <button
                        onClick={() => setShowSettle(1)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 text-sm font-medium shadow-md"
                      >
                        <FaHandshake className="text-xs" />
                        <span className="hidden sm:inline">Settle Up</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Dynamic Components */}
          <div className="pb-20 lg:pb-0"> 
            {dashBoard && (
              <Dashboard
                lent={lent}
                owed={owed}
                setOwed={setOwed}
                setLent={setLent}
                owedList={owedList}
                setOwedList={setOwedList}
                lentList={lentList}
                setLentList={setLentList}
              />
            )}
            {expenses && (
              <Expenses
                currUser={currUser}
                emailOfPaidBy={emailOfPaidBy}
                currUserTotalExpenses={currUserTotalExpenses}
              />
            )}
            {recent && (
              <Recent
                currUserSettledExpenses={currUserSettledExpenses}
                emailOfPaidBy={emailOfPaidBy}
                currUserTotalExpenses={currUserTotalExpenses}
              />
            )}

            {currGroup && (
              <Groups
                key={groupKey}
                groupSettlesList={groupSettlesList}
                groupMembers={groupMembers}
                expenses={expensesList}
                setExpenses={setExpensesList}
                group={currGroup}
                showSettle={showSettle}
                setShowSettle={setShowSettle}
                isChatOpen={isChatOpen}
                setIsChatOpen={setIsChatOpen}
              />
            )}
            {currFriend && (
              <Friends
                key={friendKey}
                currFriendMoney={currFriendMoney}
                setCurrFriendMoney={setCurrFriendMoney}
                setSettledExpenses={setSettledExpenses}
                settledExpenses={settledExpenses}
                currUserSettledExpenses={currUserSettledExpenses}
                showSettle={showSettle}
                setShowSettle={setShowSettle}
                friend={currFriend}
                owedList={owedList}
                lentList={lentList}
                setResetDone={setResetDone}
                resetDone={resetDone}
              />
            )}
          </div>
        </div>

        {/* --- Right Section (Details/Summary) --- */}
        <div
          className={`hidden xl:block w-80 flex-none bg-white border-l border-gray-200 h-full p-6 overflow-y-auto 
            ${(addExpense || addFriend || showSettle) ? "opacity-50 pointer-events-none" : ""}`}
        >
          {currFriend && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              {currFriendMoney == 0 ? (
                <div className="flex flex-col items-center text-center p-6 bg-green-50 rounded-xl border border-green-100">
                  <div className="bg-white p-2 rounded-full mb-3 shadow-sm">
                     <CheckCircleIcon className="h-8 w-8 text-green-500" />
                  </div>
                  <p className="text-green-900 font-semibold mb-1">
                    All settled up!
                  </p>
                  <p className="text-green-600 text-xs">
                    No balances with {currFriend.name}
                  </p>
                </div>
              ) : currFriendMoney < 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-orange-600 font-semibold border-b border-gray-100 pb-2">
                    <ScaleIcon className="h-5 w-5" />
                    <span className="text-sm">Balance Status</span>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-xl border border-orange-100">
                    <div className="bg-white p-1.5 rounded-lg shadow-sm">
                       <ArrowDownIcon className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-orange-800 uppercase tracking-wide">You owe</p>
                      <p className="font-bold text-orange-700 text-lg">
                        {currFriend.name}
                      </p>
                      <p className="font-extrabold text-2xl text-orange-600 mt-1">
                        ₹{Math.abs(currFriendMoney)}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-purple-600 font-semibold border-b border-gray-100 pb-2">
                    <ScaleIcon className="h-5 w-5" />
                    <span className="text-sm">Balance Status</span>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-xl border border-purple-100">
                     <div className="bg-white p-1.5 rounded-lg shadow-sm">
                       <ArrowUpIcon className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <p className="font-bold text-purple-700 text-lg">
                        {currFriend.name}
                      </p>
                      <p className="text-xs font-medium text-purple-800 uppercase tracking-wide">Owes you</p>
                      <p className="font-extrabold text-2xl text-purple-600 mt-1">
                        ₹{Math.abs(currFriendMoney)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {currGroup && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <h1 className="text-xl font-bold text-gray-800">
                  Group Balances
                </h1>
                <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500 w-16 mt-2 rounded-full"></div>
              </div>

              <ul className="space-y-3">
                {currGroup.members.map((member, index) => {
                  let totalMoney = 0;
                  expensesList.forEach((expense) => {
                    if (expense.settled == false) {
                      const split = expense.splits.find(
                        (s) => s.email === member.email
                      );
                      const share = split ? split.share : 2;
                      totalMoney +=
                        expense.paidBy === groupMembers[index]?._id
                          ? (1 - share / 100) * expense.amount
                          : -(share / 100) * expense.amount;
                    }
                  });
                  groupSettlesList?.map(function (gs) {
                    if (gs.who.email == groupMembers[index]?.email) {
                      totalMoney += gs.amount;
                    }
                    if (gs.whom.email == groupMembers[index]?.email) {
                      totalMoney -= gs.amount;
                    }
                  });

                  return (
                    <li
                      key={member.email}
                      className="flex items-center p-3 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-purple-200 transition-all duration-200 group"
                    >
                      <div className="relative">
                         <img
                          src={groupMembers[index]?.profilePicture || ""}
                          className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm mr-3"
                          alt="Profile"
                        />
                        <div className={`absolute -bottom-1 -right-0 w-3 h-3 rounded-full border-2 border-white ${totalMoney < 0 ? 'bg-red-500' : 'bg-green-500'}`}></div>
                      </div>
                     
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 text-sm truncate">
                          {groupMembers[index]?.name}
                        </p>
                        <div className="flex flex-col">
                          <span
                            className={`text-[11px] font-medium uppercase tracking-wider ${
                              totalMoney < 0 ? "text-red-500" : "text-green-500"
                            }`}
                          >
                            {totalMoney < 0 ? "owes" : "gets back"}
                          </span>
                          <span
                            className={`text-sm font-bold ${
                              totalMoney < 0 ? "text-red-600" : "text-green-600"
                            }`}
                          >
                            ₹{Math.abs(totalMoney).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        {/* --- Modals & Overlays --- */}

        {addFriend && (
          <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
             <div className="w-full max-w-md">
               <AddFriend setAddFriend={setAddFriend} className="" />
             </div>
          </div>
        )}

        {showSettle && currGroup && (
          <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl relative overflow-hidden">
              <GroupSettle
                group={currGroup}
                groupMembers={groupMembers}
                showSettle={showSettle}
                setShowSettle={setShowSettle}
              />
            </div>
          </div>
        )}

        {showSettle && currFriend && (
          <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl relative">
              <SettleUp
                friend={currFriend}
                showSettle={showSettle}
                setShowSettle={setShowSettle}
              />
            </div>
          </div>
        )}

        {addExpense && (
          <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="flex justify-center w-full max-w-4xl relative">
              <motion.div
                className="w-full max-w-lg relative z-10"
                initial={{ x: 0 }}
                animate={{ x: share ? -20 : 0 }} 
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <AddExpense
                  members={members}
                  setMembers={setMembers}
                  setShare={setShare}
                  wit={currGroup ? currGroup : currFriend ? currFriend : ""}
                  setCategory={setCategory}
                  type={currGroup ? "Group" : currFriend ? "Friend" : ""}
                  show={addExpense}
                  setShow={setAddExpense}
                />
              </motion.div>
              
              {share && (
                <motion.div
                  className="hidden lg:block w-full max-w-md ml-4"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <Share
                    members={members}
                    setMembers={setMembers}
                    currUser={currUser}
                    wit={currGroup ? currGroup : currFriend}
                    type={currGroup ? "Group" : currFriend ? "Friend" : ""}
                  />
                </motion.div>
              )}
               {/* Mobile handling for Share often needs a separate modal or stack, but preserving logic structure here */}
               {share && (
                  <div className="lg:hidden fixed inset-0 z-60 bg-white p-4 overflow-y-auto">
                      <button className="mb-4 text-indigo-600 font-bold" onClick={()=>setShare(false)}>← Back</button>
                      <Share
                      members={members}
                      setMembers={setMembers}
                      currUser={currUser}
                      wit={currGroup ? currGroup : currFriend}
                      type={currGroup ? "Group" : currFriend ? "Friend" : ""}
                      />
                  </div>
               )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}