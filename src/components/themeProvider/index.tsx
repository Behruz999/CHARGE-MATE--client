import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { ThemeContextProps } from '../../aliases/alias';

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem('isDark') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('isDark', isDark.toString());
  }, [isDark]);

  const wrapperStyle: React.CSSProperties = {
    backgroundColor: isDark ? '#1f2937' : '#ffffff', // Adjust background color for dark mode
    minHeight: '100vh', // Ensure the wrapper fills the viewport
    transition: 'background-color 0.5s ease-in-out', // Tailwind CSS transition
  };

  return (
    <ThemeContext.Provider value={{ isDark, setIsDark }}>
      <div className={isDark ? 'dark' : ''} style={wrapperStyle}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export { ThemeProvider, ThemeContext };
