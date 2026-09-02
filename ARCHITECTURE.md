
# EVENtron Application Architecture

The following diagrams show the runtime hierarchy and orchestration of the application from `main.tsx` down to feature components, hooks and API services.

## Component hierarchy

```mermaid
flowchart TD
    MAIN["main.tsx"] --> STRICT["React.StrictMode"]
    STRICT --> LANG["LanguageProvider"]
    LANG --> APP["App.tsx"]

    APP --> LOGIC["Application logic"]
    APP --> VIEW["Rendered interface"]

    LOGIC --> DATA["Data and cart"]
    LOGIC --> ACTIONS["User actions"]

    DATA --> EVENTHOOK["useEventData"]
    DATA --> CARTHOOK["useCart"]
    DATA --> HISTORYHOOK["useOrderHistory"]

    ACTIONS --> AUTHHOOK["useAuth"]
    ACTIONS --> CHECKOUTHOOK["useCheckout"]
    ACTIONS --> SCROLLHOOK["useScrollState"]

    VIEW --> PAGE["Page layout"]
    VIEW --> OVERLAYS["Overlay layer"]

    PAGE --> HEADER["Header"]
    PAGE --> CONTENT["Main content"]
    PAGE --> FOOTER["Footer"]
    PAGE --> SCROLLBUTTON["ScrollToTopButton"]

    HEADER --> LOGO["Logo"]
    HEADER --> TRANSLATE["TranslateButton"]
    HEADER --> CARTBUTTON["CartButton"]
    HEADER --> USERMENU["User menu"]

    USERMENU --> LOGINBUTTON["Login button"]
    USERMENU --> AVATAR["Avatar dropdown"]

    AVATAR --> HISTORYACTION["Order history action"]
    AVATAR --> PROFILEACTION["Profile action"]
    AVATAR --> LOGOUTACTION["Logout action"]

    HISTORYACTION --> HISTORYICON["OrderHistoryIcon"]

    CONTENT --> SEATING["SeatingSection"]
    CONTENT --> EVENT["EventSection"]

    SEATING --> STAGE["SeatingStage"]
    SEATING --> SEATCONTENT["Seat content state"]
    SEATING --> LEGEND["SeatingLegend"]

    SEATCONTENT --> SEATLOADING["Spinner"]
    SEATCONTENT --> SEATERROR["ErrorMessage"]
    SEATCONTENT --> MAP["SeatingMap"]

    MAP --> ROWS["Seat rows"]
    ROWS --> POSITIONS["Seat positions"]

    POSITIONS --> AVAILABLE["Available Seat"]
    POSITIONS --> UNAVAILABLE["Unavailable seat"]
    POSITIONS --> MYSEAT["My seat"]

    AVAILABLE --> POPOVER["Seat Popover"]
    POPOVER --> TICKETINFO["Ticket type and price"]
    POPOVER --> TOGGLE["Add or remove seat"]

    EVENT --> EVENTCONTENT["Event content state"]
    EVENT --> CALENDAR["AddToCalendar"]

    EVENTCONTENT --> EVENTLOADING["Spinner"]
    EVENTCONTENT --> EVENTERROR["ErrorMessage"]
    EVENTCONTENT --> DETAILS["EventDetails"]

    DETAILS --> IMAGE["Event image"]
    DETAILS --> DESCRIPTION["Name and description"]
    DETAILS --> DATETIME["Dates and venue"]

    CALENDAR --> CALENDARMENU["Calendar dropdown"]
    CALENDARMENU --> GOOGLE["Google"]
    CALENDARMENU --> OUTLOOK["Outlook"]
    CALENDARMENU --> OFFICE["Office 365"]
    CALENDARMENU --> YAHOO["Yahoo"]
    CALENDARMENU --> ICS["ICS download"]

    FOOTER --> FOOTERLOGO["Logo"]
    FOOTER --> PROJECTINFO["Project information"]
    FOOTER --> LINKS["External links"]

    OVERLAYS --> NOTIFICATIONS["Notifications"]
    OVERLAYS --> DIALOGS["Dialogs"]

    NOTIFICATIONS --> AUTHNOTICE["AuthNotification"]
    NOTIFICATIONS --> ORDERNOTICE["OrderNotification"]

    DIALOGS --> CARTDIALOG["CartDialog"]
    DIALOGS --> CHECKOUTDIALOG["CheckoutDialog"]
    DIALOGS --> LOGINDIALOG["LoginDialog"]
    DIALOGS --> PROFILEDIALOG["ProfileDialog"]
    DIALOGS --> HISTORYDIALOG["OrderHistoryDialog"]

    CARTDIALOG --> CARTSUMMARY["CartSummary"]
    CARTSUMMARY --> REMOVESEAT["Remove seat"]

    CHECKOUTDIALOG --> GUESTFORM["Guest form"]
    CHECKOUTDIALOG --> CHECKOUTLOGIN["Login form"]

    HISTORYDIALOG --> HISTORYLIST["Stored orders"]
    HISTORYDIALOG --> CLEARHISTORY["Delete history"]

    classDef entry fill:#25196a,color:#fff,stroke:#25196a;
    classDef provider fill:#ede9fe,color:#25196a,stroke:#7c3aed;
    classDef orchestration fill:#ddd6fe,color:#25196a,stroke:#7c3aed;
    classDef hook fill:#e0f2fe,color:#0c4a6e,stroke:#0284c7;
    classDef component fill:#f7f5ff,color:#25196a,stroke:#8b5cf6;
    classDef ui fill:#fafafa,color:#27272a,stroke:#a1a1aa;

    class MAIN entry;
    class STRICT,LANG provider;
    class APP,LOGIC,VIEW,DATA,ACTIONS,PAGE,OVERLAYS orchestration;
    class EVENTHOOK,CARTHOOK,HISTORYHOOK,AUTHHOOK,CHECKOUTHOOK,SCROLLHOOK hook;

    class HEADER,CONTENT,FOOTER,SEATING,EVENT,STAGE,LEGEND,MAP,ROWS,DETAILS,CALENDAR,NOTIFICATIONS,DIALOGS,AUTHNOTICE,ORDERNOTICE,CARTDIALOG,CHECKOUTDIALOG,LOGINDIALOG,PROFILEDIALOG,HISTORYDIALOG,CARTSUMMARY component;

    class LOGO,TRANSLATE,CARTBUTTON,USERMENU,LOGINBUTTON,AVATAR,HISTORYACTION,HISTORYICON,PROFILEACTION,LOGOUTACTION,SCROLLBUTTON,SEATCONTENT,SEATLOADING,SEATERROR,POSITIONS,AVAILABLE,UNAVAILABLE,MYSEAT,POPOVER,TICKETINFO,TOGGLE,EVENTCONTENT,EVENTLOADING,EVENTERROR,IMAGE,DESCRIPTION,DATETIME,CALENDARMENU,GOOGLE,OUTLOOK,OFFICE,YAHOO,ICS,FOOTERLOGO,PROJECTINFO,LINKS,REMOVESEAT,GUESTFORM,CHECKOUTLOGIN,HISTORYLIST,CLEARHISTORY ui;
```

## State and API orchestration

```mermaid
flowchart TD
    APP["App.tsx"] --> EVENTDATA["useEventData"]
    APP --> CART["useCart"]
    APP --> AUTH["useAuth"]
    APP --> CHECKOUT["useCheckout"]
    APP --> HISTORY["useOrderHistory"]

    EVENTDATA --> EVENTREQUEST["GET /event"]
    EVENTREQUEST --> EVENTID["eventId"]
    EVENTID --> SEATINGREQUEST["GET /event-tickets"]
    SEATINGREQUEST --> SEATINGDATA["Seating data"]

    SEATINGDATA --> CART
    SEATINGDATA --> SEATINGUI["SeatingSection"]

    CART --> SELECTED["selectedSeats"]
    CART --> TOTAL["totalPrice"]
    CART --> TOGGLE["toggleSeat"]
    CART --> CLEAR["clearCart"]

    SELECTED --> CHECKOUT
    CLEAR --> CHECKOUT

    AUTH --> USER["loggedInUser"]
    AUTH --> AUTHENTICATE["authenticate"]

    AUTHENTICATE --> LOGINREQUEST["POST /login"]
    USER --> CHECKOUT
    AUTHENTICATE --> CHECKOUT

    AUTH --> AUTHSTORAGE["localStorage: eventron-user"]
    AUTHSTORAGE --> AUTH

    USER --> HISTORY

    CHECKOUT --> ORDERREQUEST["POST /order"]
    ORDERREQUEST --> SUCCESS["Successful order"]
    ORDERREQUEST --> FAILURE["Order error"]

    SUCCESS --> COMPLETED["completedOrder"]
    SUCCESS --> UNAVAILABLE["unavailableSeatIds"]
    SUCCESS --> MYSEATS["mySeatIds"]
    SUCCESS --> CLEAR
    SUCCESS -->|"authenticated purchases only"| HISTORY

    HISTORY --> ORDERSTORAGE["localStorage: eventron-order-history"]
    ORDERSTORAGE --> HISTORY

    HISTORY --> HISTORYDIALOG["OrderHistoryDialog"]
    HISTORYDIALOG -->|"delete current user history"| HISTORY

    COMPLETED --> ORDERNOTICE["OrderNotification"]
    UNAVAILABLE --> SEATINGUI
    MYSEATS --> SEATINGUI

    EVENTREQUEST --> APIGET["apiGet"]
    SEATINGREQUEST --> APIGET

    LOGINREQUEST --> APIPOST["apiPost"]
    ORDERREQUEST --> APIPOST

    APIGET --> RETRY["GET retry for 502, 503 and 504"]
    RETRY --> FETCH["fetchData"]
    APIPOST --> FETCH

    FETCH --> PROXY["Vite or Vercel proxy"]
    PROXY --> NFCTRON["NFCtron API"]

    classDef root fill:#25196a,color:#fff,stroke:#25196a;
    classDef hook fill:#e0f2fe,color:#0c4a6e,stroke:#0284c7;
    classDef state fill:#f7f5ff,color:#25196a,stroke:#8b5cf6;
    classDef storage fill:#dcfce7,color:#14532d,stroke:#22c55e;
    classDef request fill:#fef3c7,color:#78350f,stroke:#f59e0b;
    classDef external fill:#fee2e2,color:#7f1d1d,stroke:#ef4444;

    class APP root;
    class EVENTDATA,CART,AUTH,CHECKOUT,HISTORY hook;

    class EVENTID,SEATINGDATA,SELECTED,TOTAL,TOGGLE,CLEAR,USER,AUTHENTICATE,SUCCESS,FAILURE,COMPLETED,UNAVAILABLE,MYSEATS,ORDERNOTICE,SEATINGUI,HISTORYDIALOG state;

    class AUTHSTORAGE,ORDERSTORAGE storage;

    class EVENTREQUEST,SEATINGREQUEST,LOGINREQUEST,ORDERREQUEST,APIGET,APIPOST,RETRY,FETCH,PROXY request;

    class NFCTRON external;
```

## Main checkout sequence

```mermaid
flowchart TD
    START["Checkout button"] --> LOGGED{"User logged in?"}

    LOGGED -->|Yes| AUTHORDER["Authenticated checkout"]
    LOGGED -->|No| DIALOG["Open CheckoutDialog"]

    DIALOG --> METHOD{"Selected method"}

    METHOD -->|Guest| GUEST["Submit guest details"]
    METHOD -->|Login| LOGIN["Authenticate user"]

    LOGIN --> LOGINSUCCESS{"Login successful?"}

    LOGINSUCCESS -->|No| LOGINERROR["Show login error"]
    LOGINSUCCESS -->|Yes| AUTHORDER

    GUEST --> ORDER["Create order"]
    AUTHORDER --> ORDER

    ORDER --> RESULT{"Order successful?"}

    RESULT -->|No| ORDERERROR["Keep dialog open and show error"]
    RESULT -->|Yes| COMPLETE["Store completed order"]

    COMPLETE --> BLOCK["Mark seats unavailable"]
    BLOCK --> OWNER{"Authenticated purchase?"}

    OWNER -->|Yes| MARK["Mark as My seat"]
    OWNER -->|No| CLEAR["Clear cart"]

    MARK --> SAVEHISTORY["Save orderId and totalAmount"]
    SAVEHISTORY --> LOCALHISTORY["Update local order history"]
    LOCALHISTORY --> CLEAR

    CLEAR --> CLOSE["Close checkout dialogs"]
    CLOSE --> NOTICE["Show OrderNotification"]
```