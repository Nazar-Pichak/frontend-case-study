interface SpinnerProps {
    label?: string;
}

export function Spinner({ label = 'Loading data' }: SpinnerProps) {
    return (
        <div className="flex min-h-48 items-center justify-center" role="status" aria-label={label}>
            <div className="size-8 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-800" aria-hidden="true"/>
            <span className="sr-only">{label}...</span>
        </div>
    );
}