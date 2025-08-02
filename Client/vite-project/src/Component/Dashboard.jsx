import React, { useContext, useEffect, useState } from "react";
import { Chart } from "chart.js/auto";
import axios from "axios";
import { myContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
export default function Dashboard({
  lent,
  setLent,
  owed,
  setOwed,
  lentList,
  setLentList,
  owedList,
  setOwedList
}) {
  const [activeTab, setActiveTab] = useState("owed");
  const [activeView, setActiveView] = useState("list");

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
        console.log("Bosda", res.data);
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

  const [owedUsers,setOwedUsers]=useState([]);
  const [lentUsers,setLentUsers]=useState([]);


  useEffect(()=>{

    if(!lentList || !owedList){
      return ;
    }


    // console.log("Check kar raha hun" ,lentList)
    let isMounted = true; // Step 1: Component is mounted
    async function fetchUserFromEmail(){
               try{
            const usersOwed=await Promise.all(
                owedList.map(async function(item){
                  const res=await axios.get(`${import.meta.env.VITE_API_URL}/user/usersfromemail/${item.email}`);
                          const user=res.data;
                          return user;
                })
                
            )
            const usersLent=await Promise.all(
              lentList.map(async function(item){
                const res=await axios.get(`${import.meta.env.VITE_API_URL}/user/usersfromemail/${item.email}`);
                        const user=res.data;
                        return user;
              })
              
          )
          if (isMounted) { // Step 3: Only update state if component is still mounted
            setOwedUsers(usersOwed);
            setLentUsers(usersLent);
          }
               }
               catch(err){
                console.log(err);
               }
    };
    fetchUserFromEmail();
    
  return () => {
    isMounted = false; // Step 2: Cleanup function runs on unmount
  };
  },[lentList,owedList])



  return (


  <div>
    






























<div className="max-w-4xl mx-auto px-2 sm:px-4 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Top Section */}
      <div className="bg-white rounded-2xl shadow-lg p-3 sm:p-6 mb-4 sm:mb-6 border border-slate-200/50 backdrop-blur-sm">
        {/* Balance Cards */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
          <div className="bg-gradient-to-br from-violet-100 to-indigo-100 p-3 sm:p-4 rounded-xl border border-violet-200/50 shadow-sm">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-violet-600 flex items-center justify-center">
                <WalletIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <p className="text-slate-600 text-xs sm:text-sm font-medium">Total Balance</p>
            </div>
            <p className="text-lg sm:text-2xl break-words font-bold text-violet-700">
              {(typeof lent === 'number' && typeof owed === 'number' && (owed < lent)) ? '+' : '-'}₹{Math.abs(lent - owed).toFixed(2)}
            </p>
          </div>
          <div className="bg-gradient-to-br from-rose-100 to-pink-100 p-3 sm:p-4 rounded-xl border border-rose-200/50 shadow-sm">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-rose-600 flex items-center justify-center">
                <ArrowDownIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <p className="text-slate-600 text-xs sm:text-sm font-medium">You Owe</p>
            </div>
            <p className="text-lg sm:text-2xl break-words font-bold text-rose-700">₹{owed}</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-100 to-cyan-100 p-3 sm:p-4 rounded-xl border border-emerald-200/50 shadow-sm">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-emerald-600 flex items-center justify-center">
                <ArrowUpIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <p className="text-slate-600 text-xs sm:text-sm font-medium">You Are Owed</p>
            </div>
            <p className="text-lg sm:text-2xl break-words font-bold text-emerald-700">₹{lent}</p>
          </div>
        </div>
      </div>

      {/* Lower Section */}
      <div className="bg-white rounded-2xl shadow-lg p-3 sm:p-6 border border-slate-200/50 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2 sm:gap-0">
          <div className="flex gap-1 sm:gap-2 mb-2 sm:mb-0">
            <button
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2 transition-all ${
                activeTab === "owed"
                  ? "bg-gradient-to-br from-rose-600 to-pink-600 text-white shadow-lg"
                  : "text-slate-600 hover:bg-slate-100/80"
              }`}
              onClick={() => setActiveTab("owed")}
            >
              <ArrowDownIcon className="w-4 h-4" />
              You Owe
            </button>
            <button
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2 transition-all ${
                activeTab === "owedBy"
                  ? "bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-lg"
                  : "text-slate-600 hover:bg-slate-100/80"
              }`}
              onClick={() => setActiveTab("owedBy")}
            >
              <ArrowUpIcon className="w-4 h-4" />
              You Are Owed
            </button>
          </div>
          <div className="flex gap-1 sm:gap-2 bg-slate-100/80 p-1 rounded-xl">
            <button
              className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm flex items-center gap-1 transition-all ${
                activeView === "list"
                  ? "bg-white shadow-sm text-slate-800"
                  : "text-slate-600 hover:bg-white/50"
              }`}
              onClick={() => setActiveView("list")}
            >
              <ListBulletIcon className="w-4 h-4" />
              List
            </button>
            <button
              className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm flex items-center gap-1 transition-all ${
                activeView === "chart"
                  ? "bg-white shadow-sm text-slate-800"
                  : "text-slate-600 hover:bg-white/50"
              }`}
              onClick={() => setActiveView("chart")}
            >
              <ChartBarIcon className="w-4 h-4" />
              Chart
            </button>
          </div>
        </div>

        {/* Content Area */}
        {activeView === "list" ? (
          <div className="space-y-2 sm:space-y-3">
            {(activeTab === "owed" ? owedList : lentList)?.map((item,index) => (
              <div
                key={activeTab === "owed" ? owedUsers[index]?._id : lentUsers[index]?._id}
                className="flex flex-col xs:flex-row justify-between items-start xs:items-center p-3 sm:p-4 bg-white rounded-xl hover:shadow-md transition-all border border-slate-200/50 group gap-2 xs:gap-0"
              >
                <div className="flex items-center gap-2 sm:gap-4">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shadow-sm
                    ${activeTab === "owed" ? "bg-rose-500/20" : "bg-emerald-500/20"}`}>
                    <span className={`text-base sm:text-lg font-medium ${activeTab === "owed" ? "text-rose-700" : "text-emerald-700"}`}>
                      {activeTab === "owed" ? owedUsers[index]?.name?.charAt(0) : lentUsers[index]?.name?.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-800">{item.name}</p>
                    <div className="flex gap-1 sm:gap-2 items-center mt-1">
                      {/* <p className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                        {item.group}
                      </p> */}
                      <p className="text-xs sm:text-base font-bold text-slate-500">
                        {activeTab === "owed" ? owedUsers[index]?.name : lentUsers[index]?.name}
                      </p>
                    </div>
                  </div>
                </div>
                <p
                  className={`text-base sm:text-lg font-bold ${
                    activeTab === "owed" ? "text-rose-700" : "text-emerald-700"
                  }`}
                >
                  ₹{item?.amount}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-48 sm:h-64 bg-gradient-to-br from-blue-50 to-violet-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-blue-200/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/subtle-wave.png')] opacity-20 mix-blend-multiply" />
            <div className="text-center relative z-10">
              <div className="animate-bounce mb-4">
                <ChartBarIcon className="w-10 sm:w-12 h-10 sm:h-12 text-blue-600/80 mx-auto" />
              </div>
              <p className="text-xs sm:text-sm font-medium text-blue-900/80">
                Balance distribution chart
              </p>
              <p className="text-[10px] sm:text-xs text-blue-900/50 mt-1">
                Visualizing expense patterns
              </p>
            </div>
          </div>
        )}
      </div>
    </div>

  </div>
    


    
  );
}

// Additional Icons
const WalletIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M21 6.375c0 2.692-4.03 4.875-9 4.875S3 9.067 3 6.375 7.03 1.5 12 1.5s9 2.183 9 4.875z" />
    <path d="M12 12.75c2.685 0 5.19-.586 7.078-1.609a8.283 8.283 0 001.897-1.384c.016.121.025.244.025.368C21 12.817 16.97 15 12 15s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.285 8.285 0 001.897 1.384C6.809 12.164 9.315 12.75 12 12.75z" />
    <path d="M21 15.375c0 2.692-4.03 4.875-9 4.875s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.284 8.284 0 001.897 1.384C6.809 17.664 9.315 18.25 12 18.25s5.19-.586 7.078-1.609a8.284 8.284 0 001.897-1.384c.016.121.025.244.025.368z" />
    <path d="M21 19.125c0 2.692-4.03 4.875-9 4.875s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.284 8.284 0 001.897 1.384C6.809 20.414 9.315 21 12 21s5.19-.586 7.078-1.609a8.284 8.284 0 001.897-1.384c.016.121.025.244.025.368z" />
  </svg>
);

const ArrowDownIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v13.19l5.47-5.47a.75.75 0 111.06 1.06l-6.75 6.75a.75.75 0 01-1.06 0l-6.75-6.75a.75.75 0 111.06-1.06l5.47 5.47V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
  </svg>
);

const ArrowUpIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M11.47 3.75a.75.75 0 011.06 0l6.75 6.75a.75.75 0 01-1.06 1.06L12 5.31 5.78 11.53a.75.75 0 01-1.06-1.06l6.75-6.75z" clipRule="evenodd" />
    <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v15a.75.75 0 01-1.5 0v-15a.75.75 0 01.75-.75z" clipRule="evenodd" />
  </svg>
);

// ... Keep other icons the same as original ...
const PlusIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
  
  const CurrencyDollarIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
  
  const ListBulletIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  );
  
  const ChartBarIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  );