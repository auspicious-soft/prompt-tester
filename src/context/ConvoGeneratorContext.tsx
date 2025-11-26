import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ConvoGeneratorSettings {
  gptModel: string;
  temperature: number;
  language: string;
  dialect: string;
  tone: string;
  femaleTone: string;
  isGenZ: boolean;
  personaDirection: string;
  conversationLength:string;
}

interface ConvoGeneratorContextType {
  settings: ConvoGeneratorSettings;
  updateSettings: (newSettings: Partial<ConvoGeneratorSettings>) => void;
  resetConvoSettings: () => void;
}

const defaultSettings: ConvoGeneratorSettings = {
  gptModel: 'gpt-4o-mini',
  temperature: 1,
  language: 'english',
  dialect: '',
  tone: 'flirty',
  femaleTone: 'flirty',
  isGenZ: false,
  personaDirection: 'male_to_female',
  conversationLength:"short"
};

const ConvoGeneratorContext = createContext<ConvoGeneratorContextType | undefined>(undefined);

export const ConvoGeneratorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<ConvoGeneratorSettings>(() => {
    const stored = localStorage.getItem('convoGeneratorSettings');
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
    localStorage.setItem('convoGeneratorSettings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<ConvoGeneratorSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetConvoSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('convoGeneratorSettings');
  };

  return (
    <ConvoGeneratorContext.Provider value={{ settings, updateSettings, resetConvoSettings }}>
      {children}
    </ConvoGeneratorContext.Provider>
  );
};

export const useConvoGenerator = () => {
  const context = useContext(ConvoGeneratorContext);
  if (!context) {
    throw new Error('useConvoGenerator must be used within ConvoGeneratorProvider');
  }
  return context;
};