import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { postApi } from "../utils/api";
import { URLS } from "../utils/urls";
import { toast } from "sonner";
import TypingLoader from "../utils/Lodaer";

interface ConvoGeneratorProps {
  setGlobalLoading: (loading: boolean) => void;
}

const ConvoGenerator: React.FC<ConvoGeneratorProps> = ({
  setGlobalLoading,
}) => {
  const [maleName, setMaleName] = useState("");
  const [femaleName, setFemaleName] = useState("");
  const [language, setLanguage] = useState("english");
  const [dialect, setDialect] = useState("");
  const [tone, setTone] = useState("flirty");
  const [scenarioCategory, setScenarioCategory] = useState("flirting_rizzing");
  const [scenarioSub, setScenarioSub] = useState("");
  const [relationshipLevel, setRelationshipLevel] = useState("situationship");
  const [conversationLength, setConversationLength] = useState("medium");
  const [isGenZ, setIsGenZ] = useState(false);
  const [personaDirection, setPersonaDirection] = useState("male_to_female");

  const [conversation, setConversation] = useState<string[]>([]);
  const [systemPrompt, setSystemPrompt] = useState("");
  const [metaData, setMetaData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [customMin, setCustomMin] = useState("");
  const [customMax, setCustomMax] = useState("");

  // Options (synced with JSON)
  const languages = [
    { value: "english", label: "English" },
    { value: "arabic", label: "Arabic" },
    { value: "arabizi", label: "Arabizi" },
  ];
  const dialects = [
    { value: "levantine", label: "Levantine" },
    { value: "egyptian", label: "Egyptian" },
    { value: "gulf", label: "Gulf" },
    { value: "iraqi", label: "Iraqi" },
    { value: "north_african", label: "North African" },
  ];
  const tones = [
    "confident",
    "flirty",
    "playful",
    "conservative",
    "romantic",
    "dramatic",
  ];
  const scenarios: Record<string, string[]> = {
    first_impressions: [
      "first_time_texting",
      "matched_on_app",
      "intro_via_friend",
      "slid_into_dms",
      "met_after_wedding",
    ],
    flirting_rizzing: [
      "dry_convo_recovery",
      "ghosted_and_back",
      "she_teasing_you",
      "you_teasing_her",
      "late_night_texting",
    ],
    situationship_vibes: [
      "you_both_like_each_other",
      "shes_testing_seriousness",
      "talking_but_distant",
    ],
    emotional_real_talk: [
      "family_expectations",
      "she_doesnt_trust_men",
      "you_opened_up_she_quiet",
    ],
  };
  const relationshipLevels = [
    "never_spoken",
    "acquaintance",
    "new_interest",
    "talking_stage",
    "situationship",
    "lowkey_dating",
    "public_serious",
    "post_drama_recovery",
    "long_term_relationship",
  ];
  const conversationLengths = ["short", "medium", "long", "custom"];

const maleNames = [
  "Omar", "Ali", "Yousef", "Hassan", "Khalid", "Zaid", "Tariq", "Fahad",
  "Sultan", "Rashid", "Amir", "Bilal", "Nasser", "Abdullah", "Ibrahim",
  "Sami", "Kareem", "Jamal", "Hamza", "Faisal", "Mansoor", "Tamer",
  "Majid", "Zain", "Saif", "Adnan", "Basim", "Rami", "Nabil", "Imran",
  "Farid", "Harith", "Talal", "Dmitri", "Ivan", "Alexei", "Nikolai", "Sergei", "Mikhail", "Yuri", "Vladimir", "Oleg", "Pavel", "Boris", "Andrei", "Konstantin", "Roman", "Artem", "Grigori", "Viktor", "Anton", "Leonid", "Fyodor", "Egor", "Ruslan", "Kirill", "Ilya", "Stanislav", "Maxim", "Timofey", "Denis", "Stepan", "Gennadi", "Igor", "Anatoly", "Valentin", "James", "Oliver", "William", "Henry", "George", "Edward", "Harry", "Jack", "Thomas", "Samuel", "Charles", "Alexander", "Daniel", "Benjamin", "Liam", "Noah", "Lucas", "Ethan", "Jacob", "Nathan", "Leo", "Finn", "Oscar", "Arthur", "Matthew", "Isaac", "Harrison", "Adam", "Ryan", "Callum", "Jamie", "Joseph", "Owen", "Luke"
];

const femaleNames = [
  "Layla", "Nour", "Aisha", "Hana", "Rania", "Mariam", "Fatima", "Sara",
  "Huda", "Amira", "Yasmin", "Salma", "Lina", "Zara", "Dina", "Reem",
  "Asma", "Laila", "Najwa", "Noor", "Muna", "Samar", "Aaliyah", "Iman",
  "Ruqayyah", "Nadia", "Sahar", "Farah", "Rima", "Amal", "Zainab", "Leen",
  "Basma", "Anastasia", "Natalia", "Svetlana", "Ekaterina", "Irina", "Olga",
  "Tatiana", "Maria", "Yelena", "Daria", "Valeria", "Polina", "Galina",
  "Ksenia", "Yulia", "Veronika", "Nadezhda", "Viktoria", "Larisa", "Marina",
  "Ludmila", "Alina", "Oksana", "Elvira", "Zoya", "Milana", "Yana", "Vera",
  "Elena", "Taisiya", "Dina", "Karina", "Nina", "Emily", "Sophia", "Olivia", "Amelia", "Charlotte", "Isabella", "Grace", "Chloe", "Ella", "Mia", "Lily", "Ava", "Freya", "Harper", "Sophie", "Emma", "Isla", "Lucy", "Ruby", "Hannah", "Alice", "Zoe", "Scarlett", "Molly", "Evelyn", "Florence", "Georgia", "Daisy", "Jessica", "Poppy",
  "Lottie", "Phoebe", "Rosie", "Elsie"
];

  const generateRandomNames = () => {
    const randomMale = maleNames[Math.floor(Math.random() * maleNames.length)];
    const randomFemale =
      femaleNames[Math.floor(Math.random() * femaleNames.length)];
    setMaleName(randomMale);
    setFemaleName(randomFemale);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!maleName.trim()) newErrors.maleName = "Male name is required";
    if (!femaleName.trim()) newErrors.femaleName = "Female name is required";
    if (!language) newErrors.language = "Language is required";
    if ((language === "arabic" || language === "arabizi") && !dialect)
      newErrors.dialect = "Dialect is required";
    if (!tone) newErrors.tone = "Tone is required";
    if (!scenarioCategory)
      newErrors.scenarioCategory = "Scenario category is required";
    if (!scenarioSub)
      newErrors.scenarioSub = "Scenario subcategory is required";
    if (!relationshipLevel)
      newErrors.relationshipLevel = "Relationship level is required";
    if (!conversationLength)
      newErrors.conversationLength = "Conversation length is required";
    if (conversationLength === "custom") {
      if (!customMin) newErrors.customMin = "Min messages required";
      if (!customMax) newErrors.customMax = "Max messages required";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fill all required fields");
      return false;
    }
    return true;
  };

  const handleGenerate = async () => {
    if (!validateForm()) return;
    setLoading(true);
    setGlobalLoading(true); // ← Use global
    setConversation([]);
    setSystemPrompt("");
    setMetaData(null);

    try {
      const body = {
        maleName,
        femaleName,
        maleLanguage: language,
        femaleLanguage: language,
        maleDialect: language === "english" ? "" : dialect,
        femaleDialect: language === "english" ? "" : dialect,
        maleTone: tone,
        femaleTone: tone,
        scenarioCategory,
        scenarioSubCategory: scenarioSub,
        relationshipLevel,
        personaDirection,
        isGenZ,
        conversationLength,
        ...(conversationLength === "custom" && {
          customMin: Number(customMin),
          customMax: Number(customMax),
        }),
      };

      const res = await postApi(URLS.generateConversation, body);
      if (res?.data?.success) {
        const data = res.data.data;
        const convoArray = data.generatedConversation
          .split("\n")
          .filter((line: string) => line.trim() !== "");
        setConversation(convoArray);
        setSystemPrompt(data.systemPrompt || "");
        setMetaData({
          model: data.gptModel,
          temperature: data.temperature,
          tokens: data.tokenUsage?.totalTokens,
          cost: data.tokenUsage?.estimatedCost,
        });
        toast.success("Conversation generated successfully!");
      } else {
        toast.error("Failed to generate conversation");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error generating conversation");
    } finally {
      setLoading(false);
      setGlobalLoading(false); 
    }
  };

  return (
    <div className="min-h-screen  py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full bg-gradient-to-br from-gray-800 to-gray-900 text-gray-100 rounded-3xl shadow-2xl p-6 sm:p-10 max-w-5xl mx-auto border border-gray-700/50 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-10 text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Conversation Generator
          </h2>
          <p className="text-gray-400 text-sm">
            Create authentic conversations with AI-powered generation
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8 flex justify-start"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generateRandomNames}
            className="px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg flex items-center gap-3 text-sm  "
          >
            <span>Pick Random Names</span>
          </motion.button>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.06 } },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <label className="block text-sm font-medium text-gray-300 mb-2 text-start">
              {" "}
              Male Name
            </label>
            <input
              type="text"
              value={maleName}
              onChange={(e) => setMaleName(e.target.value)}
              className="p-3 bg-gray-700/50 rounded-xl focus:ring-2 focus:ring-blue-500 w-full outline-none border border-gray-600/50 hover:border-blue-500/50 backdrop-blur-sm transition-all"
              placeholder="Enter Male Name"
            />
            <AnimatePresence>
              {errors.maleName && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-red-400 mt-1"
                >
                  {errors.maleName}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <label className="block text-sm font-medium text-gray-300 mb-2 text-start">
              {" "}
              Female Name
            </label>
            <input
              type="text"
              value={femaleName}
              onChange={(e) => setFemaleName(e.target.value)}
              className="p-3 bg-gray-700/50 rounded-xl focus:ring-2 focus:ring-pink-500 w-full outline-none border border-gray-600/50 hover:border-pink-500/50 backdrop-blur-sm transition-all"
              placeholder="Enter Female Name"
            />
            <AnimatePresence>
              {errors.femaleName && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-red-400 mt-1"
                >
                  {errors.femaleName}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 flex items-center justify-between"
          >
            <label className="block text-sm font-medium text-gray-300 text-start">
              Gen Z Mode
            </label>
            <div className="flex justify-start">
              <button
                onClick={() => setIsGenZ(!isGenZ)}
                className={`relative w-16 h-8 rounded-full transition-all duration-300 shadow-inner ${
                  isGenZ
                    ? "bg-gradient-to-r from-green-400 to-emerald-500"
                    : "bg-gray-600"
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-lg transition-transform duration-300 ${
                    isGenZ ? "translate-x-8" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <label className="block text-sm font-medium text-gray-300 mb-3 text-start">
              Direction
            </label>
            <select
              value={personaDirection}
              onChange={(e) => setPersonaDirection(e.target.value)}
              className="w-full p-3 bg-gray-700/60 rounded-lg border border-gray-600 focus:ring-2 focus:ring-purple-400 focus:outline-none cursor-pointer text-sm"
            >
              <option value="male_to_female">Male to Female</option>
              <option value="female_to_male">Female to Male</option>
            </select>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <label className="block text-sm font-medium text-gray-300 mb-2 text-start">
              Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="p-3 bg-gray-700/50 rounded-xl w-full outline-none transition-all duration-300 border border-gray-600/50 hover:border-purple-500/50 focus:ring-2 focus:ring-purple-500 cursor-pointer"
            >
              {languages.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <label className="block text-sm font-medium text-gray-300 mb-2 text-start">
              Dialect
            </label>
            <select
              value={dialect}
              onChange={(e) => setDialect(e.target.value)}
              disabled={language === "english"}
              className={`p-3 rounded-xl w-full outline-none transition-all duration-300 border ${
                language === "english"
                  ? "bg-gray-600/30 text-gray-500 cursor-not-allowed border-gray-600/30"
                  : "bg-gray-700/50 border-gray-600/50 hover:border-purple-500/50 focus:ring-2 focus:ring-purple-500 cursor-pointer"
              }`}
            >
              <option value="">Select Dialect</option>
              {dialects.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <label className="block text-sm font-medium text-gray-300 mb-2 text-start">
              Category (Scenario)
            </label>
            <select
              value={scenarioCategory}
              onChange={(e) => {
                setScenarioCategory(e.target.value);
                setScenarioSub("");
              }}
              className="p-3 bg-gray-700/50 rounded-xl w-full outline-none transition-all duration-300 border border-gray-600/50 hover:border-blue-500/50 focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {Object.keys(scenarios).map((cat) => (
                <option key={cat} value={cat}>
                  {cat
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </option>
              ))}
            </select>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <label className="block text-sm font-medium text-gray-300 mb-2 text-start">
              Sub-Category
            </label>
            <select
              value={scenarioSub}
              onChange={(e) => setScenarioSub(e.target.value)}
              disabled={!scenarioCategory}
              className={`p-3 rounded-xl w-full outline-none transition-all duration-300 border ${
                !scenarioCategory
                  ? "bg-gray-600/30 text-gray-500 cursor-not-allowed border-gray-600/30"
                  : "bg-gray-700/50 border-gray-600/50 hover:border-blue-500/50 focus:ring-2 focus:ring-blue-500 cursor-pointer"
              }`}
            >
              <option value="">Select Subcategory</option>
              {scenarioCategory &&
                scenarios[scenarioCategory].map((sub) => (
                  <option key={sub} value={sub}>
                    {sub
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </option>
                ))}
            </select>
            <AnimatePresence>
              {errors.scenarioSub && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs text-red-400 mt-1"
                >
                  {errors.scenarioSub}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <label className="block text-sm font-medium text-gray-300 mb-2 text-start">
              Tone
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="p-3 bg-gray-700/50 rounded-xl w-full outline-none transition-all duration-300 border border-gray-600/50 hover:border-pink-500/50 focus:ring-2 focus:ring-pink-500 cursor-pointer"
            >
              {tones.map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <label className="block text-sm font-medium text-gray-300 mb-2 text-start">
              Relationship Level
            </label>
            <select
              value={relationshipLevel}
              onChange={(e) => setRelationshipLevel(e.target.value)}
              className="p-3 bg-gray-700/50 rounded-xl w-full outline-none transition-all duration-300 border border-gray-600/50 hover:border-pink-500/50 focus:ring-2 focus:ring-pink-500 cursor-pointer"
            >
              {relationshipLevels.map((level) => (
                <option key={level} value={level}>
                  {level
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </option>
              ))}
            </select>
          </motion.div>

       {/* Conversation Length - Full Width, Perfect Alignment */}
<motion.div
  variants={{
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }}
  className="col-span-1 sm:col-span-2"
>
  <label className="block text-sm font-medium text-gray-300 mb-3 text-start">
   Conversation Length
  </label>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {/* Length Selector - Always 50% */}
    <div className="sm:col-span-1">
      <select
        value={conversationLength}
        onChange={(e) => setConversationLength(e.target.value)}
        className="w-full p-3 bg-gray-700/50 rounded-xl outline-none border border-gray-600/50 hover:border-purple-500/50 focus:ring-2 focus:ring-purple-500 cursor-pointer transition-all"
      >
        {conversationLengths.map((len) => (
          <option key={len} value={len}>
            {len.charAt(0).toUpperCase() + len.slice(1)}
          </option>
        ))}
      </select>
    </div>

    {/* Custom Inputs - Only show when "custom", takes exact 50% */}
    <AnimatePresence>
      {conversationLength === "custom" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="sm:col-span-1 flex gap-3"
        >
          <input
            type="number"
            min="1"
            placeholder="Min"
            value={customMin}
            onChange={(e) => setCustomMin(e.target.value)}
            className="w-full p-3 bg-gray-700/50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600/50 hover:border-blue-500/50 transition-all text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <input
            type="number"
            min="1"
            placeholder="Max"
            value={customMax}
            onChange={(e) => setCustomMax(e.target.value)}
            className="w-full p-3 bg-gray-700/50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600/50 hover:border-blue-500/50 transition-all text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
        </motion.div>
      )}
    </AnimatePresence>

    {/* Placeholder to maintain layout when not custom */}
    {conversationLength !== "custom" && (
      <div className="hidden sm:block sm:col-span-1">
        {/* Invisible spacer to keep grid balanced */}
      </div>
    )}
  </div>

  {/* Error Message */}
  <AnimatePresence>
    {(errors.customMin || errors.customMax) && (
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="text-xs text-red-400 mt-2 text-start"
      >
        {errors.customMin} {errors.customMax && `• ${errors.customMax}`}
      </motion.p>
    )}
  </AnimatePresence>
</motion.div>
        </motion.div>

        <motion.button
          onClick={handleGenerate}
          disabled={loading}
          whileHover={{
            scale: loading ? 1 : 1.05,
            boxShadow: "0 0 15px rgba(59, 130, 246, 0.4)",
          }}
          whileTap={{ scale: loading ? 1 : 0.95 }}
          className={`w-full py-4 rounded-xl font-semibold text-base shadow-md transition-all duration-300 ${
            loading
              ? "bg-blue-400 text-white cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {loading ? "Generating..." : "Generate Conversation"}
        </motion.button>

        {systemPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 text-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowPrompt(!showPrompt)}
              className="text-sm text-blue-400 hover:text-blue-300 underline focus:outline-none transition-colors duration-200 font-medium"
            >
              {showPrompt ? "Hide Prompt Context ▲" : "Show Prompt Context ▼"}
            </motion.button>

            <AnimatePresence>
              {showPrompt && (
                <motion.pre
                  initial={{ opacity: 0, height: 0, y: -20 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-900/80 backdrop-blur-sm text-gray-200 mt-4 p-5 rounded-xl text-xs sm:text-sm border border-gray-700/50 max-h-64 overflow-y-auto overflow-x-hidden whitespace-pre-wrap break-words shadow-inner select-text cursor-text"
                  style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: "#4B5563 transparent",
                  }}
                >
                  {systemPrompt}
                </motion.pre>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        <AnimatePresence>
          {conversation.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="mt-8 bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl max-h-[500px] overflow-y-auto space-y-4"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#4B5563 transparent",
              }}
            >
              <motion.h3
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-lg font-semibold text-center mb-4 bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent"
              >
                Generated Conversation
              </motion.h3>
              {conversation.map((msg, i) => {
                const isMale = msg.trim().startsWith(maleName);
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: isMale ? -50 : 50, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{
                      duration: 0.4,
                      delay: i * 0.1,
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                    }}
                    className={`flex ${
                      isMale ? "justify-start" : "justify-end"
                    }`}
                  >
                    <motion.div
                      whileHover={{
                        y: -2,
                        boxShadow: isMale
                          ? "0 8px 20px rgba(59, 130, 246, 0.4)"
                          : "0 8px 20px rgba(236, 72, 153, 0.4)",
                      }}
                      className={`px-5 py-3 rounded-2xl max-w-[80%] sm:max-w-[70%] text-sm sm:text-base relative cursor-text select-text ${
                        isMale
                          ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-900/50"
                          : "bg-gradient-to-br from-pink-600 to-pink-700 text-white shadow-lg shadow-pink-900/50"
                      }`}
                    >
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.1 + 0.2 }}
                        className="select-text"
                      >
                        {msg}
                      </motion.div>
                      <div
                        className={`absolute inset-0 rounded-2xl opacity-0 hover:opacity-20 transition-opacity duration-300 pointer-events-none ${
                          isMale ? "bg-blue-400" : "bg-pink-400"
                        }`}
                      />
                    </motion.div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {metaData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-xs sm:text-sm text-gray-400 text-center bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/30"
          >
            <p className="flex flex-wrap justify-center gap-x-4 gap-y-2">
              <span className="text-blue-400 font-medium">Model:</span>
              <span>{metaData.model}</span>
              <span className="text-purple-400">•</span>
              <span className="text-blue-400 font-medium">Temp:</span>
              <span>{metaData.temperature}</span>
              <span className="text-purple-400">•</span>
              <span className="text-blue-400 font-medium">Tokens:</span>
              <span>{metaData.tokens}</span>
              <span className="text-purple-400">•</span>
              <span className="text-blue-400 font-medium">Est. Cost:</span>
              <span className="text-green-400">
                ${metaData.cost?.toFixed(6)}
              </span>
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ConvoGenerator;
