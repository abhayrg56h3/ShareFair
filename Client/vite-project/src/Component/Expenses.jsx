import { UserSearch } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  FaPlus,
  FaHandshake,
  FaReceipt,
  FaArrowAltCircleUp,
} from "react-icons/fa";
  import Fraction from "fraction.js";
export default function Expenses({
  currUserTotalExpenses,
  emailOfPaidBy,
  currUser,
}) {
  const [expenses, setExpenses] = useState([]);
  const [shareOfCurrUser, setShareOfCurrUser] = useState([]);
  //  const [otherGuy,setOtherGuy]=useState([]);
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

  // Populate the expenses array on component mount
  useEffect(() => {
    const newExpenses = [];
    for (let i = 0; i < 50; i++) {
      newExpenses.push({
        groupId: "jadbvadfv3245324",
        groupName: "G1",
        desc: `Expense ${i + 1}`,
        amount: Math.floor(Math.random() * 1000) + 1, // Random amount between 1 and 1000
        paidBy: "uwedb34r34",
        splitType: Math.random() > 0.5 ? "equal" : "percentage",
        splits: Array.from({ length: 3 }, () => ({
          userId: "jqehbfr454",
          share: Math.floor(Math.random() * 100) + 1, // Random share between 1 and 100
        })),
        createdAt: getDate(i % 10), // Using modulo to cycle through a few months
      });
    }
    setExpenses(newExpenses);
  }, []);

  useEffect(() => {
    //  currUserTotalExpenses.map(function(expense){
    //     if(expense.splits.length==2 && expense.paidBy===currUser._id){

    //     }
    //  })
    console.log(emailOfPaidBy);
    const shareList = currUserTotalExpenses.map(function (expense) {
      const split = expense.splits.find(function (s) {
        return s.email === currUser.email;
      });
      return split.share;
    });


    setShareOfCurrUser(shareList);
  }, [currUserTotalExpenses, emailOfPaidBy]);
  function handleClick(expense) {}

  return (
    <div className="max-w-3xl mx-auto  p-4 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      {currUserTotalExpenses?.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4 text-gray-300">📭</div>
          <h2 className="text-xl text-gray-500 font-medium">
            No expenses found
          </h2>
        </div>
      ) : (
        <div className="space-y-3 ">
          {currUserTotalExpenses
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
                    onClick={() => handleClick(expense)}
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
              acc.push(
                <div
                  key={expense.desc + expense.createdAt}
                  className="group flex gap-3 p-3 bg-white rounded-md shadow-sm hover:shadow-md transition-all"
                >
                  {/* Date Badge */}
                  <div className="flex flex-col p-1 items-center justify-center w-8 h-8 md:w-12 md:h-12 bg-purple-100 rounded-md">
                    <span className="text-[8px] md:text-[10px] font-bold text-purple-600 uppercase">
                      {monthsShort[date.getMonth()]}
                    </span>
                    <span className="md:text-lg   text-sm font-bold text-purple-800">
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
                        <h3 className="!text-[12px] md:!text-[15px] font-semibold text-slate-800">
                          {expense.desc}
                        </h3>
                        <p className="text-xs  text-slate-500">
                          <span
                            className={`font-bold ${
                              expense.groupName ? "bg-blue-200" : "bg-white"
                            }  p-1 rounded-[5px] text-blue-600`}
                          >
                            {expense.groupName ? expense.groupName : ""}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <div className="flex items-center gap-1 p-1.5 bg-blue-50 rounded-md">
                        <span className="text-xs text-slate-600">
                          {expense.paidBy == currUser._id
                            ? "You paid"
                            : `${emailOfPaidBy[index]?.name} paid`}
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
                            ? "You lent"
                            : `${emailOfPaidBy[index]?.name} lent you`}
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
  ? ((1 - shareOfCurrUser[index] / 100) * expense.amount).toFixed(2)
  : ((shareOfCurrUser[index] / 100) * expense.amount).toFixed(2)}


                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
              return acc;
            }, [])}
        </div>
      )}
    </div>
  );
}
