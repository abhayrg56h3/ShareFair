import React, { useContext, useEffect, useRef, useState } from "react";
import { myContext } from "./AuthContext";
import CloseIcon from "@mui/icons-material/Close";
import { CalendarIcon, ChevronDown } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddExpense({
  setShare,
  wit,
  type,
  show,
  setShow,
  members,
  setMembers,

}) {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [image, setImage] = useState(null);
  const { currUser } = useContext(myContext);
  const fileRef = useRef(null);
  const groupRef = useRef(null);
  const groupRef2 = useRef(null);
  const navigate=useNavigate();
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState();
  const [category, setCategory] = useState("0");
  const {friendKey,friendDependency,lightMode,setFriendDependency,dashBoard,setDashBoard,setFriend,setFriendKey,groupKey,setGroupKey,currFriend,setCurrFriend}=useContext(myContext);
  var categories = [];

  {
    type == "Group"
      ? (categories = [
          { value: "0", label: "Default Shares" },
          { value: "1", label: "Equally" },
          { value: "2", label: "Percentage" },
        ])
      : (categories = [
          { value: "1", label: "Equally" },
          { value: "2", label: "Percentage" },
        ]);
  }

  async function handleSubmit() {
    const data = new FormData();

    data.append("image", image);
    data.append("amount", amount);
    data.append("desc", desc);
    data.append("paidBy", currUser._id);
    if (type == "Group") {
      data.append("groupId", wit._id);
      data.append("groupName", wit.name);
    }

    let splits = [];

    if (type == "Group") {
      for (var i = 0; i < wit.members.length; i++) {
        splits.push({
          email: wit.members[i].email,
          share: members[i],
        });
      }
    } else {
      splits.push({
        email: currUser.email,
        share: members[0],
      });
      splits.push({
        email: wit.email,
        share: members[1],
      });
    }

    data.append("splits", JSON.stringify(splits));
  

    //  for (let [key, value] of data.entries()) {
    //   console.log(key, value);
    // }

      

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/expense/add`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (response.status == 200) {
        console.log(response.status);
        setShow(false);
        try {
          const friendString = safeStringify(currFriend || {});
          const groupString = safeStringify(currGroup || {});
          sessionStorage.setItem("currFriend", friendString);
          sessionStorage.setItem("currGroup", groupString);
          console.log("Session storage updated");
        } catch (error) {
          console.error("Error saving to sessionStorage:", error);
        }
  
        // Force a full page reload
         setFriendKey(friendKey+1);
         setFriendDependency(false);


        setGroupKey(groupKey+1);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (category == 1) {
      const newMembers = members.map(function (m) {
        return 100 / members.length;
      });
      setMembers(newMembers);
    } else if (category == 0 && type == "Group") {
      const newMembers = wit?.members?.map(function (m) {
        return m.share;
      });
      setMembers(newMembers);
    }
  }, [category]);

  function handleFileUpload() {
    fileRef.current.click();
  }

  useEffect(() => {
    if (category == "1" || category == "0") {
      setShare(false);
    } else {
      setShare(true);
    }
  }, [category]);

  return (
   <div className={`bg-transparent flex items-center justify-center`}>
  <div className={`${lightMode ? 'bg-white' : 'bg-gray-800'} rounded-2xl shadow-xl w-full max-w-md p-6 relative border ${lightMode ? 'border-gray-100' : 'border-gray-700'}`}>
    {/* Subtle gradient accent */}
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-t-2xl"></div>
    
    {/* Header */}
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-3">
        <h1 className={`text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
          Add an Expense
        </h1>
        
      </div>
      <CloseIcon
        onClick={() => setShow(false)}
        className={`${lightMode ? 'text-gray-500 hover:text-red-500' : 'text-gray-400 hover:text-red-400'} cursor-pointer transition-colors`}
      />
    </div>

    {/* Group Selector */}
    <div className="mb-6">
      <p className={`${lightMode ? 'text-gray-600' : 'text-gray-300'} text-sm`}>
        With you and{" "}
        <span className={`inline-block ${lightMode ? 'bg-amber-100 text-amber-800' : 'bg-amber-900/50 text-amber-200'} rounded-full px-3 py-1 mx-2 text-sm font-medium`}>
          {type == "Group"
            ? `All of ${wit.name}`
            : type == "Friend"
            ? wit.name
            : ownWit
            ? ownWit
            : ""}
        </span>
      </p>
    </div>

    {/* Main Form */}
    <div className="space-y-6">
      {/* Amount & Description */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <img
            src="https://s3.amazonaws.com/splitwise/uploads/category/icon/square_v2/uncategorized/general@2x.png"
            alt="expense-icon"
            className={`w-12 h-12 rounded-xl ${lightMode ? 'bg-blue-50' : 'bg-blue-900/30'} p-2 shadow-sm`}
          />
        </div>
        <div className="flex-1 space-y-3">
          <input
            type="text"
            placeholder="Enter description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition-all duration-200 placeholder:text-gray-400 ${
              lightMode 
                ? 'border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-white text-gray-700' 
                : 'border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-900/50 bg-gray-700 text-gray-100'
            }`}
          />
          <div className="relative">
            <span className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-lg font-bold ${lightMode ? 'text-green-600' : 'text-green-400'}`}>₹</span>
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border-2 rounded-lg focus:outline-none transition-all duration-200 placeholder:text-gray-400 text-lg font-semibold ${
                lightMode 
                  ? 'border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-100 bg-white text-green-600' 
                  : 'border-gray-600 focus:border-green-500 focus:ring-2 focus:ring-green-900/50 bg-gray-700 text-green-400'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Category Selector */}
      <div>
        <label className={`block text-sm font-medium mb-2 ${lightMode ? 'text-gray-700' : 'text-gray-300'}`}>
          Split Type
        </label>
        <div className="relative">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition-all duration-200 appearance-none cursor-pointer ${
              lightMode 
                ? 'border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 bg-white text-gray-700' 
                : 'border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-900/50 bg-gray-700 text-gray-100'
            }`}
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
          <svg className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none ${lightMode ? 'text-purple-400' : 'text-purple-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>

      {/* Date & Image Section */}
      <div className="flex items-end gap-4">
        <div className="flex-1">
          <input
            type="date"
            className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition-all duration-200 ${
              lightMode 
                ? 'border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-white text-gray-700' 
                : 'border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-900/50 bg-gray-700 text-gray-100'
            }`}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <button className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 font-medium ${
          lightMode 
            ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200' 
            : 'bg-red-900/30 text-red-400 hover:bg-red-900/50 border border-red-800'
        }`}>
          <input
            ref={fileRef}
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            className="hidden"
          />
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
          </svg>
          <span onClick={handleFileUpload} className="text-sm">Add images</span>
        </button>
      </div>
    </div>

    {/* Action Buttons */}
    <div className="mt-8 flex justify-end gap-4">
      <button
        onClick={() => setShow(false)}
        className={`px-6 py-2 rounded-lg transition-all duration-200 font-medium ${
          lightMode 
            ? 'text-gray-600 hover:bg-gray-100' 
            : 'text-gray-300 hover:bg-gray-700'
        }`}
      >
        Cancel
      </button>
      <button
        onClick={handleSubmit}
        className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
      >
        Save Expense
      </button>
    </div>
  </div>
</div>
  );
}
