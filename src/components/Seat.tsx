import { Button } from '@/components/ui/button.tsx';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';
import { cn } from '@/lib/utils.ts';
import React from 'react';
import type { Seats } from '@/lib/types.ts';

interface SeatProps extends React.HTMLAttributes<HTMLElement> {
	seatData: Seats;
}

export const Seat = React.forwardRef<HTMLDivElement, SeatProps>((props, ref) => {
	const isInCart = false;
	return (
		<Popover>
			<PopoverTrigger>
				<div className={cn('flex size-8 items-center justify-center rounded-full border border-violet-200 bg-violet-50 text-violet-700 transition-colors hover:border-violet-600 hover:bg-violet-600 hover:text-white', props.className)} ref={ref}>
					<span className="text-xs font-medium">{props.seatData.place}</span>
				</div>
			</PopoverTrigger>
			<PopoverContent>
				<pre>{JSON.stringify({ seatData: props.seatData }, null, 2)}</pre>
				
				<footer className="flex flex-col">{
					isInCart ? (
						<Button disabled variant="destructive" size="sm">
							Remove from cart
						</Button>
					) : (
						<Button disabled variant="default" size="sm">
							Add to cart
						</Button>
					)
				}</footer>
			</PopoverContent>
		</Popover>
	);
});
