import { useEffect, useState } from "react";
import { apiGet } from "./lib/api";
import { EventData, SeatingData } from "./lib/types";
import { Seat } from '@/components/Seat.tsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx';
import { Button } from '@/components/ui/button.tsx';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu.tsx';
import './App.css';
import React from 'react';

function App() {

	const [eventData, setEventData] = useState<EventData | null>(null);
	const [seatingData, setSeatingData] = useState<SeatingData | null>(null);

	const eventId = eventData?.eventId;

	useEffect(() => {
		const fetchEventData = async (): Promise<void> => {
			try {
				const response = await apiGet<EventData>("/event/");

				if (response) {
					setEventData(response);
				}
			} catch (error: unknown) {
				if (error instanceof Error) {
					console.error(error.message);
				}
			}
		};

		void fetchEventData();
	}, []);

	useEffect(() => {
		if (!eventId) {
			return;
		}

		const fetchSeatingData = async (): Promise<void> => {
			try {
				const response = await apiGet<SeatingData>(`/event-tickets?eventId=${eventId}`);

				if (response) {
					setSeatingData(response);
				}
			} catch (error: unknown) {
				if (error instanceof Error) {
					console.error(error.message);
				}
			}
		};

		void fetchSeatingData();
	}, [eventId]);

	console.log(eventData);
	console.log(seatingData);

	const isLoggedIn = false;
	
	return (
		<div className="flex flex-col grow">
			{/* header (wrapper) */}
			<nav className="sticky top-0 left-0 right-0 bg-white border-b border-zinc-200 flex justify-center">
				{/* inner content */}
				<div className="max-w-screen-lg p-4 grow flex items-center justify-between gap-3">
					{/* application/author image/logo placeholder */}
					<div className="max-w-[250px] w-full flex">
						<div className="bg-zinc-100 rounded-md size-12" />
					</div>
					{/* app/author title/name placeholder */}
					<div className="bg-zinc-100 rounded-md h-8 w-[200px]" />
					{/* user menu */}
					<div className="max-w-[250px] w-full flex justify-end">
						{
							isLoggedIn ? (
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="ghost">
											<div className="flex items-center gap-2">
												<Avatar>
													<AvatarImage src={`https://source.boringavatars.com/marble/120/<user-email>?colors=25106C,7F46DB`} />
													<AvatarFallback>CN</AvatarFallback>
												</Avatar>
												
												<div className="flex flex-col text-left">
													<span className="text-sm font-medium">John Doe</span>
													<span className="text-xs text-zinc-500">john.doe@nfctron.com</span>
												</div>
											</div>
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent className="w-[250px]">
										<DropdownMenuLabel>John Doe</DropdownMenuLabel>
										<DropdownMenuSeparator />
										<DropdownMenuGroup>
											<DropdownMenuItem disabled>
												Logout
											</DropdownMenuItem>
										</DropdownMenuGroup>
									</DropdownMenuContent>
								</DropdownMenu>
							) : (
								<Button disabled variant="secondary">
									Login or register
								</Button>
							)
						}
					</div>
				</div>
			</nav>
			
			{/* main body (wrapper) */}
			<main className="grow flex flex-col justify-center">
				{/* inner content */}
				<div className="max-w-screen-lg m-auto p-4 flex items-start grow gap-3 w-full">
					{/* seating card */}
					<div className="bg-white rounded-md grow p-3 self-stretch shadow-sm" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(40px, 1fr))',gridAutoRows: '40px'}}>

						{seatingData?.seatRows.map((seatRow, rowIndex) => (
							<React.Fragment key={rowIndex}>
								<div className="flex justify-start items-center gap-1 my-1">
									<p className="text-zinc-400 font-medium">{seatRow.seatRow}</p>
									{
										seatRow.seats.map((seat) => (
											<Seat key={seat.place} seatData={seat}/>
										))
									}
								</div>
							</React.Fragment>
						))}

					</div>
					
					{/* event info */}
					<aside className="w-full max-w-sm bg-white rounded-md shadow-sm p-3 flex flex-col gap-2">
						{eventData ? (
							<>
								{/* event header image placeholder */}
								<div className="bg-zinc-100 rounded-md h-32" style={{ backgroundImage: `url(${eventData?.headerImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
								{/* event name */}
								<h1 className="text-xl text-zinc-900 font-semibold">{eventData?.namePub}</h1>
								{/* event description */}
								<p className="text-sm text-zinc-500">{eventData?.description}</p>
								{/* event date, time and place */}
								<small className="text-xs text-zinc-900"><em>Datum zahájení: {eventData?.dateFrom?.slice(0, 10)} v {eventData?.dateFrom?.slice(11, 16)}</em></small>
								<small className="text-xs text-zinc-900"><em>Datum ukončení: {eventData?.dateTo?.slice(0, 10)} v {eventData?.dateTo?.slice(11, 16)}</em></small>
								<small className="text-xs text-zinc-900"><em>Místo konání: {eventData?.place.slice(12, )}</em></small>
							</>
						) : 
							(
								<>
									{/* event loading state (spiner) */}
									<div className="flex min-h-48 items-center justify-center" role="status" aria-label="Loading event">
										<div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-800" />
										<span className="sr-only">Loading event...</span>
									</div>
								</>
							) }

						{/* add to calendar button */}
						<Button variant="secondary">
							Add to calendar
						</Button>
					</aside>
				</div>
			</main>
			
			{/* bottom cart affix (wrapper) */}
			<nav className="sticky bottom-0 left-0 right-0 bg-white border-t border-zinc-200 flex justify-center">
				{/* inner content */}
				<div className="max-w-screen-lg p-6 flex justify-between items-center gap-4 grow">
					{/* total in cart state */}
					<div className="flex flex-col">
						<span>Total for [?] tickets</span>
						<span className="text-2xl font-semibold">[?] CZK</span>
					</div>
					
					{/* checkout button */}
					<Button disabled variant="default">
						Checkout now
					</Button>
				</div>
			</nav>
		</div>
	);
}

export default App;
