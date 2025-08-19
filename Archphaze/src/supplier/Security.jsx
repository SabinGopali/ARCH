import React, { useState } from "react";
import { FiRefreshCcw, FiLogOut } from "react-icons/fi";
import Suppliersidebar from "../supplier/Suppliersidebar";

export default function Security() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gray-50 pt-5 pb-10">
      {/* Mobile Sidebar Toggle */}
      <div className="px-4 lg:hidden mb-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-white border shadow rounded-md hover:bg-gray-100 transition"
          aria-label="Toggle Sidebar"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Aside */}
      <aside
        className={`fixed z-40 top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:hidden`}
      >
        <Suppliersidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </aside>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="mx-auto max-w-screen-2xl px-4">
        <div className="flex flex-col lg:flex-row lg:gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 sticky top-6 self-start mb-8 lg:mb-0">
            <Suppliersidebar sidebarOpen={true} setSidebarOpen={() => {}} />
          </aside>

          {/* Main Content */}
          <main className="flex-grow w-full">
            <section className="bg-white rounded-lg shadow-lg p-8 w-full">
              <h2 className="text-2xl font-semibold mb-6">Account Security</h2>

              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">robin@demonic.com</p>
                  </div>
                  <button className="text-sm font-medium text-blue-600 hover:underline">
                    Change email
                  </button>
                </div>

                {/* Recovery Codes */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Recovery codes</p>
                    <p className="text-sm text-gray-500">Generated May 12, 2025</p>
                  </div>
                  <button className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-1">
                    <FiRefreshCcw size={14} /> Regenerate
                  </button>
                </div>

                {/* Password */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Password</p>
                    <p className="text-sm text-gray-500">Last updated 3 months ago</p>
                  </div>
                  <button className="text-sm font-medium text-blue-600 hover:underline">
                    Change password
                  </button>
                </div>

                {/* Active Sessions */}
                <div>
                  <p className="text-sm text-gray-600 mb-2">Active Sessions</p>
                  <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
                    {[
                      {
                        device: "Chrome on Windows",
                        location: "Kathmandu, NP",
                        lastActive: "5 minutes ago",
                        current: true,
                      },
                      {
                        device: "Safari on iPhone",
                        location: "Pokhara, NP",
                        lastActive: "2 days ago",
                        current: false,
                      },
                    ].map((session, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center px-4 py-3"
                      >
                        <div>
                          <p className="font-medium text-sm text-gray-800">
                            {session.device}
                            {session.current && (
                              <span className="ml-2 text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                                This device
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-gray-500">
                            {session.location} • Last active {session.lastActive}
                          </p>
                        </div>
                        {!session.current && (
                          <button className="text-sm text-red-600 hover:underline flex items-center gap-1">
                            <FiLogOut size={14} /> Log out
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
