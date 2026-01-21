import { cn } from '../lib/utils';

interface TextInputProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
    placeholder?: string;
    disabled?: boolean;
}

export const TextInput = ({ value, onChange, className, placeholder, disabled }: TextInputProps) => {
    return (
        <div className={cn("relative w-full h-full flex flex-col", className)}>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder || "Cole seu texto aqui..."}
                disabled={disabled}
                className={cn(
                    "w-full flex-1 bg-transparent resize-none outline-none border-none",
                    "text-lg md:text-xl lg:text-2xl leading-relaxed font-sans text-soft-black dark:text-off-white",
                    "placeholder:text-gray-400 dark:placeholder:text-gray-600",
                    "transition-opacity duration-200",
                    disabled && "opacity-50 cursor-not-allowed"
                )}
                spellCheck={false}
            />

            <div className="absolute bottom-4 right-4 text-xs font-mono text-gray-400 dark:text-gray-600 pointer-events-none">
                {value.length} caracteres
            </div>
        </div>
    );
};
