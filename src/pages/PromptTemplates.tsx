import React, { useEffect, useState } from "react";
import { getApi } from "../utils/api";
import { URLS } from "../utils/urls";
import { motion } from "framer-motion";
import PromptById from "./PromptById";
import TypingLoader from "../utils/Lodaer";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

interface Prompt {
  _id: string;
  key: string;
  generation: string;
  persona: string;
}

function PromptTemplates() {
  const [loading, setLoading] = useState(false);
  const [allPrompts, setAllPrompts] = useState<Prompt[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null); // Store full Prompt object

  const getAllPrompts = async () => {
    setLoading(true);
    try {
      const response = await getApi(`${URLS.getAllPrompts}`);
      if (response.status === 200) {
        console.log(response);
        const allP = response?.data?.data?.prompts || [];
        setAllPrompts(allP as Prompt[]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllPrompts();
  }, []);

  const handleSelect = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
  };

  const handleChange = (prompt: Prompt) => {
    console.log(`Prompt changed to: ${prompt.key}`);
    // Add any additional logic here, e.g., notify parent or trigger API calls
  };
  return (
    <>
      {loading ? (
        <TypingLoader />
      ) : (
        <>
          <div className="w-full">
            {loading ? (
              <p className="text-gray-300 text-center">Loading prompts...</p>
            ) : allPrompts.length === 0 ? (
              <p className="text-gray-300 text-center">No prompts available.</p>
            ) : (
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-wrap justify-center gap-2 sm:gap-3"
              >
                {allPrompts.map((prompt) => (
                  <motion.button
                    key={prompt._id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      handleSelect(prompt); // Store full Prompt object
                      handleChange(prompt); // Trigger additional logic
                    }}
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-medium text-xs sm:text-sm transition-all duration-300 min-w-[100px] ${
                      selectedPrompt?._id === prompt._id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    {prompt.key}
                  </motion.button>
                ))}
              </motion.div>
            )}
            {selectedPrompt && <PromptById id={selectedPrompt._id} />}
          </div>
        </>
      )}
    </>
  );
}

export default PromptTemplates;
