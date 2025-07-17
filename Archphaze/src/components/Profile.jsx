import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { signoutSuccess } from "../redux/user/userslice";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const handleSignout = async () => {
    try {
      const res = await fetch('/backend/user/signout', {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
        navigate('/');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 bg-gray-50 rounded-2xl p-8 shadow-xl border border-gray-200">

        {/* Left: Profile Image + Name */}
        <div className="flex flex-col items-center text-center gap-4">
          <img
            src={currentUser?.profilePicture}
            alt={currentUser?.username || "User avatar"}
            className="w-36 h-36 rounded-full object-cover border-4 border-gray-200 shadow-md"
          />
          <div>
            <h2 className="text-2xl font-bold">{currentUser?.username || "Unknown User"}</h2>
            <p className="text-green-600 font-medium">
                    {currentUser?.isAdmin
                        ? "Admin"
                        : currentUser?.isSupplier
                        ? "Supplier"
                        : "User"}
                    </p>
            <button
              onClick={handleSignout}
              className="mt-2 px-4 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded-full"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Right: Profile Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
          <ProfileItem icon={<FaUserCircle />} label="Username" value={currentUser?.username || "-"} />
          <ProfileItem icon={<MdEmail />} label="Email" value={currentUser?.email || "-"} />
        </div>

      </div>
    </div>
  );
}

function ProfileItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-xl text-gray-700">{icon}</div>
      <div>
        <p className="text-gray-500">{label}</p>
        <p className="text-gray-800 font-medium break-words">{value}</p>
      </div>
    </div>
  );
}
