import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { myContext } from "./AuthContext";
import {
  User,
  Mail,
  Globe,
  MapPin,
  Clock,
  Heart,
  BookOpen,
  Settings,
  Upload,
  Users,Plus,ChevronDown,Briefcase,Home,Coffee, Percent ,
  Moon,
  Sun,
  Lock,
  LogOut,
  Download,
  Trash2,
  Edit3,
  Camera,
  ChevronRight,
  Bell,
  Shield,
  Eye,
  Smartphone,
  Check,
  X,
  AlertTriangle,
  Save,
  RefreshCw,
  Calendar,
  TrendingUp,
  BarChart3,
  Filter,
  FileText,
} from "lucide-react";
import Fraction from 'fraction.js';
export default function CreateGroup() {
  // ... [keep all existing logic the same] ...
  const [file, setFile] = useState("");
  const [fileToShow, setFileToShow] = useState("");
  const [drop, setDrop] = useState(false);
  const dropRef = useRef(null);
  const ddropRef = useRef(null);
  const [groupName, setGroupName] = useState("");
  const [total, setTotal] = useState(100);
  const navigate = useNavigate();
  const [groupType, setGroupType] = useState(null);
  const [members, setMembers] = useState([]);
  const { currUser ,lightMode } = useContext(myContext);
  const [showSuccessMessage, setShowSuccessMessage] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState("");
  const [saving, setSaving] = useState(false);
  // Handle file upload and preview 📸
  function handleChange(e) {
    const newFile = e.target.files[0];
    if (newFile) {
      setFileToShow(URL.createObjectURL(newFile));
    }
    setFile(e.target.files[0]);
  }


   const showSuccess = (message) => {
    setShowSuccessMessage(message);
    setShowErrorMessage("");
    setTimeout(() => setShowSuccessMessage(""), 3000);
  };

  // Error message helper
  const showError = (message) => {
    setShowErrorMessage(message);
    setShowSuccessMessage("");
    setTimeout(() => setShowErrorMessage(""), 3000);
  };



  function handleChangeInShare(index, e) {
    e.preventDefault();
    const newShare = Number(e.target.value);
    var t = 0;
    const updatedMembers = members.map(function (m, i) {
      if (i == index) {
        t += newShare;
        return { ...m, share: newShare };
      } else {
        t += m.share;
        return m;
      }
    });

    setTotal(t);

    setMembers(updatedMembers);
  }

  async function handleSave() {
    setSaving(true);
    if (total != 100) {
      showError("Total share must be 100%");
      setSaving(false);
      return;
    }
    if(members.length === 0) {
      showError("Please add at least one member");
      
      setSaving(false);
      return;
    }
    if (!groupName) {
      showError("Missing group name");
      setSaving(false);
      return;
    }

    try {
      const data = new FormData();
      data.append("groupPicture", file);
      data.append("name", groupName);
      data.append("type", groupType);
      data.append("members", JSON.stringify(members));
      data.append("createdBy", currUser.name);
      data.append("createdByEmail", currUser.email);

      // // Debug: log all entries in FormData
      // for (let [key, value] of data.entries()) {
      //   console.log(key, value);
      // }








      await Promise.all(
        members.map(async function (member, index) {
          members.map(async function (m, i) {
            if (i > index) {
              const res = await axios.post(`${import.meta.env.VITE_API_URL}/user/addFriendByEmail/${member.email}`, { email: m.email });
              return res;
            }
          })



        })



      )




      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/group/create`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log(response.data.status);
      setSaving(false);
      setGroupName("");
      setMembers([]);
      setFile("");
      showSuccess("Group Created Successfully!");
    } catch (err) {
      console.error("Error creating group", err);
       setSaving(false);
       showError("Failed to create group. Please try again.");
    }
  }


  function handleChangee(e, index) {
    const updatedMembers = members.map(function (m, i) {
      if (i == index) {
        return { ...m, [e.target.name]: e.target.value };
      } else {
        return m;
      }
    });

    setMembers(updatedMembers);
  }

  function handleAdd() {
    const sz = members.length + 1; // New size after adding a member
    const newShareValue = 100 / sz;

    // Update all existing members' share equally
    const updatedMembers = members.map((member) => ({
      ...member,
      share: newShareValue,
    }));

    // Add a new member with the same share
    updatedMembers.push({
      email: "",
      share: newShareValue,
    });

    setMembers(updatedMembers);

    // Update share state properly
    // setShare(updatedMembers.map(member => member.share));
  }

  function  handleRemove(index) {
    if (members.length <= 1) return; // Prevent removing the last member
    const updatedMembers = members.filter((_, i) => i !== index);
    
    // Recalculate shares to maintain total of 100%
    const newShareValue = 100 / updatedMembers.length;
    const recalculatedMembers = updatedMembers.map(member => ({
      ...member,
      share: newShareValue
    }));

    setMembers(recalculatedMembers);
  }

  useEffect(() => {
    function handleDown(e) {
      if (
        dropRef.current &&
        ddropRef.current &&
        !dropRef.current.contains(e.target) &&
        !ddropRef.current.contains(e.target)
      ) {
        setDrop(false);
      }
    }
    document.addEventListener("mousedown", handleDown);
    return () => document.removeEventListener("mousedown", handleDown);
  }, []);

  return (
<div className={`min-h-screen transition-all duration-300 ${lightMode 
  ? 'bg-gradient-to-tr from-sky-100 via-rose-50 to-teal-100' 
  : 'bg-gradient-to-br from-gray-900 via-slate-900 to-black'
} py-8 px-4 sm:px-6`}>

  <div className="max-w-6xl mt-24 mx-auto space-y-6">
    {/* Header */}
    <div className="text-center space-y-2">
      <h1 className={`text-4xl sm:text-5xl font-black bg-gradient-to-r ${
        lightMode 
          ? 'from-red-600 via-purple-600 to-rose-500' 
          : 'from-cyan-400 via-purple-400 to-rose-400'
      } bg-clip-text text-transparent leading-tight`}>
        Assemble Your Crew
      </h1>
      <p className={`text-md sm:text-lg font-normal ${
        lightMode ? 'text-slate-600' : 'text-slate-400'
      }`}>
        Create a group to share expenses and stay organized.
      </p>
    </div>

    {/* --- Success & Error Messages (No style changes needed, they are already great) --- */}
    {/* Success Message */}
    {showSuccessMessage && (
      <div className="fixed top-5 right-5 max-w-sm w-full bg-gradient-to-r from-emerald-500 to-green-500 text-white px-5 py-3 rounded-xl shadow-2xl z-50 flex items-center backdrop-blur-sm border border-white/20 transform animate-bounce">
        <div className="w-8 h-8 mr-3 bg-white/30 rounded-full flex items-center justify-center flex-shrink-0"><Check className="w-5 h-5" /></div>
        <span className="font-semibold text-sm">{showSuccessMessage}</span>
      </div>
    )}

    {/* Error Message */}
    {showErrorMessage && (
      <div className="fixed top-5 right-5 max-w-sm w-full bg-gradient-to-r from-red-500 to-rose-500 text-white px-5 py-3 rounded-xl shadow-2xl z-50 flex items-center backdrop-blur-sm border border-white/20 transform animate-bounce">
        <div className="w-8 h-8 mr-3 bg-white/30 rounded-full flex items-center justify-center flex-shrink-0"><AlertTriangle className="w-5 h-5" /></div>
        <span className="font-semibold text-sm">{showErrorMessage}</span>
      </div>
    )}

    {/* Main Form Container */}
    <div className={`${
      lightMode 
        ? 'bg-white/70 backdrop-blur-xl shadow-2xl border border-white/50' 
        : 'bg-slate-800/60 backdrop-blur-xl shadow-2xl border border-slate-700/50'
    } rounded-2xl p-6 sm:p-8 transition-all duration-300`}>
      
      {/* Group Identity Section - More Horizontal */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-center mb-8">
        
        {/* Avatar Upload */}
        <div className="flex flex-col items-center justify-center space-y-2 lg:col-span-1">
          <label className="group relative w-28 h-28 rounded-full border-4 border-white dark:border-slate-600 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105">
            <img
              src={fileToShow || "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=150&h=150&fit=crop&crop=faces"}
              alt="Group Icon"
              className="w-full h-full object-cover rounded-full"
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full">
              <Upload className="w-7 h-7 text-white drop-shadow-lg" />
            </div>
            <input type="file" onChange={handleChange} className="hidden" accept="image/*" />
          </label>
        </div>

        {/* Group Name & Type Inputs */}
        <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Group Name Input */}
            <div className="space-y-2">
              <label className={`block text-xs font-bold ${lightMode ? 'text-slate-700' : 'text-slate-300'} uppercase tracking-wider`}>Group Name</label>
              <input
                type="text"
                value={groupName}
                placeholder="The Avengers..."
                className={`w-full px-4 py-3 rounded-lg border-2 ${
                  lightMode 
                    ? 'border-slate-200 bg-white/80 text-slate-900 placeholder-slate-400 focus:border-cyan-500' 
                    : 'border-slate-600 bg-slate-700/50 text-white placeholder-slate-400 focus:border-cyan-400'
                } focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 font-medium text-base`}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </div>

            {/* Group Type Dropdown */}
            <div className="space-y-2">
              <label className={`block text-xs font-bold ${lightMode ? 'text-slate-700' : 'text-slate-300'} uppercase tracking-wider`}>Group Type</label>
              <div className="relative" ref={ddropRef}>
                <button onClick={() => setDrop(!drop)} className={`w-full px-4 py-3 text-left ${
                    lightMode 
                      ? 'bg-white/80 border-slate-200 hover:border-slate-300 text-slate-800' 
                      : 'bg-slate-700/50 border-slate-600 hover:border-slate-500 text-white'
                  } rounded-lg border-2 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 flex justify-between items-center font-medium text-base`} >
                  <span className={groupType ? '' : lightMode ? 'text-slate-400' : 'text-slate-400'}>
                    {groupType || "Select a type"}
                  </span>
                  <ChevronDown className={`w-5 h-5 ${lightMode ? 'text-slate-500' : 'text-slate-400'} transform transition-transform duration-300 ${drop ? "rotate-180" : ""}`} />
                </button>
                {drop && (
                  <div ref={dropRef} className={`absolute top-full mt-2 z-20 w-full ${lightMode ? 'bg-white/90 border-slate-200 shadow-xl' : 'bg-slate-800/90 border-slate-700 shadow-2xl'} rounded-lg border backdrop-blur-md overflow-hidden animate-in fade-in-5 zoom-in-95`}>
                    <ul className="py-1">
                      {[{ name: 'Trip', icon: Briefcase }, { name: 'Home', icon: Home }, { name: 'Event', icon: Users }, { name: 'Other', icon: Coffee }].map((type) => {
                        const IconComponent = type.icon;
                        return (
                          <li key={type.name} className={`px-4 py-2 ${lightMode ? 'hover:bg-purple-50 text-slate-700 hover:text-purple-700' : 'hover:bg-slate-700 text-slate-300 hover:text-purple-400'} cursor-pointer transition-colors duration-200 flex items-center gap-3 font-medium`} onClick={() => { setGroupType(type.name); setDrop(false); }}>
                            <IconComponent className="w-5 h-5" />
                            {type.name}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            </div>
        </div>
      </div>

      {/* Members Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className={`text-xl font-bold ${lightMode ? 'text-slate-800' : 'text-white'} flex items-center gap-2`}>
            <Users className="w-6 h-6" />
            Members & Shares
          </h3>
          <button onClick={handleAdd} className={`flex items-center space-x-2 ${lightMode ? 'text-purple-600 hover:text-purple-800 bg-purple-50 hover:bg-purple-100' : 'text-purple-400 hover:text-purple-300 bg-purple-900/30 hover:bg-purple-900/50'} px-3 py-1.5 rounded-lg transition-all duration-300 font-semibold text-sm border-2 border-transparent hover:border-current`}>
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>

        {/* Members Grid - Compact */}
        <div className="space-y-2">
          {members.map((m, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 items-center">
              {/* Name & Email Inputs */}
              <div className="col-span-12 sm:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-2">
                 
                  <div className="relative">
                    <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${lightMode ? 'text-slate-400' : 'text-slate-500'}`} />
                    <input type="email" placeholder="member@email.com" name="email" value={m.email} className={`w-full pl-9 pr-3 py-2 rounded-md border ${lightMode ? 'border-slate-200 bg-slate-50/70 text-slate-800' : 'border-slate-600 bg-slate-700/50 text-white'} focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition font-medium`} onChange={(e) => handleChangee(e, index)} />
                  </div>
              </div>
              {/* Share Input */}
              <div className="col-span-8 sm:col-span-3">
                  <div className="relative">
                    <input type="number" min="0" max="100" onChange={(e) => handleChangeInShare(index, e)} value={m.share} className={`w-full px-3 py-2 rounded-md border ${lightMode ? 'border-slate-200 bg-slate-50/70 text-slate-800' : 'border-slate-600 bg-slate-700/50 text-white'} focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition font-bold text-center appearance-none`} />
                    <Percent className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 ${lightMode ? 'text-slate-400' : 'text-slate-500'}`} />
                  </div>
              </div>
              {/* Remove Button */}
              <div className="col-span-4 sm:col-span-1 flex justify-end">
                {members.length > 1 && (
                  <button onClick={() => handleRemove(index)} className={`p-2 rounded-md transition-colors duration-300 ${lightMode ? 'text-slate-400 hover:bg-red-100 hover:text-red-600' : 'text-slate-500 hover:bg-red-900/40 hover:text-red-400'}`}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Total Summary - Sleek & Clean */}
        <div className={`flex justify-between items-center px-4 py-2 rounded-lg mt-2 transition-all duration-300 border-2 ${
            total === 100 
              ? (lightMode ? 'bg-green-50 border-green-300' : 'bg-green-900/20 border-green-500/30')
              : total > 100 
              ? (lightMode ? 'bg-red-50 border-red-300' : 'bg-red-900/20 border-red-500/30')
              : (lightMode ? 'bg-slate-100 border-slate-200' : 'bg-slate-700/50 border-slate-600')
          }`}>
          <div className={`font-bold text-md ${
            total === 100 ? (lightMode ? 'text-green-700' : 'text-green-400') :
            total > 100 ? (lightMode ? 'text-red-700' : 'text-red-400') :
            (lightMode ? 'text-slate-600' : 'text-slate-300')
          }`}>
            Total: <span className="text-lg">{total}%</span>
          </div>
          <div className={`font-medium text-sm ${
            100 - total === 0 ? (lightMode ? 'text-green-600' : 'text-green-400') : 
            100 - total < 0 ? (lightMode ? 'text-red-600' : 'text-red-400') : 
            (lightMode ? 'text-orange-600' : 'text-orange-400')
          }`}>
            {100 - total >= 0 ? `Remaining: ${100 - total}%` : `Over by: ${Math.abs(100 - total)}%`}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-8 ">
        <button
          className={`w-full !rounded-sm  py-3 px-6  ${
            lightMode 
              ? 'bg-teal-400 hover:shadow-lg' 
              : 'bg-teal-400 hover:shadow-lg'
          } text-white font-bold text-lg rounded-xl transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
          onClick={handleSave}
          disabled={saving || total !== 100}
        >
          <span className="flex items-center justify-center gap-3">
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                Creating Group...
              </>
            ) : (
              <>
                <Plus className="w-6 h-6" />
                Create Group ({members.length} Members)
              </>
            )}
          </span>
        </button>
      </div>
    </div>
  </div>
</div>
  );
}
