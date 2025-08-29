import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { getApi, postApi } from '../utils/api';
import { URLS } from '../utils/urls';
import { toast } from 'sonner';


const PromptGenerator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'generator' | 'templates'>('generator');
  const [selectedType, setSelectedType] = useState<'ScreenshotReply' | 'ManualReply' | 'GetPickUpLine' | null>(null);
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | null>(null);
  const [isGenxz, setIsGenxz] = useState<boolean | undefined>(undefined);
  const [style, setStyle] = useState<string | null>(null);
  const [language, setLanguage] = useState<'en' | 'ar' | 'arbz' | null>(null);
  const [dialect, setDialect] = useState<'LEVANTINE' | 'EGYPTIAN' | 'GULF' | 'IRAQI' | 'NORTH_AFRICAN' | null>(null);
  const [promptType, setPromptType] = useState<'Optimized' | 'Full prompt' | null>(null);
  const [message, setMessage] = useState('');
  const [context, setContext] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [output, setOutput] = useState('');
  const [fullPrompt, setFullPrompt] = useState('');
  const [responses, setResponses] = useState<string[]>([]);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const maleStyles = ['Conservative', 'Playful', 'Confident', 'Flirty'];
  const femaleStyles = ['Modest', 'Playful', 'Sassy', 'Flirty'];
  const stylesOptions = gender === 'MALE' ? maleStyles : gender === 'FEMALE' ? femaleStyles : [];

  const handleChange = (setter: React.Dispatch<React.SetStateAction<any>>, value: any) => {
    setter(value);
    // Reset subsequent states
    if (setter === setSelectedType) {
      setGender(null);
      setIsGenxz(undefined);
      setStyle(null);
      setLanguage(null);
      setDialect(null);
      setPromptType(null);
      setMessage('');
      setContext('');
      setImageFile(null);
      setOutput('');
      setFullPrompt('');
      setResponses([]);
      setSuccess(false);
    } else if (setter === setGender) {
      setIsGenxz(undefined);
      setStyle(null);
      setLanguage(null);
      setDialect(null);
      setPromptType(null);
      setMessage('');
      setContext('');
      setImageFile(null);
      setOutput('');
      setFullPrompt('');
      setResponses([]);
      setSuccess(false);
    } else if (setter === setIsGenxz) {
      setStyle(null);
      setLanguage(null);
      setDialect(null);
      setPromptType(null);
      setMessage('');
      setContext('');
      setImageFile(null);
      setOutput('');
      setFullPrompt('');
      setResponses([]);
      setSuccess(false);
    } else if (setter === setStyle) {
      setLanguage(null);
      setDialect(null);
      setPromptType(null);
      setMessage('');
      setContext('');
      setImageFile(null);
      setOutput('');
      setFullPrompt('');
      setResponses([]);
      setSuccess(false);
    } else if (setter === setLanguage) {
      setDialect(null);
      setPromptType(null);
      setMessage('');
      setContext('');
      setImageFile(null);
      setOutput('');
      setFullPrompt('');
      setResponses([]);
      setSuccess(false);
    } else if (setter === setDialect) {
      setPromptType(null);
      setMessage('');
      setContext('');
      setImageFile(null);
      setOutput('');
      setFullPrompt('');
      setResponses([]);
      setSuccess(false);
    } else if (setter === setPromptType) {
      setMessage('');
      setContext('');
      setImageFile(null);
      setOutput('');
      setFullPrompt('');
      setResponses([]);
      setSuccess(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setOutput('');
      setFullPrompt('');
      setResponses([]);
      setSuccess(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

      // 🔹 Validation before API call
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
  // if (language === "Arabic" && !dialect) {
  //   toast.error("Please select a dialect for Arabic");
  //   return;
  // }
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
    try {
      let response;
      const commonParams = {
      rizzType: style ?? "",
  isGenz: String(isGenxz ?? ""),
  language: language?.toLowerCase() ?? "",
  dialect: dialect ?? "",
  gender: gender ?? "",
  protoType: promptType?.toLowerCase().replace(" ", "") ?? "",
      };

      if (selectedType === 'GetPickUpLine') {
        const query = new URLSearchParams(commonParams).toString();
        response = await getApi(`${URLS.getPickUpLine}?${query}`);
      } else if (selectedType === 'ManualReply') {
        const body = {
          ...commonParams,
          message,
          context: context || undefined,
        };
        response = await postApi(`${URLS.getManualReply}`, body);
      } else if (selectedType === 'ScreenshotReply') {
        const formData = new FormData();
        if (imageFile) {
          formData.append('image', imageFile);
        }
        Object.entries(commonParams).forEach(([key, value]) => {
          if (value) formData.append(key, value);
        });
        response = await postApi(`${URLS.getResponseByScreenshot}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      if (response?.status === 200 && response.data.success) {
        setSuccess(true);
        if (selectedType === 'GetPickUpLine') {
          setResponses(response.data.data.pickupLines || []);
          setFullPrompt(response.data.data.fullPrompt || '');
        } else if (selectedType === 'ManualReply') {
          setResponses(response.data.data.reply || []);
          setFullPrompt(response.data.data.fullPrompt || '');
        } else if (selectedType === 'ScreenshotReply') {
          setResponses(response.data.data.reply.replies || []);
          setFullPrompt(response.data.data.reply.fullPrompt || '');
        }
        setOutput('Success: Response generated');
      } else {
        setOutput('Error: Failed to fetch response');
        setSuccess(false);
      }
    } catch (error) {
      console.error('API Error:', error);
      setOutput('Error: Something went wrong');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-800 to-gray-900 flex flex-col items-center justify-start p-6">
      {/* Top Tabs */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-4xl flex justify-center mb-10"
      >
        <button
          onClick={() => setActiveTab('generator')}
          className={`px-8 py-3 text-lg font-semibold rounded-l-lg transition-all duration-300 ${
            activeTab === 'generator' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Prompt Generator
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`px-8 py-3 text-lg font-semibold rounded-r-lg transition-all duration-300 ${
            activeTab === 'templates' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Prompt Templates
        </button>
      </motion.div>

      {activeTab === 'generator' && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-7xl bg-gray-800/80 backdrop-blur-md rounded-3xl shadow-lg p-10 border border-gray-700"
        >
          <h2 className="text-3xl font-extrabold text-gray-100 text-center mb-8">Prompt Generator</h2>

          {/* Type Selection */}
          <motion.div variants={itemVariants} className="mb-6 flex justify-center space-x-4">
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleChange(setSelectedType, 'ScreenshotReply')}
              className={`px-10 py-4 rounded-lg font-medium transition-all duration-300 ${
                selectedType === 'ScreenshotReply'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Screenshot Reply
            </motion.button>
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleChange(setSelectedType, 'ManualReply')}
              className={`px-10 py-4 rounded-lg font-medium transition-all duration-300 ${
                selectedType === 'ManualReply'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Manual Reply
            </motion.button>
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleChange(setSelectedType, 'GetPickUpLine')}
              className={`px-10 py-4 rounded-lg font-medium transition-all duration-300 ${
                selectedType === 'GetPickUpLine'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Get Pick Up Line
            </motion.button>
          </motion.div>

          {/* All Fields (rendered after Type selection) */}
          {selectedType && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Gender Selection */}
              <motion.div variants={itemVariants} className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">Select Gender</label>
                <select
                  value={gender || ''}
                  onChange={(e) => handleChange(setGender, e.target.value as 'Male' | 'Female')}
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Choose Gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
              </motion.div>

              {/* isGenxz Checkbox (Male only) */}
              {gender === 'MALE' && (
                <motion.div variants={itemVariants} className="mb-6 flex items-center">
                  <input
                    type="checkbox"
                    checked={isGenxz}
                    onChange={(e) => handleChange(setIsGenxz, e.target.checked)}
                    className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-600 rounded"
                  />
                  <label className="text-sm font-medium text-gray-300">isGenxz</label>
                </motion.div>
              )}

              {/* Style Selection */}
              <motion.div variants={itemVariants} className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">Select Style</label>
                <select
                  value={style || ''}
                  onChange={(e) => handleChange(setStyle, e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Choose Style</option>
                  {stylesOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </motion.div>

              {/* Language Selection */}
              <motion.div variants={itemVariants} className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">Select Language</label>
                <select
                  value={language || ''}
                  onChange={(e) => handleChange(setLanguage, e.target.value as 'en' | 'ar' | 'arbz')}
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Choose Language</option>
                  <option value="en">English</option>
                  <option value="ar">Arabic</option>
                  <option value="arbz">Arabizi</option>
                </select>
              </motion.div>

              {/* Dialect Selection */}
              <motion.div variants={itemVariants} className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">Select Dialect</label>
                <select
                  value={dialect || ''}
                  onChange={(e) => handleChange(setDialect, e.target.value as 'LEVANTINE' | 'EGYPTIAN' | 'GULF' | 'IRAQI' | 'NORTH_AFRICAN')}
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Choose Dialect</option>
                  <option value="LEVANTINE">LEVANTINE</option>
                  <option value="EGYPTIAN">EGYPTIAN</option>
                  <option value="GULF">GULF</option>
                  <option value="IRAQI">IRAQI</option>
                  <option value="NORTH_AFRICAN">NORTH AFRICAN</option>
                </select>
              </motion.div>

              {/* Prompt Type Selection */}
              <motion.div variants={itemVariants} className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">Select Prompt Type</label>
                <select
                  value={promptType || ''}
                  onChange={(e) => handleChange(setPromptType, e.target.value as 'Optimized' | 'Full prompt')}
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Choose Prompt Type</option>
                  <option value="Optimized">Optimized</option>
                  <option value="Full prompt">Full Prompt</option>
                </select>
              </motion.div>

              {/* Input Fields Based on Type */}
              {selectedType === 'ScreenshotReply' && (
                <motion.div variants={itemVariants} className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Upload Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-3 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:bg-blue-600 file:text-white file:border-0 hover:file:bg-blue-700"
                    required
                  />
                </motion.div>
              )}

              {selectedType === 'ManualReply' && (
                <>
                  <motion.div variants={itemVariants} className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Enter your message..."
                      required
                      className="w-full h-24 px-4 py-3 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </motion.div>
                  <motion.div variants={itemVariants} className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Context (Optional)</label>
                    <textarea
                      value={context}
                      onChange={(e) => setContext(e.target.value)}
                      placeholder="Enter context (optional)..."
                      className="w-full h-24 px-4 py-3 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </motion.div>
                </>
              )}

              {/* Generate Button */}
              {(selectedType === 'GetPickUpLine' ||
                (selectedType === 'ScreenshotReply' && imageFile) ||
                (selectedType === 'ManualReply' && message)) &&
                gender &&
                style &&
                language &&
                dialect &&
                promptType && (
                  <motion.button
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)' }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 rounded-lg font-semibold shadow-md transition-all duration-300 ${
                      loading
                        ? 'bg-blue-400 text-white cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {loading ? 'Generating...' : 'Generate Prompt'}
                  </motion.button>
                )}

              {/* Output Display */}
              {output && (
                <motion.div variants={itemVariants} className="mt-6 p-6 bg-gray-700 rounded-lg text-gray-100">
                  <h3 className="text-lg font-semibold mb-2">Status</h3>
                  <p>{output}</p>
                </motion.div>
              )}

              {/* API Response Display */}
               {success && (
                <motion.div variants={itemVariants} className="mt-6 p-6 bg-gray-700 rounded-lg text-gray-100">
                  <h3 className="text-lg font-semibold mb-4">API Response</h3>
                  <div className="mb-4">
                    <h4 className="text-md font-medium text-gray-300 mb-2">Prompt Used</h4>
                    <pre className="whitespace-pre-wrap bg-gray-800 p-4 rounded-lg">{fullPrompt}</pre>
                  </div>
                  <div>
                    <h4 className="text-md font-medium text-gray-300 mb-2">Responses</h4>
                    <ul className="list-disc list-inside space-y-2">
                      {responses.map((response, index) => (
                        <li key={index} className="text-gray-100">
                          {response.replace(/^\s*"\d+\.\s*|\s*"$/, '').replace(/^"|"$/g, '').trim()}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </form>
          )}
        </motion.div>
      )}

      {activeTab === 'templates' && (
        <motion.div
          variants={itemVariants}
          className="w-full max-w-4xl text-center text-gray-300 text-lg"
        >
          Prompt Templates coming soon...
        </motion.div>
      )}
    </div>
  );
};

export default PromptGenerator;