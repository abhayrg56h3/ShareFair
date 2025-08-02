import React, { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import LockIcon from "@mui/icons-material/Lock";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";

export default function Profile({ currUser }) {
  if (!currUser) {
    return (
      <Loading/>
    );
  }
  
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const [name, setName] = useState(currUser?.name);
  const [email, setEmail] = useState(currUser?.email);
  const [phone, setPhone] = useState(currUser?.phone);
  const [password, setPassword] = useState(currUser?.password);
  const [currPassword, setCurrPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [val, setVal] = useState(0);
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    setLoading(true);
    const data = new FormData();
    data.append("name", name);
    data.append("email", email);
    if (newPassword != "") {
      data.append("currPassword", currPassword);
      data.append("newPassword", newPassword);
    }

    data.append("image", file);
    data.append("phone", phone);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/updateInfo/${currUser._id}`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.status == 200) {
        alert("Information updated succesfully");
        setLoading(false);
        navigate('/');
      } else if (res.status == 202) {
        alert("Wrong Password");
      }
    } catch (err) {
      alert("Something went wrong please retry");
      setLoading(false);
      console.log(err);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-4 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mt-32 mx-auto">
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-6 sm:mb-8 lg:mb-10">
          <div className="relative group mb-4 sm:mb-6">
            <div className="relative">
              <img
                src={
                  file ? URL.createObjectURL(file) : currUser?.profilePicture ? currUser?.profilePicture : "https://avatars.dicebear.com/api/bottts/your-custom-seed.svg"
                }
                className="w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full object-cover border-4 border-white shadow-2xl hover:border-indigo-200 transition-all duration-300 hover:scale-105"
                alt="Profile"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <label className="absolute -bottom-1 -right-1 sm:bottom-0 sm:right-0 bg-gradient-to-r from-indigo-600 to-purple-600 p-2 sm:p-3 rounded-full shadow-xl cursor-pointer hover:scale-110 hover:shadow-2xl transition-all duration-300 border-2 border-white">
              <CloudUploadIcon className="text-white text-base sm:text-lg" />
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden"
              />
            </label>
          </div>
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-700 via-purple-600 to-indigo-800 bg-clip-text text-transparent mb-2">
              Account Settings
            </h1>
            <p className="text-sm sm:text-base text-gray-600 max-w-md">
              Manage your personal information and preferences
            </p>
          </div>
        </div>

        {/* Account Details Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-4 sm:p-6 lg:p-8 hover:shadow-3xl transition-all duration-500">
          {/* Card Header */}
          <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8 pb-4 border-b border-gray-200">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 sm:p-3 rounded-xl shadow-lg">
              <PersonIcon className="text-white text-lg sm:text-xl" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">
                Personal Information
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Keep your details up to date
              </p>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {/* Name Field */}
            <div className="group bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-4 sm:p-5 hover:from-purple-100 hover:to-indigo-100 transition-all duration-300 border border-purple-100 hover:border-purple-200 hover:shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  <div className="flex-shrink-0">
                    <PersonIcon className="text-purple-600 text-lg sm:text-xl" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-purple-600 font-medium mb-1 sm:mb-2">Full Name</p>
                    {val === 1 ? (
                      <input
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-transparent border-b-2 border-purple-600 focus:outline-none pb-2 text-sm sm:text-base text-gray-800 font-medium placeholder-purple-400 focus:border-purple-700 transition-colors"
                        value={name}
                        placeholder="Enter your name"
                      />
                    ) : (
                      <p className="text-sm sm:text-base font-semibold text-gray-800 truncate">
                        {currUser?.name}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setVal(1)}
                  className="flex-shrink-0 text-purple-600 hover:text-white p-2 sm:p-3 rounded-full hover:bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-300 hover:scale-105 hover:shadow-lg self-end sm:self-center"
                >
                  <EditIcon className="text-base sm:text-lg" />
                </button>
              </div>
            </div>

            {/* Email Field */}
            <div className="group bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-4 sm:p-5 hover:from-blue-100 hover:to-cyan-100 transition-all duration-300 border border-blue-100 hover:border-blue-200 hover:shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  <div className="flex-shrink-0">
                    <EmailIcon className="text-blue-600 text-lg sm:text-xl" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-blue-600 font-medium mb-1 sm:mb-2">Email Address</p>
                    {val === 2 ? (
                      <input
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-transparent border-b-2 border-blue-600 focus:outline-none pb-2 text-sm sm:text-base text-gray-800 font-medium placeholder-blue-400 focus:border-blue-700 transition-colors"
                        value={email}
                        placeholder="Enter your email"
                      />
                    ) : (
                      <p className="text-sm sm:text-base font-semibold text-gray-800 truncate">
                        {currUser?.email}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setVal(2)}
                  className="flex-shrink-0 text-blue-600 hover:text-white p-2 sm:p-3 rounded-full hover:bg-gradient-to-r from-blue-600 to-cyan-600 transition-all duration-300 hover:scale-105 hover:shadow-lg self-end sm:self-center"
                >
                  <EditIcon className="text-base sm:text-lg" />
                </button>
              </div>
            </div>

            {/* Password Field */}
            <div className="group bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-4 sm:p-5 hover:from-indigo-100 hover:to-purple-100 transition-all duration-300 border border-indigo-100 hover:border-indigo-200 hover:shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                  <div className="flex-shrink-0 pt-1">
                    <LockIcon className="text-indigo-600 text-lg sm:text-xl" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-indigo-600 font-medium mb-1 sm:mb-2">Password</p>
                    {val === 3 ? (
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <input
                          onChange={(e) => setCurrPassword(e.target.value)}
                          className="flex-1 bg-transparent border-b-2 border-indigo-600 focus:outline-none pb-2 text-sm sm:text-base text-gray-800 font-medium placeholder-indigo-400 focus:border-indigo-700 transition-colors"
                          type="password"
                          placeholder="Current Password"
                          value={currPassword}
                        />
                        <input
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="flex-1 bg-transparent border-b-2 border-indigo-600 focus:outline-none pb-2 text-sm sm:text-base text-gray-800 font-medium placeholder-indigo-400 focus:border-indigo-700 transition-colors"
                          type="password"
                          placeholder="New Password"
                          value={newPassword}
                        />
                      </div>
                    ) : (
                      <p className="text-sm sm:text-base font-semibold text-gray-800">
                        ••••••••••••••••
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setVal(3)}
                  className="flex-shrink-0 text-indigo-600 hover:text-white p-2 sm:p-3 rounded-full hover:bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300 hover:scale-105 hover:shadow-lg self-end sm:self-start"
                >
                  <EditIcon className="text-base sm:text-lg" />
                </button>
              </div>
            </div>

            {/* Phone Field */}
            <div className="group bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl p-4 sm:p-5 hover:from-rose-100 hover:to-pink-100 transition-all duration-300 border border-rose-100 hover:border-rose-200 hover:shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  <div className="flex-shrink-0">
                    <PhoneIcon className="text-rose-500 text-lg sm:text-xl" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-rose-500 font-medium mb-1 sm:mb-2">Phone Number</p>
                    {val === 4 ? (
                      <input
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-transparent border-b-2 border-rose-500 focus:outline-none pb-2 text-sm sm:text-base text-gray-800 font-medium placeholder-rose-400 focus:border-rose-600 transition-colors"
                        value={phone}
                        placeholder="Enter phone number"
                      />
                    ) : (
                      <p className="text-sm sm:text-base font-semibold text-gray-800 truncate">
                        {currUser?.phone}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setVal(4)}
                  className="flex-shrink-0 text-rose-500 hover:text-white p-2 sm:p-3 rounded-full hover:bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-300 hover:scale-105 hover:shadow-lg self-end sm:self-center"
                >
                  <EditIcon className="text-base sm:text-lg" />
                </button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-center mt-8 sm:mt-10 lg:mt-12 pt-6 border-t border-gray-200">
            <button
              onClick={handleSave}
              disabled={loading}
              className="group relative bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-800 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 sm:px-10 lg:px-12 py-3 sm:py-4 rounded-full font-semibold text-sm sm:text-base shadow-xl hover:shadow-2xl disabled:shadow-md transition-all duration-300 hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed min-w-[140px] sm:min-w-[160px]"
            >
              <div className="flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <SaveIcon className="text-base sm:text-lg" />
                    <span>Save Changes</span>
                  </>
                )}
              </div>
              <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-6 sm:mt-8">
          <p className="text-xs sm:text-sm text-gray-500">
            Your information is secure and encrypted
          </p>
        </div>
      </div>
    </div>
  );
}