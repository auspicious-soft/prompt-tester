import React, { useEffect, useState } from "react";
import { deleteApi, getApi } from "../utils/api";
import { URLS } from "../utils/urls";
import { motion, AnimatePresence } from "framer-motion";
import PromptById from "./PromptById";
import TypingLoader from "../utils/Lodaer";
import ConfirmationModal from "../utils/ConfirmationModal";
import CreatePromptForm from "../utils/CreatePromptForm";
import { Trash2 } from "lucide-react"; // Import delete icon

interface Prompt {
  _id: string;
  key: string;
  generation: string;
  persona: string;
}

const formatPromptKey = (key: string): string => {
  return key
    .split("_")
    .map((word) => {
      if (/^V\d+$/i.test(word)) {
        return `Version ${word.replace("V", "")}`;
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
};

// Motion variants for staggered animation
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -10, scale: 0.9 },
};



const PromptTemplates: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [allPrompts, setAllPrompts] = useState<Prompt[]>([]);
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedGender, setSelectedGender] = useState<string>("");
  const [selectedGen, setSelectedGen] = useState<string>("");

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => Promise<void>>(async () => {});

  const isDefaultVersion = (key: string) => /(_GENZ|_MILLENNIAL_V1)$/i.test(key);


  const getAllPrompts = async () => {
    setLoading(true);
    try {
      const response = await getApi(`${URLS.getAllPrompts}`);
      if (response.status === 200) {
        const allP = response?.data?.data?.prompts || [];
        setAllPrompts(allP);
        setFilteredPrompts(allP);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllPrompts();
  }, []);

  useEffect(() => {
    const filtered = allPrompts.filter((p) => {
      const gender = p.persona === "HABIBI" ? "MALE" : "FEMALE";
      const gen = p.generation === "GENZ" ? "GENZ" : "MILLENNIAL";
      if (selectedGender && gender !== selectedGender) return false;
      if (selectedGen && gen !== selectedGen) return false;
      return true;
    });
    setFilteredPrompts(filtered);
  }, [selectedGender, selectedGen, allPrompts]);

  // Handler for selecting a prompt
const handleSelectPrompt = (prompt: Prompt) => {
  setSelectedPrompt(prompt);
  setShowCreateForm(false); // Deselect "Create Prompt" form
};

// Handler for opening the create prompt form
const handleOpenCreateForm = () => {
  setShowCreateForm(true);
  setSelectedPrompt(null); // Deselect any selected prompt
};

const handleDeletePrompt = async (id: string) => {
  if (!window.confirm("Are you sure you want to delete this prompt?")) return;
  try {
    const response = await deleteApi(`${URLS.deletePrompt}/${id}`);
    if (response.status === 200) {
      alert(response.data.message);
      getAllPrompts(); // refresh list after deletion
      if (selectedPrompt?._id === id) setSelectedPrompt(null); // deselect if deleted
    } else {
      alert("Failed to delete prompt");
    }
  } catch (err: any) {
    alert(err.message || "Error deleting prompt");
  }
};

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      {/* Top Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <div className="flex gap-3 items-center flex-wrap">
         
          <motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  onClick={handleOpenCreateForm}
           className={`px-6 py-3 rounded-lg text-white transition-all duration-300 ${
    showCreateForm
      ? "bg-green-700 hover:bg-green-700"
      : "bg-green-600  hover:bg-green-700"
  }`}
          >
            Add New Prompt +
</motion.button>
        </div>
       
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-wrap gap-3 mt-3 sm:mt-0"
          >
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="px-3 py-2 rounded-lg bg-gray-700 text-gray-100 border border-gray-600"
            >
              <option value="">All Genders</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
            <select
              value={selectedGen}
              onChange={(e) => setSelectedGen(e.target.value)}
              className="px-3 py-2 rounded-lg bg-gray-700 text-gray-100 border border-gray-600"
            >
              <option value="">All Generations</option>
              <option value="GENZ">Gen Z</option>
              <option value="MILLENNIAL">Millennial</option>
            </select>
          </motion.div>
    
      </div>

      {/* Create Prompt Form */}
      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="mb-6"
          >
            <CreatePromptForm
              onCancel={() => setShowCreateForm(false)}
              onCreated={() => {
                getAllPrompts();
                setShowCreateForm(false);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Prompts List */}
      {loading ? (
        <TypingLoader />
      ) : filteredPrompts.length === 0 ? (
        <p className="text-gray-300 text-center mt-6">No prompts available.</p>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
           <AnimatePresence>
{filteredPrompts &&
  !showCreateForm &&
  filteredPrompts.map((prompt) => {
    const isSelected = selectedPrompt?._id === prompt._id;
    return (
      <motion.div
        key={prompt._id}
        layout
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="relative"
      >
        <motion.button
          className={`w-full px-5 py-3 rounded-lg font-medium text-sm transition-all duration-300 min-w-[140px] ${
            isSelected
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleSelectPrompt(prompt)}
        >
          {formatPromptKey(prompt.key)}
        </motion.button>

        {/* Delete Button */}
        {!isDefaultVersion(prompt.key) && (
          <button
            onClick={() => handleDeletePrompt(prompt._id)}
            className="absolute top-2 right-1 text-red-500 hover:text-red-600 p-1 rounded"
            title="Delete Prompt"
          >
            <Trash2 size={16} />
          </button>
        )}
      </motion.div>
    );
  })}

</AnimatePresence>

          </AnimatePresence>
        </motion.div>
      )}

      {/* Selected Prompt Details */}
      {selectedPrompt && (
        <PromptById
          id={selectedPrompt._id}
          onRequestLoadToProduction={(action) => {
            setConfirmAction(() => action);
            setIsConfirmOpen(true);
          }}
        />
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={async () => {
          await confirmAction();
          setIsConfirmOpen(false);
        }}
      />
    </div>
  );
};

export default PromptTemplates;
