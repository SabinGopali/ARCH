import React, { useState } from "react";

export default function AccountSecurity() {
  const [email, setEmail] = useState("brianfrederin@email.com");
  const [password, setPassword] = useState("password123");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailEditMode, setEmailEditMode] = useState(false);
  const [passwordEditMode, setPasswordEditMode] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleEmailSave = () => {
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    setEmailError("");
    setEmailEditMode(false);
  };

  const handlePasswordSave = () => {
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    setPasswordError("");
    setPasswordEditMode(false);
    setConfirmPassword("");
  };

  return (
    <div className="max-w-6xl mt-10 mb-10 mx-auto p-8 bg-white shadow-lg rounded-lg space-y-10">
      {/* My Profile */}
      <div>
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">
          My Profile
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm mb-1 font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              value="Brian"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              value="Frederin"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="text"
              value="+1 234 567 890"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 font-medium text-gray-700">
              Date of Birth
            </label>
            <input
              type="date"
              value="1990-05-15"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Account Security */}
      <div>
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">
          Account Security
        </h2>

        {/* Email Row */}
        <div className="space-y-2 mb-6">
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              className={`flex-1 border border-gray-300 rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                !emailEditMode && "bg-gray-100 cursor-not-allowed"
              }`}
              value={email}
              disabled={!emailEditMode}
              onChange={(e) => setEmail(e.target.value)}
            />
            {!emailEditMode ? (
              <button
                onClick={() => setEmailEditMode(true)}
                className="px-4 py-2 text-sm font-medium border rounded hover:bg-gray-50"
              >
                Change
              </button>
            ) : (
              <>
                <button
                  onClick={handleEmailSave}
                  className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEmailEditMode(false);
                    setEmail("brianfrederin@email.com");
                    setEmailError("");
                  }}
                  className="px-4 py-2 text-sm font-medium border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
          {emailError && (
            <p className="text-red-500 text-xs">{emailError}</p>
          )}
        </div>

        {/* Password Row */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="password"
              className={`flex-1 border border-gray-300 rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                !passwordEditMode && "bg-gray-100 cursor-not-allowed"
              }`}
              value={passwordEditMode ? password : "********"}
              disabled={!passwordEditMode}
              onChange={(e) => setPassword(e.target.value)}
            />
            {!passwordEditMode ? (
              <button
                onClick={() => setPasswordEditMode(true)}
                className="px-4 py-2 text-sm font-medium border rounded hover:bg-gray-50"
              >
                Change
              </button>
            ) : (
              <>
                <button
                  onClick={handlePasswordSave}
                  className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setPasswordEditMode(false);
                    setPassword("password123");
                    setConfirmPassword("");
                    setPasswordError("");
                  }}
                  className="px-4 py-2 text-sm font-medium border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
              </>
            )}
          </div>

          {/* Confirm Password */}
          {passwordEditMode && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mt-3">
                Confirm Password
              </label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          )}
          {passwordError && (
            <p className="text-red-500 text-xs">{passwordError}</p>
          )}
        </div>
      </div>

      {/* Additional Info */}
      <div>
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">
          Preferences
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm mb-1 font-medium text-gray-700">
              Language
            </label>
            <select className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>Nepali</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1 font-medium text-gray-700">
              Timezone
            </label>
            <select className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>GMT</option>
              <option>GMT+5:45 (Nepal)</option>
              <option>EST</option>
              <option>PST</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
