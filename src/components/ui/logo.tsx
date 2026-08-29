import { SVGProps } from 'react';

type LogoProps = SVGProps<SVGSVGElement>;

export function Logo({ className, ...svgProps }: LogoProps) {

    return (
        <svg {...svgProps} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 113 20" role="img" className={className}>

            <text x="0" y="16" fill="#25196a" fontFamily="Arial, Helvetica, sans-serif" fontSize="20" letterSpacing="-0.35">
                <tspan fontWeight="700">EVEN</tspan>
                <tspan fontWeight="400">tron</tspan>
            </text>
        </svg>
    );
}