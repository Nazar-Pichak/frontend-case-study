import { useEffect, useState, type ReactNode } from 'react';

import { LanguageContext } from '@/context/language-context.ts';
import { translations, type Language, type TranslationKey } from '@/lib/i18n.ts';

interface LanguageProviderProps {
    children: ReactNode;
}

export function LanguageProvider({children}: LanguageProviderProps) {
    const [language, setLanguage] = useState<Language>(() => {
        const savedLanguage = localStorage.getItem('language');

        return savedLanguage === 'cs' ? 'cs' : 'en';
    });

    useEffect(() => {
        localStorage.setItem('language', language);
        document.documentElement.lang = language;
    }, [language]);

    const t = (key: TranslationKey) => {
        return translations[language][key];
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t}}>
            {children}
        </LanguageContext.Provider>
    );
}