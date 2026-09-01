import { Logo } from '@/components/ui/logo.tsx';
import { useTranslation } from '@/hooks/useTranslation.ts';

export function Footer() {
    const { t } = useTranslation();

    return (
        <footer className="eventron-background min-h-40">
            <div className="mx-auto flex w-full max-w-screen-lg flex-col gap-6 p-6">
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <Logo className="h-4 w-auto" />

                    <p className="w-full sm:w-1/2 text-xs text-zinc-500">
                        {t('footerIntroduction')}{' '}
                        <a href="https://www.nfctron.com/" target="_blank" rel="noreferrer" className="eventron-link">
                            NFCtron
                        </a>
                        . {t('footerDisclaimer')}
                    </p>
                </div>

                <div className="flex flex-col justify-between gap-2 border-t border-zinc-200 pt-4 text-xs text-zinc-500 sm:flex-row sm:items-center">
                    <p>
                        &copy; {new Date().getFullYear()}{' '}
                        <a href="https://nazar-portfolio-react.vercel.app/" target="_blank" rel="noreferrer" className="eventron-link">
                            Nazar Pichak
                        </a>
                        . {t('allRightsReserved')}
                    </p>

                    <p>
                        {t('builtWith')}{' '}
                        <a href="https://react.dev/" target="_blank" rel="noreferrer" className="eventron-link">
                            React
                        </a>
                        ,{' '}
                        <a href="https://www.typescriptlang.org/" target="_blank" rel="noreferrer" className="eventron-link">
                            TypeScript
                        </a>{' '}
                        {t('and')}{' '}
                        <a href="https://tailwindcss.com/" target="_blank" rel="noreferrer" className="eventron-link">
                            Tailwind CSS
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}