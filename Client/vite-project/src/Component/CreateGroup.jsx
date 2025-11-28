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
  Users,
  Plus,
  ChevronDown,
  Briefcase,
  Home,
  Coffee,
  Percent,
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
  Sparkles,
  PieChart
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
  const { currUser, lightMode } = useContext(myContext);
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
    if (members.length === 0) {
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
  }

  function handleRemove(index) {
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
    <div className={`min-h-screen transition-all duration-500 font-sans ${
      lightMode 
        ? 'bg-[#F3F4F6] text-gray-900' 
        : 'bg-[#0f172a] text-gray-100'
    }`}>
      {/* Decorative Background Elements */}
      <div className={`fixed inset-0 pointer-events-none overflow-hidden ${lightMode ? 'opacity-40' : 'opacity-20'}`}>
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-purple-400 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-cyan-400 blur-[120px]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-20">
        
        {/* --- Header --- */}
        <div className="text-center space-y-4 mb-12">
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium border ${
            lightMode ? 'bg-white/50 border-gray-200 text-purple-600' : 'bg-gray-800/50 border-gray-700 text-purple-400'
          }`}>
            <Sparkles className="w-4 h-4" />
            <span>Create New Workspace</span>
          </div>
          <h1 className={`text-4xl md:text-6xl font-black tracking-tight ${
            lightMode ? 'text-gray-900' : 'text-white'
          }`}>
            Assemble Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-cyan-500">Squad</span>
          </h1>
          <p className={`text-lg max-w-xl mx-auto ${
            lightMode ? 'text-gray-500' : 'text-gray-400'
          }`}>
            Effortless expense tracking starts here. Set up your group, invite friends, and split costs in seconds.
          </p>
        </div>

        {/* --- Success & Error Toasts --- */}
        <div className="fixed top-6 right-6 z-50 flex flex-col gap-2">
          {showSuccessMessage && (
            <div className="animate-in slide-in-from-right fade-in duration-300 bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-xl shadow-emerald-500/20 flex items-center gap-3 backdrop-blur-md border border-white/20">
              <div className="p-1 bg-white/20 rounded-full"><Check className="w-4 h-4" /></div>
              <span className="font-semibold">{showSuccessMessage}</span>
            </div>
          )}
          {showErrorMessage && (
            <div className="animate-in slide-in-from-right fade-in duration-300 bg-rose-500 text-white px-6 py-4 rounded-2xl shadow-xl shadow-rose-500/20 flex items-center gap-3 backdrop-blur-md border border-white/20">
              <div className="p-1 bg-white/20 rounded-full"><AlertTriangle className="w-4 h-4" /></div>
              <span className="font-semibold">{showErrorMessage}</span>
            </div>
          )}
        </div>

        {/* --- Main Card --- */}
        <div className={`relative rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 ${
          lightMode 
            ? 'bg-white/80 border border-white/60 shadow-purple-500/5' 
            : 'bg-gray-900/60 border border-gray-800 shadow-black/50'
        } backdrop-blur-xl`}>
          
          <div className="p-6 md:p-10 space-y-10">
            
            {/* Top Section: Photo + Basic Info */}
            <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
              
              {/* Photo Upload */}
              <div className="flex-shrink-0 relative group">
                <div className={`w-32 h-32 rounded-3xl overflow-hidden border-4 transition-all duration-300 shadow-lg ${
                  lightMode ? 'border-white shadow-gray-200' : 'border-gray-800 shadow-black'
                }`}>
                  <img
                    src={fileToShow || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=300&q=80"}
                    alt="Group"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <label className="absolute inset-0 cursor-pointer rounded-3xl flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-sm">
                  <Camera className="w-8 h-8 text-white drop-shadow-md" />
                  <input type="file" onChange={handleChange} className="hidden" accept="image/*" />
                </label>
                <div className="absolute -bottom-2 -right-2 bg-purple-500 text-white p-2 rounded-xl shadow-lg transform rotate-6 border-2 border-white dark:border-gray-900">
                  <Edit3 className="w-4 h-4" />
                </div>
              </div>

              {/* Inputs */}
              <div className="flex-grow w-full space-y-5">
                <div className="space-y-2">
                  <label className={`text-xs font-bold uppercase tracking-wider ml-1 ${lightMode ? 'text-gray-500' : 'text-gray-400'}`}>Group Name</label>
                  <div className="relative group">
                    <input
                      type="text"
                      value={groupName}
                      placeholder="e.g. Summer Trip 2024"
                      onChange={(e) => setGroupName(e.target.value)}
                      className={`w-full bg-transparent px-5 py-4 rounded-2xl border-2 outline-none transition-all duration-200 font-semibold text-lg placeholder:font-normal ${
                        lightMode 
                          ? 'border-gray-200 focus:border-purple-500 focus:bg-purple-50/30 text-gray-800 placeholder-gray-400' 
                          : 'border-gray-700 focus:border-purple-500 focus:bg-purple-900/10 text-white placeholder-gray-500'
                      }`}
                    />
                  </div>
                </div>

                <div className="space-y-2 relative" ref={ddropRef}>
                  <label className={`text-xs font-bold uppercase tracking-wider ml-1 ${lightMode ? 'text-gray-500' : 'text-gray-400'}`}>Group Type</label>
                  <button
                    onClick={() => setDrop(!drop)}
                    className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border-2 transition-all duration-200 ${
                      lightMode 
                        ? 'border-gray-200 hover:border-purple-300 bg-gray-50/50 text-gray-800' 
                        : 'border-gray-700 hover:border-purple-500 bg-gray-800/50 text-white'
                    }`}
                  >
                    <span className="flex items-center gap-3 font-medium">
                      {groupType ? (
                         // Simple logic to show icon based on selection, purely visual
                         <>
                           {groupType === 'Trip' && <Briefcase className="w-5 h-5 text-purple-500"/>}
                           {groupType === 'Home' && <Home className="w-5 h-5 text-purple-500"/>}
                           {groupType === 'Event' && <Users className="w-5 h-5 text-purple-500"/>}
                           {groupType === 'Other' && <Coffee className="w-5 h-5 text-purple-500"/>}
                           {groupType}
                         </>
                      ) : (
                        <span className="text-gray-400">Select Category</span>
                      )}
                    </span>
                    <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${drop ? 'rotate-180' : ''}`} />
                  </button>

                  {drop && (
                    <div className={`absolute top-full left-0 right-0 mt-2 p-2 rounded-2xl shadow-xl z-30 border ${
                      lightMode ? 'bg-white border-gray-100' : 'bg-gray-800 border-gray-700'
                    } animate-in fade-in zoom-in-95 duration-200`}>
                      <div className="grid grid-cols-2 gap-2">
                        {[{ name: 'Trip', icon: Briefcase }, { name: 'Home', icon: Home }, { name: 'Event', icon: Users }, { name: 'Other', icon: Coffee }].map((type) => {
                           const Icon = type.icon;
                           return (
                            <button
                              key={type.name}
                              onClick={() => { setGroupType(type.name); setDrop(false); }}
                              className={`flex items-center gap-3 p-3 rounded-xl transition-colors text-left ${
                                lightMode ? 'hover:bg-purple-50 text-gray-700' : 'hover:bg-gray-700 text-gray-200'
                              }`}
                            >
                              <div className={`p-2 rounded-lg ${lightMode ? 'bg-purple-100 text-purple-600' : 'bg-gray-700 text-purple-400'}`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <span className="font-medium">{type.name}</span>
                            </button>
                           )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className={`h-px w-full ${lightMode ? 'bg-gray-200' : 'bg-gray-800'}`} />

            {/* Members Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`text-xl font-bold ${lightMode ? 'text-gray-900' : 'text-white'}`}>Group Members</h3>
                  <p className={`text-sm ${lightMode ? 'text-gray-500' : 'text-gray-400'}`}>Manage friends and their split percentage.</p>
                </div>
                <button
                  onClick={handleAdd}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95 ${
                    lightMode 
                      ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' 
                      : 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  Add Member
                </button>
              </div>

              {/* Members List */}
              <div className="space-y-3">
                {members.map((m, index) => (
                  <div 
                    key={index} 
                    className={`group relative grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-3 rounded-2xl border transition-all duration-200 ${
                      lightMode 
                        ? 'bg-white border-gray-100 hover:border-purple-200 hover:shadow-md' 
                        : 'bg-gray-800/30 border-gray-800 hover:border-gray-600'
                    }`}
                  >
                    {/* Index Number */}
                    <div className="hidden md:flex col-span-1 justify-center">
                        <span className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${
                            lightMode ? 'bg-gray-100 text-gray-500' : 'bg-gray-700 text-gray-400'
                        }`}>
                            {index + 1}
                        </span>
                    </div>

                    {/* Email Input */}
                    <div className="col-span-1 md:col-span-7 relative">
                      <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${lightMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <input
                        type="email"
                        name="email"
                        value={m.email}
                        placeholder="friend@email.com"
                        onChange={(e) => handleChangee(e, index)}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl outline-none bg-transparent font-medium ${
                          lightMode 
                            ? 'text-gray-800 placeholder-gray-400 focus:bg-gray-50' 
                            : 'text-white placeholder-gray-500 focus:bg-gray-700/50'
                        }`}
                      />
                    </div>

                    {/* Share Input */}
                    <div className="col-span-1 md:col-span-3 flex items-center gap-2 bg-transparent">
                      <div className={`relative flex-1 flex items-center rounded-xl overflow-hidden border ${
                        lightMode ? 'bg-gray-50 border-gray-200' : 'bg-gray-900/50 border-gray-700'
                      }`}>
                         <input
                          type="number"
                          min="0"
                          max="100"
                          value={m.share}
                          onChange={(e) => handleChangeInShare(index, e)}
                          className={`w-full pl-3 pr-8 py-2.5 bg-transparent outline-none text-center font-bold ${
                            lightMode ? 'text-gray-900' : 'text-white'
                          }`}
                        />
                        <div className="absolute right-3 pointer-events-none text-gray-400 text-xs font-bold">%</div>
                      </div>
                    </div>

                    {/* Delete Button */}
                    <div className="col-span-1 flex justify-end md:justify-center">
                      {members.length > 1 && (
                        <button
                          onClick={() => handleRemove(index)}
                          className={`p-2.5 rounded-xl transition-all ${
                            lightMode 
                              ? 'text-gray-400 hover:bg-rose-50 hover:text-rose-600' 
                              : 'text-gray-500 hover:bg-rose-900/20 hover:text-rose-400'
                          }`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Stats Bar */}
              <div className={`flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl border-2 transition-colors duration-300 ${
                  total === 100 
                    ? (lightMode ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-emerald-900/10 border-emerald-500/20 text-emerald-400')
                    : total > 100 
                    ? (lightMode ? 'bg-rose-50 border-rose-100 text-rose-800' : 'bg-rose-900/10 border-rose-500/20 text-rose-400')
                    : (lightMode ? 'bg-orange-50 border-orange-100 text-orange-800' : 'bg-orange-900/10 border-orange-500/20 text-orange-400')
              }`}>
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                         total === 100 ? 'bg-emerald-200/50' : total > 100 ? 'bg-rose-200/50' : 'bg-orange-200/50'
                    }`}>
                        <PieChart className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase opacity-70">Total Allocation</p>
                        <p className="text-xl font-black">{total}%</p>
                    </div>
                </div>
                
                <div className={`mt-2 sm:mt-0 px-4 py-1.5 rounded-full text-sm font-bold ${
                    total === 100 
                        ? (lightMode ? 'bg-emerald-100' : 'bg-emerald-500/20') 
                        : total > 100 
                        ? (lightMode ? 'bg-rose-100' : 'bg-rose-500/20')
                        : (lightMode ? 'bg-orange-100' : 'bg-orange-500/20')
                }`}>
                     {100 - total >= 0 ? `Remaining to split: ${100 - total}%` : `Oversplit by: ${Math.abs(100 - total)}%`}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4">
              <button
                onClick={handleSave}
                disabled={saving || total !== 100}
                className={`w-full relative group overflow-hidden rounded-2xl p-4 transition-all duration-300 transform active:scale-[0.99] ${
                    saving || total !== 100 
                        ? 'cursor-not-allowed opacity-50 grayscale' 
                        : 'hover:shadow-xl hover:shadow-purple-500/20'
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${
                    lightMode 
                    ? 'from-purple-600 to-cyan-500' 
                    : 'from-purple-600 to-cyan-600'
                } transition-transform duration-300 group-hover:scale-105`} />
                
                <div className="relative flex items-center justify-center gap-2 text-white font-bold text-lg">
                  {saving ? (
                    <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>Creating Group...</span>
                    </>
                  ) : (
                    <>
                        <Check className="w-6 h-6" />
                        <span>Create Group</span>
                    </>
                  )}
                </div>
              </button>
            </div>

          </div>
        </div>
        
        {/* Footer Credit / Style */}
        <div className={`text-center mt-8 text-sm ${lightMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <p>Ready to split expenses? Ensure total equals 100%.</p>
        </div>

      </div>
    </div>
  );
}