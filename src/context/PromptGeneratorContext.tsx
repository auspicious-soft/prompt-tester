import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAIProvider } from './AIProviderContext';

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

const getDefaultModel = (provider: "OPENAI" | "GEMINI" | null): string => {
  if (provider === "GEMINI") return "gemini-2.0-flash";
  return "gpt-4o-mini";
};

const getDefaultSettings = (provider: "OPENAI" | "GEMINI" | null): PromptGeneratorSettings => ({
  gptModel: getDefaultModel(provider),
  temperature: 1,
  language: 'en',
  dialect: '',
  isGenZ: false,
  style: 'Conservative',
  gender: 'MALE',
});

const PromptGeneratorContext = createContext<PromptGeneratorContextType | undefined>(undefined);

export const PromptGeneratorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { provider, loading } = useAIProvider();
  
  const [settings, setSettings] = useState<PromptGeneratorSettings>(() => {
    const stored = localStorage.getItem('promptGeneratorSettings');
    if (stored) {
      try {
        const parsedSettings = JSON.parse(stored);
        // If there's a stored provider-specific model, use it
        return { ...getDefaultSettings(null), ...parsedSettings };
      } catch {
        return getDefaultSettings(null);
      }
    }
    return getDefaultSettings(null);
  });

  // Update gptModel when provider changes
  useEffect(() => {
    if (!loading && provider) {
      const stored = localStorage.getItem('promptGeneratorSettings');
      const newModel = getDefaultModel(provider);
      let shouldUpdate = false;
      
      if (stored) {
        try {
          const parsedSettings = JSON.parse(stored);
          const storedProvider = parsedSettings.lastProvider;
          
          // Update if provider changed OR if current model doesn't match provider
          if (storedProvider !== provider || parsedSettings.gptModel !== newModel) {
            shouldUpdate = true;
          }
        } catch {
          shouldUpdate = true;
        }
      } else {
        shouldUpdate = true;
      }

      if (shouldUpdate) {
        setSettings(prev => ({
          ...prev,
          gptModel: newModel,
        }));
      }
    }
  }, [provider, loading]);

  useEffect(() => {
    const settingsToStore = {
      ...settings,
      lastProvider: provider,
    };
    localStorage.setItem('promptGeneratorSettings', JSON.stringify(settingsToStore));
  }, [settings, provider]);

  const updateSettings = (newSettings: Partial<PromptGeneratorSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetSettings = () => {
    setSettings(getDefaultSettings(provider));
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