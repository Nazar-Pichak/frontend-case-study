import { createContext } from 'react';

import type { Language, TranslationKey} from '@/lib/i18n.ts';

export interface LanguageContextValue {
    language: Language;
    setLanguage: (language: Language) => void;
    t: (key: TranslationKey) => string;
}

export const LanguageContext = createContext<LanguageContextValue | null>(null);