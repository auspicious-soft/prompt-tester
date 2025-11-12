import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getApi, postApi } from "../utils/api";
import { URLS } from "../utils/urls";
import { toast } from "sonner";
import ConversationPromptEditor from "../utils/ConversationPromptEditor";

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
  const [scenarioCategory, setScenarioCategory] = useState("");
  const [relationshipLevel, setRelationshipLevel] = useState("");
  const [conversationLength, setConversationLength] = useState("");
  const [selectedLengthObj, setSelectedLengthObj] = useState<any>(null);
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
  const [editMode, setEditMode] = useState(false);
  const [promptAccordionOpen, setPromptAccordionOpen] = useState(false);
  const [inputAccordionOpen, setInputAccordionOpen] = useState(false);
  const [outputAccordionOpen, setOutputAccordionOpen] = useState(false);
  const [aiInput, setAiInput] = useState<any>(null);
  const [aiOutput, setAiOutput] = useState<any>(null);
  const [promptUsed, setPromptUsed] = useState<any>(null);
  const [customScenario, setCustomScenario] = useState("");
  const [customRelationshipLevel, setCustomRelationshipLevel] = useState("");
  const [selectedScenario, setSelectedScenario] = useState<any>(null);
  const [selectedRelationshipLevel, setSelectedRelationshipLevel] =
    useState<any>(null);
  // API Data
  const [scenariosData, setScenariosData] = useState<any[]>([]);
  const [relationshipLevelsData, setRelationshipLevelsData] = useState<any[]>(
    []
  );
  const [conversationLengthsData, setConversationLengthsData] = useState<any[]>(
    []
  );

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
  ];

  const maleNames = [
    "Omar",
    "Ali",
    "Yousef",
    "Hassan",
    "Khalid",
    "Zaid",
    "Tariq",
    "Fahad",
    "Sultan",
    "Rashid",
    "Amir",
    "Bilal",
    "Nasser",
    "Abdullah",
    "Ibrahim",
    "Sami",
    "Kareem",
    "Jamal",
    "Hamza",
    "Faisal",
    "Mansoor",
    "Tamer",
    "Majid",
    "Zain",
    "Saif",
    "Adnan",
    "Basim",
    "Rami",
    "Nabil",
    "Imran",
    "Farid",
    "Harith",
    "Talal",
    "Dmitri",
    "Ivan",
    "Alexei",
    "Nikolai",
    "Sergei",
    "Mikhail",
    "Yuri",
    "Vladimir",
    "Oleg",
    "Pavel",
    "Boris",
    "Andrei",
    "Konstantin",
    "Roman",
    "Artem",
    "Grigori",
    "Viktor",
    "Anton",
    "Leonid",
    "Fyodor",
    "Egor",
    "Ruslan",
    "Kirill",
    "Ilya",
    "Stanislav",
    "Maxim",
    "Timofey",
    "Denis",
    "Stepan",
    "Gennadi",
    "Igor",
    "Anatoly",
    "Valentin",
    "James",
    "Oliver",
    "William",
    "Henry",
    "George",
    "Edward",
    "Harry",
    "Jack",
    "Thomas",
    "Samuel",
    "Charles",
    "Alexander",
    "Daniel",
    "Benjamin",
    "Liam",
    "Noah",
    "Lucas",
    "Ethan",
    "Jacob",
    "Nathan",
    "Leo",
    "Finn",
    "Oscar",
    "Arthur",
    "Matthew",
    "Isaac",
    "Harrison",
    "Adam",
    "Ryan",
    "Callum",
    "Jamie",
    "Joseph",
    "Owen",
    "Luke",
  ];

  const femaleNames = [
    "Layla",
    "Nour",
    "Aisha",
    "Hana",
    "Rania",
    "Mariam",
    "Fatima",
    "Sara",
    "Huda",
    "Amira",
    "Yasmin",
    "Salma",
    "Lina",
    "Zara",
    "Dina",
    "Reem",
    "Asma",
    "Laila",
    "Najwa",
    "Noor",
    "Muna",
    "Samar",
    "Aaliyah",
    "Iman",
    "Ruqayyah",
    "Nadia",
    "Sahar",
    "Farah",
    "Rima",
    "Amal",
    "Zainab",
    "Leen",
    "Basma",
    "Anastasia",
    "Natalia",
    "Svetlana",
    "Ekaterina",
    "Irina",
    "Olga",
    "Tatiana",
    "Maria",
    "Yelena",
    "Daria",
    "Valeria",
    "Polina",
    "Galina",
    "Ksenia",
    "Yulia",
    "Veronika",
    "Nadezhda",
    "Viktoria",
    "Larisa",
    "Marina",
    "Ludmila",
    "Alina",
    "Oksana",
    "Elvira",
    "Zoya",
    "Milana",
    "Yana",
    "Vera",
    "Elena",
    "Taisiya",
    "Dina",
    "Karina",
    "Nina",
    "Emily",
    "Sophia",
    "Olivia",
    "Amelia",
    "Charlotte",
    "Isabella",
    "Grace",
    "Chloe",
    "Ella",
    "Mia",
    "Lily",
    "Ava",
    "Freya",
    "Harper",
    "Sophie",
    "Emma",
    "Isla",
    "Lucy",
    "Ruby",
    "Hannah",
    "Alice",
    "Zoe",
    "Scarlett",
    "Molly",
    "Evelyn",
    "Florence",
    "Georgia",
    "Daisy",
    "Jessica",
    "Poppy",
    "Lottie",
    "Phoebe",
    "Rosie",
    "Elsie",
  ];

  const togglePromptAccordion = () =>
    setPromptAccordionOpen(!promptAccordionOpen);
  const toggleInputAccordion = () => setInputAccordionOpen(!inputAccordionOpen);
  const toggleOutputAccordion = () =>
    setOutputAccordionOpen(!outputAccordionOpen);

  // Fetch API data on mount
  useEffect(() => {
    const fetchPromptsData = async () => {
      try {
        const res = await getApi(URLS.getMergedConvoData);
        if (res?.status === 200) {
          const data = res.data.data;
          setScenariosData(data.scenarios || []);
          setRelationshipLevelsData(data.relationshipLevels || []);
          setConversationLengthsData(data.conversationLengths || []);

          // Set defaults
          const defaultScenario = data.scenarios?.[0];
          const defaultRelationship = data.relationshipLevels?.[0];
          const defaultLength = data.conversationLengths?.[0];

          if (defaultScenario) {
            setScenarioCategory(defaultScenario._id);
            setSelectedScenario(defaultScenario);
          }
          if (defaultRelationship) {
            setRelationshipLevel(defaultRelationship._id);
            setSelectedRelationshipLevel(defaultRelationship);
          }
          if (defaultLength) {
            setConversationLength(defaultLength._id);
            setSelectedLengthObj(defaultLength);
          }
        } else {
          toast.error("Failed to fetch prompts data");
        }
      } catch (err) {
        console.error(err);
        toast.error("Error fetching prompts data");
      }
    };

    fetchPromptsData();
  }, []);

  const generateRandomNames = () => {
    const randomMale = maleNames[Math.floor(Math.random() * maleNames.length)];
    const randomFemale =
      femaleNames[Math.floor(Math.random() * femaleNames.length)];
    setMaleName(randomMale);
    setFemaleName(randomFemale);
  };

  const handleEditPrompt = () => {
    setEditMode(true);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!maleName.trim()) newErrors.maleName = "Male name is required";
    if (!femaleName.trim()) newErrors.femaleName = "Female name is required";
    if (!language) newErrors.language = "Language is required";
    if ((language === "arabic" || language === "arabizi") && !dialect)
      newErrors.dialect = "Dialect is required";
    if (!tone) newErrors.tone = "Tone is required";
    if (!scenarioCategory) newErrors.scenarioCategory = "Scenario is required";
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
    setGlobalLoading(true);
    setConversation([]);
    setSystemPrompt("");
    setMetaData(null);
    setAiInput(null);
    setAiOutput(null);
    setPromptUsed(null);
    setPromptAccordionOpen(false);
    setInputAccordionOpen(false);
    setOutputAccordionOpen(false);
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
        customScenario: selectedScenario?.value === "custom" ? customScenario : undefined,
        relationshipLevel,
        customRelationshipLevel: selectedRelationshipLevel?.value === "custom" ? customRelationshipLevel : undefined,
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
        setAiInput(data.input || null);
        setAiOutput(data.output || null);
        setPromptUsed(data.promptUsed || null);
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


  const selectedConversationLength = conversationLengthsData.find(
    (len) => len.value === conversationLength
  );

  return (
    <div className="min-h-screen py-8 px-4">
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

     
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-8 flex justify-between"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={generateRandomNames}
                className="px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg flex items-center gap-3 text-sm"
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
              {/* Gen Z Mode */}
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
              </motion.div>

              {/* Direction */}
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

              {/* Male Name */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <label className="block text-sm font-medium text-gray-300 mb-2 text-start">
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

              {/* Female Name */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <label className="block text-sm font-medium text-gray-300 mb-2 text-start">
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

              {/* Language */}
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

              {/* Dialect */}
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

              {/* Tone */}
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
                className="sm:col-span-1"
              >
                <label className="block text-sm font-medium text-gray-300 mb-2 text-start">
                  Scenario
                </label>

                <select
                  value={scenarioCategory}
                  onChange={(e) => {
                    const id = e.target.value;
                    setScenarioCategory(id);
                    const sel = scenariosData.find((s) => s._id === id);
                    setSelectedScenario(sel || null);
                    if (sel?.value !== "custom") setCustomScenario("");
                  }}
                  className="p-3 bg-gray-700/50 rounded-xl w-full outline-none transition-all duration-300 border border-gray-600/50 hover:border-blue-500/50 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="">Select Scenario</option>
                  {scenariosData.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.title}
                    </option>
                  ))}
                </select>

                {/* Errors for the select */}
                <AnimatePresence>
                  {errors.scenarioCategory && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs text-red-400 mt-1"
                    >
                      {errors.scenarioCategory}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              <AnimatePresence>
                {selectedScenario?.value === "custom" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="sm:col-span-2 mt-3"
                  >
                    <textarea
                      placeholder="Enter your custom scenario..."
                      value={customScenario}
                      onChange={(e) => setCustomScenario(e.target.value)}
                      className="w-full h-24 p-3 bg-gray-700/50 rounded-xl outline-none border border-gray-600/50 hover:border-blue-500/50 focus:ring-2 focus:ring-blue-500 transition-all resize-y text-sm"
                      rows={4}
                    />

                    {/* Errors for the custom textarea */}
                    <AnimatePresence>
                      {errors.customScenario && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-xs text-red-400 mt-1"
                        >
                          {errors.customScenario}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ---------- Relationship Level ---------- */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="sm:col-span-1"
              >
                <label className="block text-sm font-medium text-gray-300 mb-2 text-start">
                  Relationship Level
                </label>

                <select
                  value={relationshipLevel}
                  onChange={(e) => {
                    const id = e.target.value;
                    setRelationshipLevel(id);
                    const sel = relationshipLevelsData.find(
                      (r) => r._id === id
                    );
                    setSelectedRelationshipLevel(sel || null);
                    if (sel?.value !== "custom") setCustomRelationshipLevel("");
                  }}
                  className="w-full p-3 bg-gray-700/50 rounded-xl outline-none transition-all duration-300 border border-gray-600/50 hover:border-pink-500/50 focus:ring-2 focus:ring-pink-500 cursor-pointer"
                >
                  <option value="">Select Relationship Level</option>
                  {relationshipLevelsData.map((l) => (
                    <option key={l._id} value={l._id}>
                      {l.title}
                    </option>
                  ))}
                </select>

                {/* Errors for the select */}
                <AnimatePresence>
                  {errors.relationshipLevel && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs text-red-400 mt-1"
                    >
                      {errors.relationshipLevel}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

        
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="sm:col-span-1"
              >
                <label className="block text-sm font-medium text-gray-300 mb-3 text-start">
                  Conversation Length
                  {/* Show range only for preset lengths */}
                  {selectedLengthObj?.range?.length > 0 &&
                    selectedLengthObj?.value !== "custom" && (
                      <span className="text-xs text-gray-400 ml-2">
                        ({selectedLengthObj.range[0]} -{" "}
                        {selectedLengthObj.range[1]} messages)
                      </span>
                    )}
                </label>

                {/* ---- selector ---- */}
                <select
                  value={conversationLength}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    setConversationLength(selectedId);

                    const selected = conversationLengthsData.find(
                      (l) => l._id === selectedId
                    );
                    setSelectedLengthObj(selected || null);

                    // Reset custom fields if not custom
                    if (!selected || selected.value !== "custom") {
                      setCustomMin("");
                      setCustomMax("");
                    }
                  }}
                  className="w-full p-3 bg-gray-700/50 rounded-xl outline-none border border-gray-600/50 hover:border-purple-500/50 focus:ring-2 focus:ring-purple-500 cursor-pointer transition-all"
                >
                  <option value="">Select Length</option>
                  {conversationLengthsData.map((len) => (
                    <option key={len._id} value={len._id}>
                      {len.title}
                    </option>
                  ))}
                </select>

                {/* ---- custom min / max (always rendered, AnimatePresence handles show/hide) ---- */}
                <AnimatePresence>
                  {selectedLengthObj?.value === "custom" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="mt-3 grid grid-cols-2 gap-3"
                    >
                      <input
                        type="number"
                        min="1"
                        placeholder="Min"
                        value={customMin}
                        onChange={(e) => setCustomMin(e.target.value)}
                        className="p-3 bg-gray-700/50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600/50 hover:border-blue-500/50 transition-all text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      />
                      <input
                        type="number"
                        min="1"
                        placeholder="Max"
                        value={customMax}
                        onChange={(e) => setCustomMax(e.target.value)}
                        className="p-3 bg-gray-700/50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600/50 hover:border-blue-500/50 transition-all text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ---- errors ---- */}
                <AnimatePresence>
                  {(errors.conversationLength ||
                    errors.customMin ||
                    errors.customMax) && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-xs text-red-400 mt-2 text-start"
                    >
                      {errors.conversationLength || errors.customMin}{" "}
                      {errors.customMax && `• ${errors.customMax}`}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

                  <AnimatePresence>
                {selectedRelationshipLevel?.value === "custom" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="sm:col-span-2 mt-3"
                  >
                    <textarea
                      placeholder="Enter your custom relationship level..."
                      value={customRelationshipLevel}
                      onChange={(e) =>
                        setCustomRelationshipLevel(e.target.value)
                      }
                      className="w-full h-24 p-3 bg-gray-700/50 rounded-xl outline-none border border-gray-600/50 hover:border-pink-500/50 focus:ring-2 focus:ring-pink-500 transition-all resize-y text-sm"
                      rows={4}
                    />

                    {/* Errors for the custom textarea */}
                    <AnimatePresence>
                      {errors.customRelationshipLevel && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-xs text-red-400 mt-1"
                        >
                          {errors.customRelationshipLevel}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>

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

            {/* {systemPrompt && (
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
                  {showPrompt
                    ? "Hide Prompt Context ▲"
                    : "Show Prompt Context ▼"}
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
            )} */}

            {(aiInput || aiOutput || promptUsed) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 space-y-4"
              >
                {/* View Raw Input Accordion */}
                {aiInput && (
                  <div>
                    <motion.div
                      onClick={toggleInputAccordion}
                      whileHover={{ backgroundColor: "rgba(55, 65, 81, 0.8)" }}
                      className="cursor-pointer p-3 bg-gray-800 rounded-lg border border-gray-600 hover:border-gray-500 transition-all duration-300"
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium text-gray-300">
                          View Raw Input
                        </h4>
                        <motion.span
                          animate={{ rotate: inputAccordionOpen ? 180 : 0 }}
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
                        height: inputAccordionOpen ? "auto" : 0,
                        opacity: inputAccordionOpen ? 1 : 0,
                      }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div
                        className="mt-3 p-3 bg-gray-800 rounded-lg text-xs sm:text-sm text-gray-200 border border-gray-700 max-h-96 overflow-y-auto"
                        style={{
                          scrollbarWidth: "thin",
                          scrollbarColor: "#4B5563 transparent",
                        }}
                      >
                        <pre className="whitespace-pre-wrap">
                          {JSON.stringify(aiInput, null, 2)}
                        </pre>
                      </div>
                    </motion.div>
                  </div>
                )}

                {/* View Raw Output Accordion */}
                {aiOutput && (
                  <div>
                    <motion.div
                      onClick={toggleOutputAccordion}
                      whileHover={{ backgroundColor: "rgba(55, 65, 81, 0.8)" }}
                      className="cursor-pointer p-3 bg-gray-800 rounded-lg border border-gray-600 hover:border-gray-500 transition-all duration-300"
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium text-gray-300">
                          View Raw Output
                        </h4>
                        <motion.span
                          animate={{ rotate: outputAccordionOpen ? 180 : 0 }}
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
                        height: outputAccordionOpen ? "auto" : 0,
                        opacity: outputAccordionOpen ? 1 : 0,
                      }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div
                        className="mt-3 p-3 bg-gray-800 rounded-lg text-xs sm:text-sm text-gray-200 border border-gray-700 max-h-96 overflow-y-auto"
                        style={{
                          scrollbarWidth: "thin",
                          scrollbarColor: "#4B5563 transparent",
                        }}
                      >
                        <pre className="whitespace-pre-wrap">
                          {JSON.stringify(aiOutput, null, 2)}
                        </pre>
                      </div>
                    </motion.div>
                  </div>
                )}

                {/* View Prompt Used Accordion */}
                {promptUsed && (
                  <div>
                    <motion.div
                      onClick={togglePromptAccordion}
                      whileHover={{ backgroundColor: "rgba(55, 65, 81, 0.8)" }}
                      className="cursor-pointer p-3 bg-gray-800 rounded-lg border border-gray-600 hover:border-gray-500 transition-all duration-300"
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium text-gray-300">
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
                      <div
                        className="mt-3 p-3 bg-gray-800 rounded-lg space-y-5 text-xs sm:text-sm text-gray-200 max-h-96 overflow-y-auto"
                        style={{
                          scrollbarWidth: "thin",
                          scrollbarColor: "#4B5563 transparent",
                        }}
                      >
                        {/* System Prompt */}
                        {promptUsed.systemPrompt && (
                          <div className="text-start">
                            <h5 className="text-sm sm:text-base font-semibold text-gray-100 mb-2">
                              System Prompt
                            </h5>
                            <pre className="whitespace-pre-wrap text-gray-300 bg-gray-900/50 p-3 rounded-lg">
                              {promptUsed.systemPrompt}
                            </pre>
                          </div>
                        )}

                        {/* User Prompt */}
                        {promptUsed.userPrompt && (
                          <div className="text-start">
                            <h5 className="text-sm sm:text-base font-semibold text-gray-100 mb-2">
                              User Instruction
                            </h5>
                            <pre className="whitespace-pre-wrap text-gray-300 bg-gray-900/50 p-3 rounded-lg">
                              {promptUsed.userPrompt}
                            </pre>
                          </div>
                        )}

                        {/* Direction Note */}
                        {promptUsed.directionNote && (
                          <div className="text-start">
                            <h5 className="text-sm sm:text-base font-semibold text-gray-100 mb-2">
                              Direction Note
                            </h5>
                            <pre className="whitespace-pre-wrap text-gray-300 bg-gray-900/50 p-3 rounded-lg">
                              {promptUsed.directionNote}
                            </pre>
                          </div>
                        )}

                        {/* Male Persona Details */}
                        {promptUsed.male && (
                          <div className="text-start">
                            <h5 className="text-sm sm:text-base font-semibold text-gray-100 mb-2">
                              Male Persona
                            </h5>
                            <div className="space-y-3 bg-gray-900/50 p-3 rounded-lg">
                              {promptUsed.male.language && (
                                <div>
                                  <h6 className="text-xs font-medium text-blue-400 mb-1">
                                    Language
                                  </h6>
                                  <pre className="whitespace-pre-wrap text-gray-300 text-xs">
                                    {promptUsed.male.language}
                                  </pre>
                                </div>
                              )}
                              {promptUsed.male.dialect && (
                                <div>
                                  <h6 className="text-xs font-medium text-blue-400 mb-1">
                                    Dialect
                                  </h6>
                                  <pre className="whitespace-pre-wrap text-gray-300 text-xs">
                                    {promptUsed.male.dialect}
                                  </pre>
                                </div>
                              )}
                              {promptUsed.male.tone && (
                                <div>
                                  <h6 className="text-xs font-medium text-blue-400 mb-1">
                                    Tone
                                  </h6>
                                  <pre className="whitespace-pre-wrap text-gray-300 text-xs">
                                    {promptUsed.male.tone}
                                  </pre>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Female Persona Details */}
                        {promptUsed.female && (
                          <div className="text-start">
                            <h5 className="text-sm sm:text-base font-semibold text-gray-100 mb-2">
                              Female Persona
                            </h5>
                            <div className="space-y-3 bg-gray-900/50 p-3 rounded-lg">
                              {promptUsed.female.language && (
                                <div>
                                  <h6 className="text-xs font-medium text-pink-400 mb-1">
                                    Language
                                  </h6>
                                  <pre className="whitespace-pre-wrap text-gray-300 text-xs">
                                    {promptUsed.female.language}
                                  </pre>
                                </div>
                              )}
                              {promptUsed.female.dialect && (
                                <div>
                                  <h6 className="text-xs font-medium text-pink-400 mb-1">
                                    Dialect
                                  </h6>
                                  <pre className="whitespace-pre-wrap text-gray-300 text-xs">
                                    {promptUsed.female.dialect}
                                  </pre>
                                </div>
                              )}
                              {promptUsed.female.tone && (
                                <div>
                                  <h6 className="text-xs font-medium text-pink-400 mb-1">
                                    Tone
                                  </h6>
                                  <pre className="whitespace-pre-wrap text-gray-300 text-xs">
                                    {promptUsed.female.tone}
                                  </pre>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </div>
                )}
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

                  {/* ---- Messages ---- */}
                  {conversation.map((msg, i) => {
                    const trimmed = msg.trim();
                    const isMale = trimmed.startsWith(maleName);
                    const speakerName = isMale ? maleName : femaleName;
                    const messageText = trimmed.startsWith(`${speakerName}:`)
                      ? trimmed.slice(speakerName.length + 1).trim()
                      : trimmed;

                    return (
                      <motion.div
                        key={i}
                        initial={{
                          opacity: 0,
                          x: isMale ? -50 : 50,
                          scale: 0.8,
                        }}
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
                          onClick={() => {
                            navigator.clipboard.writeText(messageText);
                            toast.success("Message copied!");
                          }}
                          className={`px-5 py-3 rounded-2xl max-w-[80%] sm:max-w-[70%] text-sm sm:text-base relative cursor-pointer select-text transition-all ${
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

                          {/* Hover overlay */}
                          <div
                            className={`absolute inset-0 rounded-2xl opacity-0 hover:opacity-20 transition-opacity duration-300 pointer-events-none ${
                              isMale ? "bg-blue-400" : "bg-pink-400"
                            }`}
                          />
                        </motion.div>
                      </motion.div>
                    );
                  })}

                  {/* ---- Copy Full Chat Button ---- */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const fullText = conversation
                        .map((msg) => msg.trim())
                        .join("\n");
                      navigator.clipboard.writeText(fullText);
                      toast.success("Full chat copied!");
                    }}
                    className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    Copy Full Chat
                  </motion.button>
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
          </>
       
      </motion.div>
    </div>
  );
};

export default ConvoGenerator;
