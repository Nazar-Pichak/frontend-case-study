import { Logo } from '@/components/ui/logo.tsx';
import { Button } from '@/components/ui/button.tsx';
import { LogoutIcon } from '@/components/ui/logout-icon.tsx';
import { CartButton } from '@/components/ui/cart-button.tsx';
import { ProfileIcon } from '@/components/ui/profile-icon.tsx';
import { TranslateButton } from '@/components/ui/translate-button.tsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx';

import { cn } from '@/lib/utils.ts';
import type { UserDetails } from '@/lib/types.ts';

import { useTranslation } from '@/hooks/useTranslation.ts';

interface HeaderProps {
    isScrolled: boolean;
    selectedSeatCount: number;
    loggedInUser: UserDetails | null;
    avatarSrc: string;
    onOpenCart: () => void;
    onOpenLogin: () => void;
    onOpenProfile: () => void;
    onLogout: () => void;
}

export function Header({
    isScrolled,
    selectedSeatCount,
    loggedInUser,
    avatarSrc,
    onOpenCart,
    onOpenLogin,
    onOpenProfile,
    onLogout,
}: HeaderProps) {

    const { t } = useTranslation();

    return (
        <header className={cn(
                'sticky top-0 z-40 w-full border-b border-transparent transition-all duration-300',
                // Add transparency and blur only after the page starts scrolling.
                isScrolled ? 'border-zinc-200 bg-[#f7f5ff]/50 shadow-sm backdrop-blur-md' : 'eventron-background'
            )}
        >
            <nav className="mx-auto flex w-full max-w-screen-lg items-center justify-between gap-3 p-4" aria-label="Main navigation">
                <div className="flex w-full max-w-[250px]">
                    <a href="/" className="inline-flex shrink-0 items-center" aria-label="EVENtron home">
                        <Logo className="h-6 w-auto" />
                    </a>
                </div>

                <div className="flex w-full max-w-[250px] items-center justify-end gap-3">
                    <TranslateButton />

                    <CartButton itemCount={selectedSeatCount} onClick={onOpenCart}/>

                    {loggedInUser ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    type="button"
                                    variant="link"
                                    size="icon"
                                    className="rounded-full"
                                    aria-label="Open user menu"
                                >
                                    <Avatar>
                                        {/* default image for user profile*/}
                                        <AvatarImage
                                            src={avatarSrc}
                                            alt={`${loggedInUser.firstName} ${loggedInUser.lastName}`}
                                            className="object-cover"
                                        />
                                        <AvatarFallback>
                                            {loggedInUser.firstName.charAt(0)}
                                            {loggedInUser.lastName.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent className="w-[200px]" align="end">
                                <DropdownMenuLabel>
                                    <span className="block">
                                        {loggedInUser.firstName}{' '}
                                        {loggedInUser.lastName}
                                    </span>
                                </DropdownMenuLabel>

                                <DropdownMenuSeparator />

                                <DropdownMenuGroup>
                                    <DropdownMenuItem className="flex justify-between gap-5" onSelect={onOpenProfile}>
                                        {t('userProfile')}
                                        <ProfileIcon />
                                    </DropdownMenuItem>

                                    <DropdownMenuItem className="flex justify-between gap-5" onSelect={onLogout}>
                                        {t('logout')}
                                        <LogoutIcon />
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button type="button" variant="default" onClick={onOpenLogin}>
                            {t('login')}
                        </Button>
                    )}
                </div>
            </nav>
        </header>

    )
}