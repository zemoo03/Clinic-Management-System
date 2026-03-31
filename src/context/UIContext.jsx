import React, { createContext, useContext, useState, useEffect } from 'react';

const UIContext = createContext();

export const UIProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem('hc_theme');
        return saved || 'light';
    });

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('hc_theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
    };

    return (
        <UIContext.Provider value={{
            theme,
            toggleTheme,
            isSidebarOpen,
            toggleSidebar,
            setIsSidebarOpen
        }}>
            {children}
        </UIContext.Provider>
    );
};

export const useUI = () => {
    const context = useContext(UIContext);
    if (!context) throw new Error('useUI must be used within a UIProvider');
    return context;
};
