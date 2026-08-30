import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button.tsx';
import { cn } from '@/lib/utils.ts';

interface ScrollToTopButtonProps {
	className?: string;
}

export function ScrollToTopButton({className}: ScrollToTopButtonProps) {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setIsVisible(window.scrollY > 300);
		};

		handleScroll();
		window.addEventListener('scroll', handleScroll, { passive: true });

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	const handleScrollToTop = () => {
		window.scrollTo({ top: 0, behavior: 'smooth',});
	};

	if (!isVisible) {
		return null;
	}

	return (
		<Button
			type="button"
			variant="link"
			size="icon"
			className={cn('fixed bottom-6 right-6 z-40',className)}
			onClick={handleScrollToTop}
			aria-label="Scroll to top"
			title="Scroll to top"
		>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" height="34px" width="34px" fill="currentColor" aria-hidden="true">
				<path d="M440-320h80v-168l64 64 56-56-160-160-160 160 56 56 64-64v168Zm40 240q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
			</svg>
		</Button>
	);
}