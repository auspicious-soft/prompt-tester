import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
import { getApi, postApi } from "../utils/api";
import { URLS } from "../utils/urls";
import { toast } from "sonner";
import PromptTemplates from "./PromptTemplates";
import TypingLoader from "../utils/Lodaer";

interface FullPrompt {
  role: string;
  messageType: string;
  style: string;
  language: string;
  dialect: string;
  gender: string;
  systemPrompt: string;
  userInstruction: string;
  extractedChat: string | null;
  lastReplies: string[] | null;
}

const PromptGenerator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"generator" | "templates">(
    "generator"
  );
  const [selectedType, setSelectedType] = useState<
    "ScreenshotReply" | "ManualReply" | "GetPickUpLine"
  >("GetPickUpLine");
  const [gender, setGender] = useState<"MALE" | "FEMALE">("MALE");
  const [isGenxz, setIsGenxz] = useState<boolean>(false);
  const [style, setStyle] = useState<string>("Conservative");
  const [language, setLanguage] = useState<"en" | "ar" | "arbz">("en");
  const [dialect, setDialect] = useState<
    "LEVANTINE" | "EGYPTIAN" | "GULF" | "IRAQI" | "NORTH_AFRICAN" | ""
  >("");
  const [promptType, setPromptType] = useState<"Optimized" | "Full prompt">(
    "Optimized"
  );
  const [message, setMessage] = useState("");
  const [context, setContext] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [output, setOutput] = useState("");
  const [fullPrompt, setFullPrompt] = useState<FullPrompt | null>(null);
  const [responses, setResponses] = useState<string[]>([]);
  const [translatedText, setTranslatedText] = useState<string[]>([]);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [promptAccordionOpen, setPromptAccordionOpen] = useState(false);
  const [translatedAccordionOpen, setTranslatedAccordionOpen] = useState(false);

  const maleStyles = ["Conservative", "Playful", "Confident", "Flirty"];
  const femaleStyles = ["Modest", "Playful", "Sassy", "Flirty"];
  const stylesOptions =
    gender === "MALE" ? maleStyles : gender === "FEMALE" ? femaleStyles : [];

  const handleChange = (
    setter: React.Dispatch<React.SetStateAction<any>>,
    value: any
  ) => {
    setter(value);

    if (setter === setSelectedType) {
      setOutput("");
      setFullPrompt(null);
      setResponses([]);
      setTranslatedText([]);

      setSuccess(false);
      setPromptAccordionOpen(false);
      setTranslatedAccordionOpen(false);

      setImageFile(null); // Reset uploaded image
      setMessage(""); // Reset manual reply
      setContext(""); // Reset optional context
    } else if (setter === setGender) {
      if (value === "MALE") {
        setStyle("Conservative");
        setIsGenxz(false);
      } else if (value === "FEMALE") {
        setStyle("Modest");
        setIsGenxz(false);
      }
    } else if (setter === setLanguage) {
      if (value === "en") {
        setDialect("");
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setOutput("");
      setFullPrompt(null);
      setResponses([]);
      setTranslatedText([]);
      setSuccess(false);
      setPromptAccordionOpen(false);
      setTranslatedAccordionOpen(false);
    }
  };

  const resetGeneratorTab = () => {
    setImageFile(null); // reset uploaded image
    setMessage(""); // reset manual message
    setContext(""); // reset optional context
    setResponses([]); // reset API responses
    setSuccess(false); // reset success state
  };

  const handleSubmit = async () => {
    if (!selectedType) {
      toast.error("Please select a type");
      return;
    }
    if (!gender) {
      toast.error("Please select gender");
      return;
    }
    if (!style) {
      toast.error("Please select style");
      return;
    }
    if (!language) {
      toast.error("Please select a language");
      return;
    }
    if (!promptType) {
      toast.error("Please select a prompt type");
      return;
    }

    if (selectedType === "ManualReply" && !message.trim()) {
      toast.error("Message cannot be empty");
      return;
    }

    if (selectedType === "ScreenshotReply" && !imageFile) {
      toast.error("Please upload an image");
      return;
    }

    setLoading(true);
    setPromptAccordionOpen(false);
    setTranslatedAccordionOpen(false);
    try {
      let response;
      const commonParams = {
        rizzType: style?.toUpperCase() ?? "",
        isGenz: isGenxz ?? false,
        language: language?.toLowerCase() ?? "",
        dialect: language === "en" ? "" : dialect ?? "",
        gender: gender ?? "",
        protoType: promptType?.toLowerCase().replace(" ", "") ?? "",
      };

      if (selectedType === "GetPickUpLine") {
        const query = new URLSearchParams({
          ...commonParams,
          isGenz: commonParams.isGenz.toString(),
        }).toString();
        response = await getApi(`${URLS.getPickUpLine}?${query}`);
      } else if (selectedType === "ManualReply") {
        const body = {
          ...commonParams,
          message,
          context: context || undefined,
        };
        response = await postApi(`${URLS.getManualReply}`, body);
      } else if (selectedType === "ScreenshotReply") {
        const formData = new FormData();
        if (imageFile) {
          formData.append("image", imageFile);
        }
        Object.entries(commonParams).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(
              key,
              typeof value === "boolean" ? value.toString() : value
            );
          }
        });
        response = await postApi(`${URLS.getResponseByScreenshot}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      if (response?.status === 200 && response.data.success) {
        const isInvalidScreenshot =
          selectedType === "ScreenshotReply" &&
          typeof response.data.data.reply === "string" &&
          response.data.data.reply.includes(
            "Sorry, could not extract a valid chat from this screenshot."
          );

        if (isInvalidScreenshot) {
          setSuccess(true);
          setOutput("Error: Invalid screenshot");
          setResponses([response.data.data.reply]);
          setTranslatedText([]);
          setFullPrompt(null);
        } else {
          setSuccess(true);
          if (selectedType === "GetPickUpLine") {
            setResponses(response.data.data.pickupLines || []);
            setTranslatedText(response.data.data.translatedText || []);
            setFullPrompt(response.data.data.fullPrompt || null);
          } else if (selectedType === "ManualReply") {
            setResponses(response.data.data.reply || []);
            setTranslatedText(response.data.data.translatedText || []);
            setFullPrompt(response.data.data.fullPrompt || null);
          } else if (selectedType === "ScreenshotReply") {
            setResponses(response.data.data.reply.replies || []);
            setTranslatedText(response.data.data.reply.translatedText || []);
            setFullPrompt(response.data.data.reply.fullPrompt || null);
          }
          setOutput("Success: Response generated");
        }
      } else {
        setOutput("Error: Failed to fetch response");
        setSuccess(false);
        setResponses([]);
        setTranslatedText([]);
        setFullPrompt(null);
      }
    } catch (error) {
      console.error("API Error:", error);
      setOutput("Error: Something went wrong");
      setSuccess(false);
      setResponses(["Error: Something went wrong"]);
      setTranslatedText([]);
      setFullPrompt(null);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  };

  const togglePromptAccordion = () => {
    setPromptAccordionOpen(!promptAccordionOpen);
  };

  const toggleTranslatedAccordion = () => {
    setTranslatedAccordionOpen(!translatedAccordionOpen);
  };
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-800 to-gray-900 flex flex-col items-center justify-start p-4 sm:p-6">
      {/* Top Tabs */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-4xl flex flex-col sm:flex-row justify-center mb-6 space-y-2 sm:space-y-0 sm:space-x-2"
      >
        <button
          onClick={() => {
            setActiveTab("generator");
            resetGeneratorTab(); // <-- add this
          }}
          className={`w-full sm:w-auto px-4 py-2 text-sm sm:text-base font-medium rounded-lg sm:rounded-l-lg transition-all duration-300 ${
            activeTab === "generator"
              ? "bg-blue-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          Prompt Generator
        </button>
        <button
          onClick={() => {
            setActiveTab("templates");
            resetGeneratorTab();
          }}
          className={`w-full sm:w-auto px-4 py-2 text-sm sm:text-base font-medium rounded-lg sm:rounded-r-lg transition-all duration-300 ${
            activeTab === "templates"
              ? "bg-blue-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          Prompt Templates
        </button>
      </motion.div>

      {activeTab === "generator" && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-3xl bg-gray-800/90 backdrop-blur-md rounded-xl shadow-xl p-4 sm:p-6 border border-gray-700"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100 text-center mb-4 sm:mb-6">
            Prompt Generator
          </h2>

          {/* Type Selection */}
          <motion.div
            variants={itemVariants}
            className="mb-4 sm:mb-6 flex flex-wrap justify-center gap-2 sm:gap-3"
          >
            {["ScreenshotReply", "ManualReply", "GetPickUpLine"].map((type) => (
              <motion.button
                key={type}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleChange(setSelectedType, type)}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-medium text-xs sm:text-sm transition-all duration-300 min-w-[100px] ${
                  selectedType === type
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {type === "GetPickUpLine" ? "Get Pick Up Line" : type}
              </motion.button>
            ))}
          </motion.div>

          <div className="space-y-4 sm:space-y-6">
            {/* Grid for Input Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Gender Selection with isGenxz Checkbox */}
              <motion.div variants={itemVariants} className="space-y-3">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => handleChange(setGender, e.target.value)}
                    className="w-full px-3 py-1.5 sm:py-2 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                    required
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </select>
                </div>
                {gender === "MALE" && (
                  <motion.div
                    variants={itemVariants}
                    className="flex items-center"
                    whileHover={{
                      scale: 1.02,
                      transition: { duration: 0.2 },
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <input
                      type="checkbox"
                      checked={isGenxz}
                      onChange={(e) =>
                        handleChange(setIsGenxz, e.target.checked)
                      }
                      id="genz-checkbox"
                      className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 bg-gray-700 border-2 border-gray-500 rounded-md focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:ring-offset-gray-800 transition-all duration-200 ease-in-out cursor-pointer hover:border-blue-400"
                    />
                    <label
                      htmlFor="genz-checkbox"
                      className="ml-2 text-xs sm:text-sm font-medium text-gray-300 cursor-pointer hover:text-blue-400 transition-colors duration-200"
                    >
                      Gen Z Style
                    </label>
                  </motion.div>
                )}
              </motion.div>

              {/* Style Selection */}
              <motion.div variants={itemVariants}>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">
                  Style
                </label>
                <select
                  value={style}
                  onChange={(e) => handleChange(setStyle, e.target.value)}
                  className="w-full px-3 py-1.5 sm:py-2 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                  required
                >
                  {stylesOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </motion.div>

              {/* Language Selection */}
              <motion.div variants={itemVariants}>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => handleChange(setLanguage, e.target.value)}
                  className="w-full px-3 py-1.5 sm:py-2 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                  required
                >
                  <option value="en">English</option>
                  <option value="ar">Arabic</option>
                  <option value="arbz">Arabizi</option>
                </select>
              </motion.div>

              {/* Dialect Selection */}
              <motion.div variants={itemVariants}>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">
                  Dialect
                </label>
                <select
                  value={dialect}
                  onChange={(e) => handleChange(setDialect, e.target.value)}
                  className={`w-full px-3 py-1.5 sm:py-2 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm ${
                    language === "en" ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={language === "en"}
                  required
                >
                  {language === "en" && <option value="">None</option>}
                  <option value="LEVANTINE">Levantine</option>
                  <option value="EGYPTIAN">Egyptian</option>
                  <option value="GULF">Gulf</option>
                  <option value="IRAQI">Iraqi</option>
                  <option value="NORTH_AFRICAN">North African</option>
                </select>
                {language === "en" && (
                  <p className="text-xs text-gray-400 mt-1">
                    Dialect is disabled for English
                  </p>
                )}
              </motion.div>

              {/* Prompt Type Selection */}
              <motion.div variants={itemVariants}>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">
                  Prompt Type
                </label>
                <select
                  value={promptType}
                  onChange={(e) => handleChange(setPromptType, e.target.value)}
                  className="w-full px-3 py-1.5 sm:py-2 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                  required
                >
                  <option value="Optimized">Optimized</option>
                  <option value="Full prompt">Full Prompt</option>
                </select>
              </motion.div>
            </div>

            {/* Input Fields for ScreenshotReply and ManualReply */}
            {selectedType === "ScreenshotReply" && (
              <motion.div variants={itemVariants} className="mb-4 sm:mb-6">
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">
                  Upload Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-3 py-1.5 sm:py-2 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 file:mr-2 file:py-1 file:px-2 sm:file:mr-3 sm:file:py-1.5 sm:file:px-3 file:rounded-lg file:bg-blue-600 file:text-white file:border-0 hover:file:bg-blue-700 text-xs sm:text-sm"
                  required
                />
              </motion.div>
            )}

            {selectedType === "ManualReply" && (
              <div className="space-y-3 sm:space-y-4">
                <motion.div variants={itemVariants}>
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">
                    Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter your message..."
                    required
                    className="w-full h-16 sm:h-20 px-3 py-1.5 sm:py-2 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                  />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">
                    Context (Optional)
                  </label>
                  <textarea
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="Enter context (optional)..."
                    className="w-full h-16 sm:h-20 px-3 py-1.5 sm:py-2 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                  />
                </motion.div>
              </div>
            )}

            {/* Generate Button */}
            <motion.button
              variants={itemVariants}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 15px rgba(59, 130, 246, 0.4)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              disabled={
                loading ||
                (selectedType === "ManualReply" && !message.trim()) ||
                (selectedType === "ScreenshotReply" && !imageFile)
              }
              className={`w-full py-2 sm:py-3 rounded-lg font-medium text-sm sm:text-base shadow-md transition-all duration-300 touch-manipulation ${
                loading
                  ? "bg-blue-400 text-white cursor-not-allowed"
                  : (selectedType === "ManualReply" && !message.trim()) ||
                    (selectedType === "ScreenshotReply" && !imageFile)
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
              title={
                loading
                  ? "Generating..."
                  : selectedType === "ManualReply" && !message.trim()
                  ? "Please enter a message."
                  : selectedType === "ScreenshotReply" && !imageFile
                  ? "Please upload a screenshot."
                  : ""
              }
            >
              {loading ? "Generating..." : "Generate Prompt"}
            </motion.button>

            {/* API Response Display */}
            {success && (
              <motion.div
                variants={itemVariants}
                className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-700 rounded-lg text-gray-100 max-h-[60vh] sm:max-h-[70vh] overflow-y-auto hide-scrollbar"
              >
                <h3 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3">
                  API Response
                </h3>
                <div className="mb-3 sm:mb-4">
                  <motion.div
                    onClick={togglePromptAccordion}
                    whileHover={{
                      backgroundColor: "rgba(55, 65, 81, 0.8)",
                    }}
                    className="cursor-pointer p-2 sm:p-3 bg-gray-800 rounded-lg border border-gray-600 hover:border-gray-500 transition-all duration-300"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs sm:text-sm font-medium text-gray-300">
                        View Prompt Used
                      </h4>
                      <motion.span
                        animate={{ rotate: promptAccordionOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-gray-400"
                      >
                        ▼
                      </motion.span>
                    </div>
                  </motion.div>
                  <motion.div
                    initial={false}
                    animate={{
                      height: promptAccordionOpen ? "auto" : 0,
                      opacity: promptAccordionOpen ? 1 : 0,
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    {fullPrompt && (
                      <div className="mt-3 p-3 bg-gray-800 rounded-lg space-y-5 text-xs sm:text-sm text-gray-200">
                        {/* Role */}
                        <div>
                          <h5 className="text-sm sm:text-base font-semibold text-gray-100 mb-1">
                            Role
                          </h5>
                          <pre className="whitespace-pre-wrap text-gray-300">
                            {fullPrompt.role}
                          </pre>
                        </div>

                        {/* Message Type */}
                        <div>
                          <h5 className="text-sm sm:text-base font-semibold text-gray-100 mb-1">
                            Message Type
                          </h5>
                          <pre className="whitespace-pre-wrap text-gray-300">
                            {fullPrompt.messageType}
                          </pre>
                        </div>

                        {/* Style */}
                        <div>
                          <h5 className="text-sm sm:text-base font-semibold text-gray-100 mb-1">
                            Style
                          </h5>
                          <pre className="whitespace-pre-wrap text-gray-300">
                            {fullPrompt.style}
                          </pre>
                        </div>

                        {/* Language */}
                        <div>
                          <h5 className="text-sm sm:text-base font-semibold text-gray-100 mb-1">
                            Language
                          </h5>
                          <pre className="whitespace-pre-wrap text-gray-300">
                            {fullPrompt.language}
                          </pre>
                        </div>

                        {/* Dialect */}
                        <div>
                          <h5 className="text-sm sm:text-base font-semibold text-gray-100 mb-1">
                            Dialect
                          </h5>
                          <pre className="whitespace-pre-wrap text-gray-300">
                            {fullPrompt.dialect || "N/A"}
                          </pre>
                        </div>

                        {/* Gender */}
                        <div>
                          <h5 className="text-sm sm:text-base font-semibold text-gray-100 mb-1">
                            Gender
                          </h5>
                          <pre className="whitespace-pre-wrap text-gray-300">
                            {fullPrompt.gender}
                          </pre>
                        </div>

                        {/* User Instruction */}
                        <div>
                          <h5 className="text-sm sm:text-base font-semibold text-gray-100 mb-1">
                            User Instruction
                          </h5>
                          <pre className="whitespace-pre-wrap text-gray-300">
                            {fullPrompt.userInstruction}
                          </pre>
                        </div>

                        {/* Previous Replies */}
                        {fullPrompt.lastReplies && (
                          <div>
                            <h5 className="text-sm sm:text-base font-semibold text-gray-100 mb-1">
                              Previous Replies (last convo)
                            </h5>
                            <ul className="list-decimal list-inside space-y-1 text-gray-300">
                              {fullPrompt.lastReplies.map((reply, i) => (
                                <li key={i}>{reply}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                    Responses
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                    {responses.map((response, index) => (
                      <li
                        key={index}
                        className={`${
                          output.startsWith("Error:")
                            ? "text-red-400"
                            : "text-gray-100"
                        }`}
                      >
                        {response
                          .replace(/^\s*"\d+\.\s*|\s*"$/, "")
                          .replace(/^"|"$/g, "")
                          .trim()}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Translated Text Display - Only for ar and arbz languages */}
                {(language === "ar" || language === "arbz") &&
                  translatedText.length > 0 && (
                    <div className="mt-3 sm:mt-4">
                      <motion.div
                        onClick={toggleTranslatedAccordion}
                        whileHover={{
                          backgroundColor: "rgba(55, 65, 81, 0.8)",
                        }}
                        className="cursor-pointer p-2 sm:p-3 bg-gray-800 rounded-lg border border-gray-600 hover:border-gray-500 transition-all duration-300"
                      >
                        <div className="flex justify-between items-center">
                          <h4 className="text-xs sm:text-sm font-medium text-gray-300">
                            View Translated Text (English)
                          </h4>
                          <motion.span
                            animate={{
                              rotate: translatedAccordionOpen ? 180 : 0,
                            }}
                            transition={{ duration: 0.3 }}
                            className="text-gray-400"
                          >
                            ▼
                          </motion.span>
                        </div>
                      </motion.div>
                      <motion.div
                        initial={false}
                        animate={{
                          height: translatedAccordionOpen ? "auto" : 0,
                          opacity: translatedAccordionOpen ? 1 : 0,
                        }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="mt-2 p-2 sm:p-3 bg-gray-800 rounded-lg">
                          <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                            {translatedText.map((translation, index) => (
                              <li key={index} className="text-gray-100">
                                {translation
                                  .replace(/^\s*"\d+\.\s*|\s*"$/, "")
                                  .replace(/^"|"$/g, "")
                                  .trim()}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    </div>
                  )}
              </motion.div>
            )}
          </div>
        </motion.div>
      )}

      {activeTab === "templates" && (
        <motion.div
          variants={itemVariants}
          className="w-full max-w-4xl text-center text-gray-300 text-sm sm:text-base"
        >
          <PromptTemplates />
        </motion.div>
      )}

      {loading && <TypingLoader />}
    </div>
  );
};

export default PromptGenerator;
