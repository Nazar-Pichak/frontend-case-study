import { useEffect, useState } from 'react';

export function useScrollState(threshold = 10): boolean {
	// Store whether the page has moved beyond the configured scroll threshold.
	// The initial value is false because the page normally starts at the top.
	const [isScrolled, setIsScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			// Update the state only according to the current vertical position.
			// Components can use this boolean without accessing window directly.
			setIsScrolled(window.scrollY > threshold);
		};

		// Synchronize the initial state in case the browser restores
		// a previous scroll position after refreshing the page.
		handleScroll();

		// A passive listener tells the browser that this handler will not
		// prevent scrolling, which allows smoother scroll processing.
		window.addEventListener('scroll', handleScroll, { passive: true });

		return () => {
			// Remove the global listener when the component using this hook
			// is unmounted to prevent duplicate handlers and memory leaks.
			window.removeEventListener('scroll', handleScroll);
		};
	}, [threshold]);

	return isScrolled;
}