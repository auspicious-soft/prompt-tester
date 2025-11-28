import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface PromptGeneratorSettings {
  gptModel: string;
  temperature: number;
  language: "en" | "ar" | "arbz";
  dialect:  "EGYPTIAN"
  | "IRAQI"
  | "LEBANESE"
  | "PALESTINIAN"
  | "JORDANIAN"
  | "MOROCCAN"
  | "ALGERIAN"
  | "SYRIAN"
  | "SUDANESE"
  | "SOMALI"
  | "YEMENI"
  | "TUNISIAN"
  | "SAUDI"
  | "EMIRATI"
  | "KUWAITI"
  | "QATARI"
  | "BAHRAINI"
  | "OMANI"
  | "LIBYAN"
  | "MAURITANIAN"
  | "DJIBOUTIAN"
  | "COMORIAN"
  | "";
  isGenZ: boolean;
  style: string;
  gender: "MALE" | "FEMALE";
}

interface PromptGeneratorContextType {
  settings: PromptGeneratorSettings;
  updateSettings: (newSettings: Partial<PromptGeneratorSettings>) => void;
  resetSettings: () => void;
}

const defaultSettings: PromptGeneratorSettings = {
  gptModel: 'gpt-4o-mini',
  temperature: 1,
  language: 'en',
  dialect: '',
  isGenZ: false,
  style: 'Conservative',
  gender: 'MALE',
};

const PromptGeneratorContext = createContext<PromptGeneratorContextType | undefined>(undefined);

export const PromptGeneratorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<PromptGeneratorSettings>(() => {
    const stored = localStorage.getItem('promptGeneratorSettings');
    if (stored) {
      try {
        return { ...defaultSettings, ...JSON.parse(stored) };
      } catch {
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('promptGeneratorSettings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<PromptGeneratorSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('promptGeneratorSettings');
  };

  return (
    <PromptGeneratorContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </PromptGeneratorContext.Provider>
  );
};

export const usePromptGenerator = () => {
  const context = useContext(PromptGeneratorContext);
  if (!context) {
    throw new Error('usePromptGenerator must be used within PromptGeneratorProvider');
  }
  return context;
};