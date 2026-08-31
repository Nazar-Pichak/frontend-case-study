import { useId, type SVGProps } from 'react';

import { cn } from '@/lib/utils.ts';

type CalendarProvider =
    | 'google'
    | 'microsoft'
    | 'outlook'
    | 'yahoo'
    | 'download';

interface CalendarIconProps
    extends Omit<SVGProps<SVGSVGElement>, 'children'> {
    provider: CalendarProvider;
}

export function CalendarIcon({ provider, className, ...svgProps }: CalendarIconProps) {
    // Create unique SVG definition IDs for every rendered icon.
    const definitionId = useId().replace(/:/g, '');

    const outlookBackgroundGradientId = `${definitionId}-outlook-background`;
    const outlookMaskId = `${definitionId}-outlook-mask`;
    const outlookMaskGradientId = `${definitionId}-outlook-mask-gradient`;
    const outlookRightGradientId = `${definitionId}-outlook-right-gradient`;
    const outlookLeftGradientId = `${definitionId}-outlook-left-gradient`;
    const outlookLogoGradientId = `${definitionId}-outlook-logo-gradient`;

    const sharedProps = {
        ...svgProps,
        className: cn('size-4 shrink-0', className),
        'aria-hidden': true,
        focusable: false,
    };

    if (provider === 'google') {
        return (
            <svg {...sharedProps} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" preserveAspectRatio="xMidYMid">
                <g>
                    <polygon
                        fill="#FFFFFF"
                        points="195.368421 60.6315789 60.6315789 60.6315789 60.6315789 195.368421 195.368421 195.368421"
                    />

                    <polygon
                        fill="#EA4335"
                        points="195.368421 256 256 195.368421 225.684211 190.196005 195.368421 195.368421 189.835162 223.098002"
                    />

                    <path
                        fill="#188038"
                        d="M1.42108547e-14,195.368421 L1.42108547e-14,235.789474 C1.42108547e-14,246.955789 9.04421053,256 20.2105263,256 L60.6315789,256 L66.8568645,225.684211 L60.6315789,195.368421 L27.5991874,190.196005 L1.42108547e-14,195.368421 Z"
                    />

                    <path
                        fill="#1967D2"
                        d="M256,60.6315789 L256,20.2105263 C256,9.04421053 246.955789,1.42108547e-14 235.789474,1.42108547e-14 L195.368421,1.42108547e-14 C191.679582,15.0358547 189.835162,26.1010948 189.835162,33.1957202 C189.835162,40.2903456 191.679582,49.4356319 195.368421,60.6315789 C208.777986,64.4714866 218.883249,66.3914404 225.684211,66.3914404 C232.485172,66.3914404 242.590435,64.4714866 256,60.6315789 Z"
                    />

                    <polygon
                        fill="#FBBC04"
                        points="256 60.6315789 195.368421 60.6315789 195.368421 195.368421 256 195.368421"
                    />

                    <polygon
                        fill="#34A853"
                        points="195.368421 195.368421 60.6315789 195.368421 60.6315789 256 195.368421 256"
                    />

                    <path
                        fill="#4285F4"
                        d="M195.368421,0 L20.2105263,0 C9.04421053,0 0,9.04421053 0,20.2105263 L0,195.368421 L60.6315789,195.368421 L60.6315789,60.6315789 L195.368421,60.6315789 L195.368421,0 Z"
                    />

                    <path
                        fill="#4285F4"
                        d="M88.2694737,165.153684 C83.2336842,161.751579 79.7473684,156.783158 77.8442105,150.214737 L89.5326316,145.397895 C90.5936842,149.44 92.4463158,152.572632 95.0905263,154.795789 C97.7178947,157.018947 100.917895,158.113684 104.656842,158.113684 C108.48,158.113684 111.764211,156.951579 114.509474,154.627368 C117.254737,152.303158 118.635789,149.338947 118.635789,145.751579 C118.635789,142.08 117.187368,139.082105 114.290526,136.757895 C111.393684,134.433684 107.755789,133.271579 103.410526,133.271579 L96.6568421,133.271579 L96.6568421,121.701053 L102.72,121.701053 C106.458947,121.701053 109.608421,120.690526 112.168421,118.669474 C114.728421,116.648421 116.008421,113.886316 116.008421,110.366316 C116.008421,107.233684 114.863158,104.741053 112.572632,102.871579 C110.282105,101.002105 107.385263,100.058947 103.865263,100.058947 C100.429474,100.058947 97.7010526,100.968421 95.68,102.804211 C93.6602819,104.644885 92.1418208,106.968942 91.2673684,109.557895 L79.6968421,104.741053 C81.2294737,100.395789 84.0421053,96.5557895 88.1684211,93.2378947 C92.2947368,89.92 97.5663158,88.2526316 103.966316,88.2526316 C108.698947,88.2526316 112.96,89.1621053 116.732632,90.9978947 C120.505263,92.8336842 123.469474,95.3768421 125.608421,98.6105263 C127.747368,101.861053 128.808421,105.498947 128.808421,109.541053 C128.808421,113.667368 127.814737,117.153684 125.827368,120.016842 C123.84,122.88 121.397895,125.069474 118.501053,126.602105 L118.501053,127.292632 C122.241568,128.834789 125.490747,131.367752 127.898947,134.618947 C130.341053,137.903158 131.570526,141.827368 131.570526,146.408421 C131.570526,150.989474 130.408421,155.082105 128.084211,158.669474 C125.76,162.256842 122.543158,165.086316 118.467368,167.141053 C114.374737,169.195789 109.776842,170.240124 104.673684,170.240124 C98.7621053,170.256842 93.3052632,168.555789 88.2694737,165.153684 L88.2694737,165.153684 Z M160.067368,107.149474 L147.233684,116.429474 L140.816842,106.694737 L163.84,90.0884211 L172.665263,90.0884211 L172.665263,168.421053 L160.067368,168.421053 L160.067368,107.149474 Z"
                    />
                </g>
            </svg>
        );
    }

    if (provider === 'microsoft') {
        return (
            <svg {...sharedProps} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none">
                <path
                    fill="#F35325"
                    d="M1 1h6.5v6.5H1V1z"
                />

                <path
                    fill="#81BC06"
                    d="M8.5 1H15v6.5H8.5V1z"
                />

                <path
                    fill="#05A6F0"
                    d="M1 8.5h6.5V15H1V8.5z"
                />

                <path
                    fill="#FFBA08"
                    d="M8.5 8.5H15V15H8.5V8.5z"
                />
            </svg>
        );
    }

    if (provider === 'outlook') {
        return (
            <svg {...sharedProps} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
                <rect
                    x="10"
                    y="2"
                    width="20"
                    height="28"
                    rx="2"
                    fill="#1066B5"
                />

                <rect
                    x="10"
                    y="2"
                    width="20"
                    height="28"
                    rx="2"
                    fill={`url(#${outlookBackgroundGradientId})`}
                />

                <rect
                    x="10"
                    y="5"
                    width="10"
                    height="10"
                    fill="#32A9E7"
                />

                <rect
                    x="10"
                    y="15"
                    width="10"
                    height="10"
                    fill="#167EB4"
                />

                <rect
                    x="20"
                    y="15"
                    width="10"
                    height="10"
                    fill="#32A9E7"
                />

                <rect
                    x="20"
                    y="5"
                    width="10"
                    height="10"
                    fill="#58D9FD"
                />

                <mask
                    id={outlookMaskId}
                    style={{ maskType: 'alpha' }}
                    maskUnits="userSpaceOnUse"
                    x="8"
                    y="14"
                    width="24"
                    height="16"
                >
                    <path
                        d="M8 14H30C31.1046 14 32 14.8954 32 16V28C32 29.1046 31.1046 30 30 30H10C8.89543 30 8 29.1046 8 28V14Z"
                        fill={`url(#${outlookMaskGradientId})`}
                    />
                </mask>

                <g mask={`url(#${outlookMaskId})`}>
                    <path
                        d="M32 14V18H30V14H32Z"
                        fill="#135298"
                    />

                    <path
                        d="M32 30V16L7 30H32Z"
                        fill={`url(#${outlookRightGradientId})`}
                    />

                    <path
                        d="M8 30V16L33 30H8Z"
                        fill={`url(#${outlookLeftGradientId})`}
                    />
                </g>

                <path
                    d="M8 12C8 10.3431 9.34315 9 11 9H17C18.6569 9 20 10.3431 20 12V24C20 25.6569 18.6569 27 17 27H8V12Z"
                    fill="#000000"
                    fillOpacity="0.3"
                />

                <rect
                    y="7"
                    width="18"
                    height="18"
                    rx="2"
                    fill={`url(#${outlookLogoGradientId})`}
                />

                <path
                    d="M14 16.0693V15.903C14 13.0222 11.9272 11 9.01582 11C6.08861 11 4 13.036 4 15.9307V16.097C4 18.9778 6.07278 21 9 21C11.9114 21 14 18.964 14 16.0693ZM11.6424 16.097C11.6424 18.0083 10.5665 19.1579 9.01582 19.1579C7.46519 19.1579 6.37342 17.9806 6.37342 16.0693V15.903C6.37342 13.9917 7.44937 12.8421 9 12.8421C10.5348 12.8421 11.6424 14.0194 11.6424 15.9307V16.097Z"
                    fill="#FFFFFF"
                />

                <defs>
                    <linearGradient
                        id={outlookBackgroundGradientId}
                        x1="10"
                        y1="16"
                        x2="30"
                        y2="16"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop stopColor="#064484" />
                        <stop offset="1" stopColor="#0F65B5" />
                    </linearGradient>

                    <linearGradient
                        id={outlookMaskGradientId}
                        x1="8"
                        y1="26.7692"
                        x2="32"
                        y2="26.7692"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop stopColor="#1B366F" />
                        <stop offset="1" stopColor="#2657B0" />
                    </linearGradient>

                    <linearGradient
                        id={outlookRightGradientId}
                        x1="32"
                        y1="23"
                        x2="8"
                        y2="23"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop stopColor="#44DCFD" />
                        <stop offset="0.453125" stopColor="#259ED0" />
                    </linearGradient>

                    <linearGradient
                        id={outlookLeftGradientId}
                        x1="8"
                        y1="23"
                        x2="32"
                        y2="23"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop stopColor="#259ED0" />
                        <stop offset="1" stopColor="#44DCFD" />
                    </linearGradient>

                    <linearGradient
                        id={outlookLogoGradientId}
                        x1="0"
                        y1="16"
                        x2="18"
                        y2="16"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop stopColor="#064484" />
                        <stop offset="1" stopColor="#0F65B5" />
                    </linearGradient>
                </defs>
            </svg>
        );
    }

    if (provider === 'yahoo') {
        return (
            <svg {...sharedProps} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <rect
                    width="512"
                    height="512"
                    rx="15%"
                    fill="#5F01D1"
                />

                <g fill="#FFFFFF">
                    <path d="M203 404h-62l25-59-69-165h63l37 95 37-95h62m58 76h-69l62-148h69" />

                    <circle
                        cx="303"
                        cy="308"
                        r="38"
                    />
                </g>
            </svg>
        );
    }

    if (provider === 'download') {
        return (
            <svg {...sharedProps} xmlns="http://www.w3.org/2000/svg" viewBox="-3.5 0 48 48" fill="none">
                <g
                    transform="translate(-204 -560)"
                    fill="#0B0B0A"
                    fillRule="evenodd"
                    stroke="none"
                    strokeWidth="1"
                >
                    <path d="M231.174735,567.792499 C232.740177,565.771699 233.926883,562.915484 233.497649,560 C230.939077,560.177808 227.948466,561.814769 226.203475,563.948463 C224.612784,565.88177 223.305444,568.757742 223.816036,571.549042 C226.613071,571.636535 229.499881,569.960061 231.174735,567.792499 L231.174735,567.792499 Z M245,595.217241 C243.880625,597.712195 243.341978,598.827022 241.899976,601.03692 C239.888467,604.121745 237.052156,607.962958 233.53412,607.991182 C230.411652,608.02505 229.606488,605.94498 225.367451,605.970382 C221.128414,605.99296 220.244696,608.030695 217.116618,607.999649 C213.601387,607.968603 210.913765,604.502761 208.902256,601.417937 C203.27452,592.79849 202.68257,582.680377 206.152914,577.298162 C208.621711,573.476705 212.515678,571.241407 216.173986,571.241407 C219.89682,571.241407 222.239372,573.296075 225.322563,573.296075 C228.313175,573.296075 230.133913,571.235762 234.440281,571.235762 C237.700215,571.235762 241.153726,573.022307 243.611302,576.10431 C235.554045,580.546683 236.85858,592.121127 245,595.217241 L245,595.217241 Z" />
                </g>
            </svg>
        );
    }
}