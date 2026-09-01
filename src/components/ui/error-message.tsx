interface ErrorMessageProps {
	message: string;
}

export function ErrorMessage({message}: ErrorMessageProps) {
	return (
		<div className="flex min-h-48 items-center justify-center p-4" role="alert">
			<p className="max-w-sm text-center text-sm text-red-500">
				{message}
			</p>
		</div>
	);
}