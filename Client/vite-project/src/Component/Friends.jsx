import axios from "axios";
import React, { useState, useContext, useEffect } from "react";
import { myContext } from "./AuthContext";
import SettleUp from "./SettleUp";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import {
  FaPlus,
  FaHandshake,
  FaReceipt,
  FaArrowAltCircleUp,
} from "react-icons/fa";
import Loading from "./Loading";
export default function Friends({
  currFriendMoney,
  currUserSettledExpenses,
  setSettledExpenses,
  settledExpenses,
  showSettle,
  setShowSettle,
  friend,
  setResetDone,
  resetDone,
  owedList,
  lentList,
  setCurrFriendMoney,
}) {
  const CheckCircleIcon = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  );
  const { currUser } = useContext(myContext);
  const [expenses, setExpenses] = useState([]);
  const [shareOfCurrUser, setShareOfCurrUser] = useState([]);
  const [friendShare, setFriendShare] = useState([]);
  const [settledExpensesList, setSettledExpensesList] = useState([]);
  const [boundry, setBoundry] = useState(null);
  const [money, setMoney] = useState(null);
  const [settledLength, setSettledLength] = useState(null);
  const [unSettledLength, setUnSettledLength] = useState(null);
  const [isBoundaryFetched, setIsBoundaryFetched] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  // const {friendKey,setFriendKey,groupKey,setGroupKey}=useContext(myContext);
  const [moneyCalculated, setMoneyCalculated] = useState(false);
  const { friendDependency, setFriendDependency } = useContext(myContext);

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

  useEffect(() => {
    console.log("frienddepe", friendDependency);
    setTimeout(() => {}, 1000);
    if (friendDependency == false) {
      return;
    }
    setCurrFriendMoney(0);
    // if(owedList.length==0 && lentList.length==0){
    //   setCurrFriendMoney(0);
    // }
    console.log("Owed List", lentList);
    owedList.map(function (o) {
      if (o.email == friend.email && o.amount != 0) {
        console.log("odotamount",o.amount);
        setCurrFriendMoney(o.amount);
      }
    });
    lentList.map(function (o) {
      if (o.email == friend.email && o.amount != 0) {
        console.log(o.amount);
        setCurrFriendMoney(o.amount);
      }
    });
    setBoundry(null);
    setExpenses([]);
    setSettledLength(null);
    setUnSettledLength(null);
    setIsBoundaryFetched(false);
    setResetDone(true);
    setIsFetching(true);
    setMoneyCalculated(true);

    // console.log("wgfewyegwufyg31rugfy3urgfyurgfyug4yu2gfuy",currFriendMoney);
  }, [friend, friendDependency]);

  useEffect(() => {
    if (!resetDone) return;
    if (
      settledLength == null ||
      unSettledLength == null ||
      !isBoundaryFetched ||
      currFriendMoney == null ||
      isFetching ||
      moneyCalculated == false
    )
      //  console.log("Currfridnemonry",currFriendMoney);
      // console.log("settledLength",settledLength,"unSettledLength",unSettledLength);
      return;

    async function addBoundry() {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/settleboundry/add`,
          {
            firstUser: currUser._id,
            secondUser: friend._id,
          }
        );
      } catch (err) {
        console.log(err);
      }
    }
    console.log(
      "settledLength",
      settledLength,
      "unSettledLength",
      unSettledLength,
      currFriendMoney
    );
    if (currFriendMoney == 0 && unSettledLength > 0) {
      addBoundry();
    }
  }, [
    currUser,
    currFriendMoney,
    resetDone,
    friend,
    expenses,
    boundry,
    settledLength,
    unSettledLength,
    isBoundaryFetched,
    isFetching,
    moneyCalculated,
  ]);

  useEffect(() => {
    if (!resetDone || !moneyCalculated) return;
    console.log("wgfewyegwufyg31rugfy3urgfyurgfyug4yu2gfuy", currFriendMoney);
    setBoundry(null);
    setIsBoundaryFetched(false);
    setSettledLength(null);
    setUnSettledLength(null);
    async function fetchBoundry() {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/settleboundry/fetch`,
          {
            firstUser: currUser._id,
            secondUser: friend._id,
          }
        );
        // Even if res.data is null, we mark the fetch as complete 🚀
        setBoundry(res.data);
        console.log("boundry", res.data, friend._id);
      } catch (err) {
        console.log(err);
      } finally {
        setIsBoundaryFetched(true); // ✅ Mark fetch complete regardless of result
      }
    }
    fetchBoundry();
  }, [currUser, currFriendMoney, resetDone, friend, moneyCalculated]);

  useEffect(() => {
    if (!resetDone || !moneyCalculated) return;
    // Only fetch expenses after the boundary fetch is complete 👍
    if (!isBoundaryFetched) return;

    async function fetchData() {
      setIsFetching(true);
      try {
        // Fetch normal expenses 📥
        const expensesRes = await axios.post(
          `${import.meta.env.VITE_API_URL}/expense/fetchFriend`,
          { currUser: currUser, friend: friend }
        );

        // Filter settled expenses relevant to this friend 🔍
        const settledRes = currUserSettledExpenses.filter(
          (e) =>
            (e.who === currUser.email && e.whom === friend.email) ||
            (e.whom === currUser.email && e.who === friend.email)
        );

        // Process settled expenses and add a flag 🎉
        const settledList = settledRes.map((s) => {
          if (s.who === currUser.email) {
            return {
              who: currUser,
              whom: friend,
              amount: s.amount,
              createdAt: s.createdAt,
              settled: true,
              groupName: s.groupName,
            };
          } else {
            return {
              who: friend,
              whom: currUser,
              amount: s.amount,
              createdAt: s.createdAt,
              settled: true,
              groupName: s.groupName,
            };
          }
        });

        // Process normal expenses and add a flag 💸
        const normalExpenses = expensesRes.data.map((expense) => ({
          ...expense,
          settled: false,
        }));

        // Combine both lists into one final list 📝
        const combinedList = [...normalExpenses, ...settledList];
        setExpenses(combinedList);
        var len1 = 0;
        var len2 = 0;
        console.log("boundry", boundry, friend._id);
        if (boundry == null) {
          len1 = combinedList.length;
        } else {
          combinedList.map(function (cl) {
            if (new Date(cl.createdAt) - new Date(boundry.createdAt) > 0) {
              len1++;
            } else {
              len2++;
            }
          });
        }

        setSettledLength(len2);
        setUnSettledLength(len1);
        console.log("combined list", combinedList);
      } catch (err) {
        console.log(err);
      } finally {
        console.log("vvvvvvvvvvvvvvv");
        setIsFetching(false);
      }
    }

    fetchData();
  }, [
    isBoundaryFetched,
    moneyCalculated,
    resetDone,
    currUser,
    friend,
    currUserSettledExpenses,
  ]);

  useEffect(() => {
    if (!moneyCalculated) {
      return;
    }
    const shareList1 = expenses.map(function (expense) {
      const split = expense.splits?.find(function (s) {
        return s.email === currUser.email;
      });
      return split?.share;
    });

    shareList1.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setShareOfCurrUser(shareList1);
    const shareList2 = expenses.map(function (expense) {
      const split = expense.splits?.find(function (s) {
        return s.email === friend.email;
      });
      return split?.share;
    });
    shareList2.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setFriendShare(shareList2);
  }, [expenses, friend, moneyCalculated]);

  // Generates a date string in ISO format (MongoDB style)
  function getDate(i) {
    let date = new Date(); // Current date
    date.setMonth(date.getMonth() - i); // Subtract `i` months
    return date.toISOString();
  }
  console.log("isFetching", isFetching);
  if (isFetching || !friend) {
    return (
      <div className="max-w-3xl mx-auto bottom-0   p-4 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
        {" "}
        <Loading />
      </div>
    );
  }

  let friendIndex = 0;
  let currUserIndex = 0;
  return (
    <div className="max-w-3xl mx-auto bottom-0   p-4 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      <div className="absolute top-40 left-4 right-4 z-20">
        {showSettle && (
          <SettleUp
            currFriendMoney={currFriendMoney}
            setShowSettle={setShowSettle}
            friend={friend}
          />
        )}
      </div>
      {expenses.length === 0 && isFetching == false ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4 text-gray-300">📭</div>
          <h2 className="text-xl text-gray-500 font-medium">
            No expenses found
          </h2>
        </div>
      ) : currFriendMoney === 0 && settledExpenses == false ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4 text-gray-300">
            <CheckCircleIcon className="h-24 w-24 mx-auto text-green-500" />
          </div>
          <h2 className="text-xl underline text-gray-500 font-medium">
            You are all settled up
          </h2>
        </div>
      ) : (
        <div className="space-y-3 relative  ">
          {boundry != null &&
            expenses

              // Sort by date in descending order (most recent first)
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              // Group expenses by month & year, and inject a heading whenever the group changes
              .reduce((acc, expense, index, arr) => {
                if (new Date(expense.createdAt) < new Date(boundry.createdAt)) {
                  return acc;
                }
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
                      <h2 className="!text-[20px] font-semibold text-slate-800 border-l-4 border-purple-600 pl-2">
                        {month} {year}
                      </h2>
                    </div>
                  );
                }

                // Expense item

                if (expense.settled == true) {
                  index--;
                  acc.push(
                    <div
                      key={expense.createdAt}
                      className="group flex  gap-3 p-3 bg-white rounded-md shadow-sm hover:shadow-md transition-all"
                    >
                      {/* Date Badge */}
                      <div className="flex flex-col items-center justify-center w-12 h-12 bg-purple-100 rounded-md">
                        <span className="text-xs font-bold text-purple-600 uppercase">
                          {monthsShort[date.getMonth()]}
                        </span>
                        <span className="text-lg font-bold text-purple-800">
                          {date.getDate()}
                        </span>
                      </div>

                      {/* Expense Details */}

                      <div className="flex-grow">
                        <div
                          className={`flex items-center gap-3 p-3 ${
                            expense.who.email === currUser.email
                              ? "bg-green-50 border-green-100 hover:bg-green-100"
                              : "bg-orange-50 border-orange-100 hover:bg-orange-100"
                          } rounded-lg border transition-colors`}
                        >
                          <div
                            className={`p-2 ${
                              expense.who.email === currUser.email
                                ? "bg-green-100 text-green-600"
                                : "bg-orange-100 text-orange-600"
                            } rounded-full`}
                          >
                            {expense.who.email === currUser.email ? (
                              <FaArrowUp className="text-lg" />
                            ) : (
                              <FaArrowDown className="text-lg" />
                            )}
                          </div>
                       
                          <div className="flex-1">
                            <div className="flex items-baseline gap-2">
                              <span
                                className={`font-semibold ${
                                  expense.who.email === currUser.email
                                    ? "text-green-800"
                                    : "text-orange-800"
                                }`}
                              >
                                {expense.who.name}
                              </span>
                              <span className="text-gray-500">paid</span>
                              <span className="font-semibold text-purple-800">
                                {expense.whom.name}
                              </span>
                            </div>
                            <div className="mt-1 flex items-center justify-between">

                              
                            <div className="flex items-center space-x-4"> <span className="text-sm text-gray-500">
                                {expense.who.email !== currUser.email
                                  ? "You received"
                                  : "You paid"}
                              </span>
                              {expense.groupName && <span className={expense.who.email===currUser.email?'bg-green-300 text-green-700 text-[13px] rounded-[2px] p-0.5 font-bold':'text-[13px] rounded-[2px] p-0.5 font-bold bg-orange-300 text-orange-700' }>in {expense.groupName}</span>} </div>
                              <span
                                className={`text-lg font-bold ${
                                  expense.who.email === currUser.email
                                    ? "text-green-600"
                                    : "text-orange-600"
                                }`}
                              >
                                ₹{expense.amount.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                } else {
                  acc.push(
                    <div
                      key={expense.desc + expense.createdAt}
                      className="group flex gap-3 p-1 h-[80px]  bg-white rounded-md shadow-sm hover:shadow-md transition-all"
                    >
                      {/* Date Badge */}
                      <div className="flex flex-col items-center justify-center w-12 h-12 bg-purple-100 rounded-md">
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
                            <h3 className="!text-[16px] font-semibold text-slate-800">
                              {expense.groupId
                                ? expense.groupName
                                : expense.desc}
                            </h3>
                          </div>
                        </div>

                        {!expense.groupName ? (
                          <div className="flex gap-2">
                            <div className="flex items-center gap-1 p-1.5 h-[30px] bg-blue-50 rounded-md">
                              <span className="text-[10px]  text-slate-600">
                                {expense.paidBy == currUser._id
                                  ? "You paid"
                                  : `${friend?.name} paid`}
                              </span>
                              <span className="text-[10px] font-bold text-blue-600">
                                ₹{expense.amount.toFixed(2)}
                              </span>
                            </div>
                            <div
                              className={`flex items-center h-[30px] gap-1 p-1.5 ${
                                expense.paidBy == currUser._id
                                  ? "bg-emerald-50"
                                  : "bg-red-100"
                              }  rounded-md`}
                            >
                              <span className="text-[10px] text-slate-600">
                                {expense.paidBy == currUser._id
                                  ? `${friend.name} owes you`
                                  : `you owe ${friend.name}`}
                              </span>
                              <span
                                className={`text-[10px] font-bold ${
                                  expense.paidBy == currUser._id
                                    ? "text-emerald-600"
                                    : "text-red-500"
                                } `}
                              >
                                ₹
                                {expense.paidBy == currUser._id
                                  ? (
                                      (friendShare[friendIndex++] / 100) *
                                      expense.amount
                                    ).toFixed(2)
                                  : (
                                      (shareOfCurrUser[currUserIndex++] / 100) *
                                      expense.amount
                                    ).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <div
                              className={`flex items-center gap-1 p-1.5 ${
                                expense.paidBy == currUser._id
                                  ? "bg-emerald-50"
                                  : "bg-red-100"
                              }  rounded-md`}
                            >
                              <span className="text-xs text-slate-600">
                                {expense.paidBy == currUser._id
                                  ? `${friend.name} owes you`
                                  : `you owe ${friend.name}`}
                              </span>
                              <span
                                className={`text-sm font-bold ${
                                  expense.paidBy == currUser._id
                                    ? "text-emerald-600"
                                    : "text-red-500"
                                } `}
                              >
                                ₹
                                {expense.paidBy == currUser._id
                                  ? (
                                      (friendShare[friendIndex++] / 100) *
                                      expense.amount
                                    ).toFixed(2)
                                  : (
                                      (shareOfCurrUser[currUserIndex++] / 100) *
                                      expense.amount
                                    ).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }

                return acc;
              }, [])}

          {(boundry == null || settledExpenses) &&
            expenses

              // Sort by date in descending order (most recent first)
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              // Group expenses by month & year, and inject a heading whenever the group changes
              .reduce((acc, expense, index, arr) => {
                if (
                  boundry != null &&
                  new Date(expense.createdAt) > new Date(boundry.createdAt)
                ) {
                  return acc;
                }
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

                if (expense.settled == true) {
                  index--;
                  console.log(index);
                  acc.push(
                    <div
                      key={expense.createdAt}
                      className="group flex gap-3 p-3 bg-white rounded-md shadow-sm hover:shadow-md transition-all"
                    >
                      {/* Date Badge */}
                      <div className="flex flex-col items-center justify-center w-12 h-12 bg-purple-100 rounded-md">
                        <span className="text-xs font-bold text-purple-600 uppercase">
                          {monthsShort[date.getMonth()]}
                        </span>
                        <span className="text-lg font-bold text-purple-800">
                          {date.getDate()}
                        </span>
                      </div>

                      {/* Expense Details */}

                      <div className="flex-grow">
                        <div
                          className={`flex items-center gap-3 p-3 ${
                            expense.who.email === currUser.email
                              ? "bg-green-50 border-green-100 hover:bg-green-100"
                              : "bg-orange-50 border-orange-100 hover:bg-orange-100"
                          } rounded-lg border transition-colors`}
                        >
                          <div
                            className={`p-2 ${
                              expense.who.email === currUser.email
                                ? "bg-green-100 text-green-600"
                                : "bg-orange-100 text-orange-600"
                            } rounded-full`}
                          >
                            {expense.who.email === currUser.email ? (
                              <FaArrowUp className="text-lg" />
                            ) : (
                              <FaArrowDown className="text-lg" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-baseline gap-2">
                              <span
                                className={`font-semibold ${
                                  expense.who.email === currUser.email
                                    ? "text-green-800"
                                    : "text-orange-800"
                                }`}
                              >
                                {expense.who.name}
                              </span>
                              <span className="text-gray-500">paid</span>
                              <span className="font-semibold text-purple-800">
                                {expense.whom.name}
                              </span>
                             
                            </div>
                            <div className="mt-1 flex items-center justify-between">
                                 <div className="flex items-center space-x-4"> <span className="text-sm text-gray-500">
                                {expense.who.email !== currUser.email
                                  ? "You received"
                                  : "You paid"}
                              </span>
                              {expense.groupName && <span className={expense.who.email===currUser.email?'bg-green-300 text-green-700 text-[13px] rounded-[2px] p-0.5 font-bold':'text-[13px] rounded-[2px] p-0.5 font-bold bg-orange-300 text-orange-700' }>in {expense.groupName}</span>} </div>
                              
                                    
                              <span
                                className={`text-lg font-bold ${
                                  expense.who.email === currUser.email
                                    ? "text-green-600"
                                    : "text-orange-600"
                                }`}
                              >
                                ₹{expense.amount.toFixed(2)}
                              </span>
                              
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                } else {
                  acc.push(
                    <div
                      key={expense.desc + expense.createdAt}
                      className="group flex gap-3 p-3 bg-white rounded-md shadow-sm hover:shadow-md transition-all"
                    >
                      {/* Date Badge */}
                      <div className="flex flex-col items-center justify-center w-12 h-12 bg-purple-100 rounded-md">
                        <span className="text-xs font-bold text-purple-600 uppercase">
                          {monthsShort[date.getMonth()]}
                        </span>
                        <span className="text-lg font-bold text-purple-800">
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
                            <h3 className="text-base font-semibold text-slate-800">
                              {expense.groupId
                                ? expense.groupName
                                : expense.desc}
                            </h3>
                          </div>
                        </div>

                        {!expense.groupName ? (
                          <div className="flex gap-2">
                            <div className="flex items-center gap-1 p-1.5 bg-blue-50 rounded-md">
                              <span className="text-xs text-slate-600">
                                {expense.paidBy == currUser._id
                                  ? "You paid"
                                  : `${friend?.name} paid`}
                              </span>
                              <span className="text-sm font-bold text-blue-600">
                                ₹{expense.amount.toFixed(2)}
                              </span>
                            </div>
                            <div
                              className={`flex items-center gap-1 p-1.5 ${
                                expense.paidBy == currUser._id
                                  ? "bg-emerald-50"
                                  : "bg-red-100"
                              }  rounded-md`}
                            >
                              <span className="text-xs text-slate-600">
                                {expense.paidBy == currUser._id
                                  ? `${friend.name} owes you`
                                  : `you owe ${friend.name}`}
                              </span>
                              <span
                                className={`text-sm font-bold ${
                                  expense.paidBy == currUser._id
                                    ? "text-emerald-600"
                                    : "text-red-500"
                                } `}
                              >
                                ₹
                                {expense.paidBy == currUser._id
                                  ? (
                                      (friendShare[friendIndex++] / 100) *
                                      expense.amount
                                    ).toFixed(2)
                                  : (
                                      (shareOfCurrUser[currUserIndex++] / 100) *
                                      expense.amount
                                    ).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <div
                              className={`flex items-center gap-1 p-1.5 ${
                                expense.paidBy == currUser._id
                                  ? "bg-emerald-50"
                                  : "bg-red-100"
                              }  rounded-md`}
                            >
                              <span className="text-xs text-slate-600">
                                {expense.paidBy == currUser._id
                                  ? `${friend.name} owes you`
                                  : `you owe ${friend.name}`}
                              </span>
                              <span
                                className={`text-sm font-bold ${
                                  expense.paidBy == currUser._id
                                    ? "text-emerald-600"
                                    : "text-red-500"
                                } `}
                              >
                                ₹
                                {expense.paidBy == currUser._id
                                  ? (
                                      (friendShare[friendIndex++] / 100) *
                                      expense.amount
                                    ).toFixed(2)
                                  : (
                                      (shareOfCurrUser[currUserIndex++] / 100) *
                                      expense.amount
                                    ).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        )}
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
