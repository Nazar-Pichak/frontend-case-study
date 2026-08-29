import { LanguageContext } from '@/context/language-context.ts';
import { useContext } from 'react';

export function useTranslation() {
    const context = useContext(LanguageContext);

    if (!context) {
        throw new Error(
            'useTranslation must be used inside LanguageProvider.'
        );
    }

    return context;
}