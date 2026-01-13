import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CreatePickupLine from "../utils/CreatePickupLine";
import ViewAllPickupLines from "../utils/ViewAllPickupLines ";

const PickupLines = () => {
  const [activeTab, setActiveTab] = useState<"create" | "view">("create");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const tabs = [
    { id: "create", label: "Create Pickup Line" },
    { id: "view", label: "View All Pickup Lines" },
  ] as const;

  return (
    <>
      <div className="w-full max-w-5xl mx-auto px-4 py-8">
        {/* Segmented Control – pill style like your Prompt Tester */}
        <div className="flex justify-center mb-8 sm:mb-10">
          <div className="inline-flex items-center rounded-xl bg-gray-900/60 backdrop-blur-sm p-1.5 border border-gray-700/70 shadow-inner gap-2">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-6 py-2.5 sm:px-8 sm:py-3 text-sm sm:text-base font-medium rounded-lg transition-all duration-200
                  ${
                    activeTab === tab.id
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-300 hover:text-white hover:bg-gray-800/60"
                  }
                `}
              >
                {tab.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Content Area with smooth transition */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-2xl p-6 sm:p-8"
          >
            {activeTab === "create" && <CreatePickupLine />}
            {activeTab === "view" && <ViewAllPickupLines setIsLoading={setIsLoading} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Global Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-700"
            >
              <div className="flex flex-col items-center gap-4">
                <svg className="animate-spin h-12 w-12 text-blue-500" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                <p className="text-white font-medium">Loading...</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PickupLines;