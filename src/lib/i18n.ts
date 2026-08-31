export type Language = 'en' | 'cs';

const englishTranslations = {
    language: 'Language',
    english: 'English',
    czech: 'Czech',

    login: 'Login',
    logout: 'Logout',
    loginSuccessful: 'You have signed in successfully.',
    logoutSuccessful: 'You have signed out successfully.',
    userProfile: 'User profile',
    close: 'Close',

    cart: 'Cart',
    openCart: 'Open cart',
    yourCart: 'Your cart',
    noSeatsSelected: 'No seats selected',
    ticketSelected: 'ticket selected',
    ticketsSelected: 'tickets selected',
    total: 'Total',
    checkoutNow: 'Checkout now',
    creatingOrder: 'Creating order...',

    changeLanguage: 'Change language',

    stage: 'Stage',
    available: 'Available',
    unavailable: 'Unavailable',
    seat: 'Seat',
    ticketType: 'Ticket type',
    price: 'Price',
    unknown: 'Unknown',
    addToCart: 'Add to cart',
    removeFromCart: 'Remove from cart',

    addToCalendar: 'Add to calendar',
    googleCalendar: 'Google Calendar',
    outlookCalendar: 'Outlook Calendar',
    office365Calendar: 'Microsoft 365',
    yahooCalendar: 'Yahoo Calendar',
    downloadCalendarFile: 'Download .ics',

    firstName: 'First name',
    lastName: 'Last name',
    email: 'Email',
    password: 'Password',

    signIn: 'Sign in',
    signingIn: 'Signing in...',
    continueAsGuest: 'Continue as guest',
    createOrder: 'Create order',
    orderCreated: 'Order created successfully',

    ticketCount: 'Ticket count',
    row: 'Row',

    noSeatsAvailable: 'No seats are currently available',
    seatAvailable: 'available',
    seatUnavailable: 'unavailable',
    seatSelected: 'selected',
    mySeat: 'My seat',

    signInToAccount: 'Sign in to your account',

    checkout: 'Checkout',
    chooseCheckoutMethod: 'Choose how you want to continue',
    back: 'Back',
    signInAndContinue: 'Sign in and continue',

    eventStarts: 'Starts',
    eventEnds: 'Ends',
    venue: 'Venue',
    loadingEventData: 'Loading event data',
    loadingSeatingData: 'Loading seating data',

    orderId: 'Order ID',

    footerIntroduction: 'EVENtron is a frontend application for seat reservations and was created for',
    footerDisclaimer: 'It is an educational case study — not an official NFCtron product.',
    allRightsReserved: 'All rights reserved.',
    builtWith: 'Built with',
    and: 'and',

    scrollToTop: 'Scroll to top',

} as const;

export type TranslationKey = keyof typeof englishTranslations;

const czechTranslations: Record<TranslationKey, string> = {
    language: 'Jazyk',
    english: 'Angličtina',
    czech: 'Čeština',

    login: 'Přihlásit se',
    logout: 'Odhlásit se',
    loginSuccessful: 'Přihlášení proběhlo úspěšně.',
    logoutSuccessful: 'Odhlášení proběhlo úspěšně.',
    userProfile: 'Profil uživatele',
    close: 'Zavřít',

    cart: 'Košík',
    openCart: 'Otevřít košík',
    yourCart: 'Váš košík',
    noSeatsSelected: 'Nejsou vybrána žádná sedadla',
    ticketSelected: 'vybraná vstupenka',
    ticketsSelected: 'vybraných vstupenek',
    total: 'Celkem',
    checkoutNow: 'Pokračovat k objednávce',
    creatingOrder: 'Vytvářím objednávku...',

    changeLanguage: 'Změnit jazyk',

    stage: 'Pódium',
    available: 'Dostupné',
    unavailable: 'Nedostupné',
    seat: 'Sedadlo',
    ticketType: 'Typ vstupenky',
    price: 'Cena',
    unknown: 'Neznámý',
    addToCart: 'Přidat do košíku',
    removeFromCart: 'Odebrat z košíku',

    addToCalendar: 'Přidat do kalendáře',
    googleCalendar: 'Kalendář Google',
    outlookCalendar: 'Kalendář Outlook',
    office365Calendar: 'Microsoft 365',
    yahooCalendar: 'Kalendář Yahoo',
    downloadCalendarFile: 'Stáhnout .ics',

    firstName: 'Jméno',
    lastName: 'Příjmení',
    email: 'E-mail',
    password: 'Heslo',

    signIn: 'Přihlásit se',
    signingIn: 'Přihlašuji...',
    continueAsGuest: 'Pokračovat jako host',
    createOrder: 'Vytvořit objednávku',
    orderCreated: 'Objednávka byla úspěšně vytvořena',

    ticketCount: 'Počet vstupenek',
    row: 'Řada',

    noSeatsAvailable: 'Momentálně nejsou dostupná žádná sedadla',
    seatAvailable: 'dostupné',
    seatUnavailable: 'nedostupné',
    seatSelected: 'vybrané',
    mySeat: 'Moje sedadlo',

    signInToAccount: 'Přihlaste se ke svému účtu',

    checkout: 'Objednávka',
    chooseCheckoutMethod: 'Vyberte, jak chcete pokračovat',
    back: 'Zpět',
    signInAndContinue: 'Přihlásit se a pokračovat',

    eventStarts: 'Začátek',
    eventEnds: 'Konec',
    venue: 'Místo konání',
    loadingEventData: 'Načítám údaje o akci',
    loadingSeatingData: 'Načítám mapu sedadel',

    orderId: 'Číslo objednávky',

    footerIntroduction: 'EVENtron je frontendová aplikace pro rezervaci sedadel a je vytvořená pro',
    footerDisclaimer: 'Jde o výukovou případovou studii — nikoliv o oficiální produkt NFCtron.',
    allRightsReserved: 'Všechna práva vyhrazena.',
    builtWith: 'Vytvořeno pomocí',
    and: 'a',

    scrollToTop: 'Přejít nahoru',
};

export const translations: Record<Language, Record<TranslationKey, string>> = {
    en: englishTranslations,
    cs: czechTranslations,
};