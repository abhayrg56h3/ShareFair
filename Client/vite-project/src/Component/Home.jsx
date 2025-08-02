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
// import { isNullOrUndef } from "chart.js/dist/helpers/helpers.core";
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
  const {visible,setVisible}=useContext(myContext);
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
  useEffect(() => {
    if (!currUser) {
      return;
    }

    async function fetchSettledExpenses() {
      try {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/settle/fetch`, {
          email: currUser.email,
        });
       
        // console.log("Settled Expenses:", res.data); // ✅ Debugging output

        setCurrUserSettledExpenses(res.data);
      } catch (err) {
        console.error("Error fetching settled expenses:", err); // ✅ Proper error logging
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
              `${import.meta.env.VITE_API_URL}/user/idtoemail/${expense.paidBy}`
            );
            //  console.log("udefu3g3yu4gf3ygohgfv4rou24gf8y3rguyqerfvugryv80y42",r.data.email);
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
      if (!currUser || !currUser.friends) return; // Prevent errors if currUser is undefined

      try {
        const dosts = await Promise.all(
          currUser.friends.map(async (friendId) => {
            const response = await axios.get(
              `${import.meta.env.VITE_API_URL}/user/getname/${friendId}`
            );
            return response.data;
          })
        );
        setFriends(dosts); // Update state properly
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
        console.log("groupSettles", res.data);
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
            console.log(member.email);
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

  // fetch currUser's all expenses

  useEffect(() => {
    if (!emailOfPaidBy) {
      return;
    }

    // console.log("udefu3g3yu4gf3ygohgfv4rou24gf8y3rguyqerfvugryv80y42",emailOfPaidBy);
    async function fetchExpenses() {
      if (!currUser || !currUserSettledExpenses) {
        return;
      }

      // console.log("Bosda",currUserSettledExpenses);
      try {
        const expenses = await axios.post(
          `${import.meta.env.VITE_API_URL}/expense/getallexpenses`,
          { email: currUser.email }
        );

        // console.log("Chachu",expenses.data);

        setCurrUserTotalExpenses(expenses.data);

        //  console.log("SIZE ",expenses.data.length);
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
      //      expense.splits.map(function(split){
      //           if(split.email!=currUser.email){
      //             const val=expenseMap.get(split.email);
      //             if(!val){
      //             expenseMap.set(split.email,split.share*expense.amount);
      //             }
      //             else{
      //               expenseMap.set(split.email,split.share*expense.amount+val);
      //             }
      //           }
      //      });
      // }

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
        if (!split) return; // Avoid errors if no matching split is found

        const share = split.share / 100;
        const userEmail = emailOfPaidBy[index]?.email; // Extract email safely

        if (!userEmail) return; // Ensure userEmail is valid before updating

        // Retrieve current value safely; default to 0 if not found
        const currentValue = expenseMap.get(userEmail) || 0;

        // Update the map with accumulated values
        expenseMap.set(userEmail, currentValue - share * expense.amount);

        // console.log(`Updated ${userEmail}: ${expenseMap.get(userEmail)}`);
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

    // console.log(currUserTotalExpenses.length);

    var totalLent = 0;
    var totalOwed = 0;

    var oList = [];
    var LList = [];
    expenseMap.forEach(function (value, key) {
      // console.log(key,value);
      if (value < 0) {
        totalOwed += value;
        oList.push({ email: key, amount: value.toFixed(2) });
      } else if (value) {
        totalLent += value;
        LList.push({ email: key, amount: value.toFixed(2) });
      }
      // console.log(key,value);
    });
    setLent(Number(totalLent.toFixed(2)));
    setOwed(Number(totalOwed.toFixed(2)));
    setLentList(LList);
    setOwedList(oList);
    setTimeout(() => {
      setFriendDependency(true);
    }, 100);

    console.log("dugfqewugfuqrgfi1urhf13111111111111111111111", lentList);
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
    // setFriendDependency(false);
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
      document.body.style.overflow = "hidden"; // Prevent scrolling
    } else {
      document.body.style.overflow = "auto"; // Restore scrolling
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

        // console.log(res.data);
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
    groupMembers.map(function (member) {
      console.log(member);
    });
  }, [groupMembers]);

  const { dashBoard, setDashBoard, expenses, setExpenses, recent, setRecent } =
    useContext(myContext);

  // if (!currUser) {

  //   return
  //    <Loading />;
  // }
  return (
    <div className=" px-[15px] py-[80px] z-0  h-screen relative flex ">
      {/* Left Section */}
      <div
        className={`flex-1 pr-5  border-r    lg:block  ${
          (addExpense || addFriend || showSettle) && "opacity-10"
        } border-gray-200`}
      >
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <span
              className="text-2xl font-bold text-indigo-600 cursor-pointer"
              onClick={dashboardClick}
            >
              Dashboard
            </span>
            <span
              className="text-sm text-gray-500 flex items-center gap-2 cursor-pointer"
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
          </div>

          {/* All Expenses Card */}
          <div className="space-y-6">
            {/* All Expenses Header */}
            <div className="flex justify-between items-center pb-2 border-b border-gray-200">
              <h3
                className="font-semibold !text-[15px] flex items-center gap-2"
                
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-red-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4z"
                    clipRule="evenodd"
                  />
                </svg>
                All Expenses
              </h3>
              <span onClick={expenseClick} className="text-sm text-blue-600 cursor-pointer hover:underline">
                See All
              </span>
            </div>
          </div>

          {/* Groups Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-200">
              <h3 className="font-semibold flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-purple-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
                <span>Groups</span>
                <span
                  className="text-[15px] items-center hover:underline cursor-pointer"
                  onClick={() => navigate("/creategroup")}
                >
                  + Add
                </span>
              </h3>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {groups.length}
              </span>
            </div>
            <ul className="space-y-3">
              {groups &&
                groups.map((group, ind) => (
                  <li
                    onClick={() => handleGroup(group)}
                    key={ind}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                  >
                    <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-purple-600"
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
                    <div>
                      <p className="text-sm font-medium">{group.name}</p>
                      <p className="text-xs text-gray-500">
                        {group.members.length} members
                      </p>
                    </div>
                  </li>
                ))}
            </ul>
          </div>

          {/* Friends Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-200">
              <h3 className="font-semibold flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-green-600"
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
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                {currUser.friends.length}
              </span>
            </div>
            <ul className="space-y-3">
              {friends &&
                friends.map((friend) => (
                  <li
                    key={friend}
                    onClick={() => handleFriend(friend)}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                  >
                    <div className="relative">
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
                      <div className="absolute bottom-0 right-0 h-2 w-2 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium"> {friend?.name}</p>
                      {/* <p className="text-xs text-gray-500">Last seen 2h ago</p> */}
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Center Section */}

      <div 
        className={`lg:flex-3 h-[100%] w-full ${
          (addExpense || addFriend || showSettle) && "opacity-10"
        }`}
      >
        {/* Header */}

        {!dashBoard && !recent && !currFriend && !currGroup && !expenses && (
          <Loading />
        )}

        {!recent && (
          <div className={`flex space-x-3 pr-9 pl-2 items-center justify-between mb-6`}>
            <h1
              className="!text-[20px] font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
              // onClick={() => setAddExpense(true)}
            >
              {currGroup
                ? currGroup.name
                : dashBoard
                ? "DashBoard"
                : expenses
                ? "All Expenses"
                : currFriend
                ? currFriend.name
                : ""}
            </h1>

            {!dashBoard && !expenses && (
              <div className="flex  gap-2">
                <button
                  onClick={() => setAddExpense(true)}
                  className="flex items-center h-[30px] w-[80px] gap-1 px-3 py-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-all shadow-sm hover:shadow-md"
                >
                  <FaPlus className="text-sm hidden" />
                  <span className="text-[10px]">Add Expense</span>
                </button>

                {currFriend && (
                  <button
                    onClick={() => setShowSettle(1)}
                    className="flex items-center h-[30px] w-[80px] gap-1 px-3 py-1.5 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-all shadow-sm hover:shadow-md"
                  >
                    <FaHandshake className=" hidden text-sm" />
                    <span className="text-[10px]">Settle Up</span>
                  </button>
                )}
                {currGroup && (

                   <div className="flex items-center gap-2"> 
                   {isChatOpen ? <button
                    onClick={() => setIsChatOpen(false)}
                    className="flex items-center h-[30px] w-[80px]   gap-1 px-3 py-1.5 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-all shadow-sm hover:shadow-md"
                  >
                    
                    
                    <Chat className="hidden text-sm" />
                    <span className="text-[10px]">Close Chat</span>
                  </button>:<button
                    onClick={() => setIsChatOpen(true)}
                    className="flex items-center h-[30px] w-[80px]   gap-1 px-3 py-1.5 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-all shadow-sm hover:shadow-md"
                  >
                    
                     
                    <Chat className="hidden text-sm" />
                    <span className="text-[10px]">Open Chat</span>
                  </button>}
                    
                    
                    <button
                    onClick={() => setShowSettle(1)}
                    className="flex items-center h-[30px] w-[80px]   gap-1 px-3 py-1.5 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-all shadow-sm hover:shadow-md"
                  >
                    
                    
                    <FaHandshake className="hidden text-sm" />
                    <span className="text-[10px]">Settle Up</span>
                  </button></div>
                  

                )}
                {currFriend && (
                  <button
                    onClick={() => setSettledExpenses(1)}
                    className="flex items-center h-[30px] w-[80px] gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all shadow-sm hover:shadow-md"
                  >
                    <ThumbUpAltIcon className="!hidden text-sm " />
                    <span className="text-[8px]">Show Settled Expenses</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}

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

      {/* Right Section */}

      <div
        className={`flex-1 ${
          (addExpense || addFriend || showSettle) &&
          "opacity-10 backdrop-blur-2xl "
        }`}
      >
        {currFriend && (
          <div className="max-w-md  p-6 bg-white rounded-xl shadow-sm transition-all duration-200 hover:shadow-md">
            {currFriendMoney == 0 ? (
              <div className="flex flex-col items-center text-center p-4 w-[160px] mx-auto bg-green-50 rounded-lg">
                <CheckCircleIcon className="h-8 w-8 text-green-600 mb-2" />
                <p className="text-green-800 text-[12px] font-medium">
                  You're all settled up!
                </p>
                <p className="text-green-600 text-[12px]">
                  No balances with {currFriend.name}
                </p>
              </div>
            ) : currFriendMoney < 0 ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-orange-600">
                  <ScaleIcon className="h-5 w-5" />
                  <span className="text-sm font-semibold">Your balance</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg">
                  <ArrowDownIcon className="h-6 w-6 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-600">You owe</p>
                    <p className="font-semibold text-orange-600">
                      {currFriend.name}
                      <span className="ml-2 text-lg break-words">
                        ₹{Math.abs(currFriendMoney)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-purple-600">
                  <ScaleIcon className="h-5 w-5" />
                  <span className="text-sm font-semibold">Your balance</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                  <ArrowUpIcon className="h-6 w-6 text-purple-500" />
                  <div>
                    <p className="font-semibold text-purple-600">
                      {currFriend.name}
                    </p>
                    <p className=" text-sm text-gray-600">
                      Owes you
                      <span className="ml-2 text-lg font-semibold text-purple-600">
                        ₹{Math.abs(currFriendMoney)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {currGroup && (
          <div className="max-w-md mx-auto  space-y-4">
            {/* Header */}
            <div className="mb-4">
              <h1 className="!text-[20px] font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                Group Balances
              </h1>
              <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-600 w-24 mt-1 rounded-full"></div>
            </div>

            {/* Members List */}
            <ul className="space-y-3 !pl-0">
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
                    className="flex min-w-[160px]  mr-3 items-center p-2 bg-white rounded-lg shadow-md border-l-4 border-purple-500 hover:border-pink-500 transition-all duration-200"
                  >
                    {/* Profile Image */}
                    <img
                      src={groupMembers[index]?.profilePicture || ""}
                      className="w-7 h-7 rounded-full border-2 border-purple-200 mr-3"
                      alt="Profile"
                    />

                    {/* Member Details */}
                    <div className="flex-1">
                      <span className="font-semibold text-gray-800 text-[14px]">
                        {groupMembers[index]?.name}
                      </span>
                      <div className="flex justify-between items-center mt-0.5">
                        <span
                          className={`text-[10px] font-medium ${
                            totalMoney < 0 ? "text-red-600" : "text-green-600"
                          }`}
                        >
                          {totalMoney < 0 ? "owes" : "gets back"}
                        </span>
                        <span
                          className={`text-[15px] font-semibold ${
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

      {addFriend && (
        <div className="fixed inset-0   flex justify-center items-center">
          <AddFriend setAddFriend={setAddFriend} className="" />
        </div>
      )}

      {showSettle && currGroup && (
        <div className="absolute top-30 left-4 right-4 z-20">
          <GroupSettle
            group={currGroup}
            groupMembers={groupMembers}
            showSettle={showSettle}
            setShowSettle={setShowSettle}
          />
        </div>
      )}

      {showSettle && currFriend && (
        <div className="absolute top-40 left-4 right-4 z-20">
          <SettleUp
            friend={currFriend}
            // groupMembers={groupMembers}
            showSettle={showSettle}
            setShowSettle={setShowSettle}
          />
        </div>
      )}

      {addExpense && (
        <div className="fixed inset-0  flex justify-center gap-11 items-center">
          <div className="flex justify-center ">
            <motion.div
              className="flex-1"
              initial={{ x: 0 }}
              animate={{ x: share ? -30 : 0 }} // Moves left when `share` appears
              transition={{ duration: 0.5, ease: "easeInOut" }} // Smooth animation
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
                className="flex-1"
                initial={{ x: 0 }}
                animate={{ x: share ? 30 : 0 }} // Moves left when `share` appears
                transition={{ duration: 0.5, ease: "easeInOut" }} // Smooth animation
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
          </div>
        </div>
      )}
    </div>
  );
}
