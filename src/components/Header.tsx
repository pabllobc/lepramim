import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export const Header = () => {
    // Simple dark mode toggle logic
    // Typically this would be in a context, but for MVP local state/effect is fine relative to body class
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // Check system preference or localStorage
        const stored = localStorage.getItem('theme');
        if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setIsDark(true);
            document.documentElement.classList.add('dark');
        } else {
            setIsDark(false);
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleTheme = () => {
        const newDark = !isDark;
        setIsDark(newDark);
        if (newDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    return (
        <header className="flex justify-between items-center py-6 px-4 md:px-8 max-w-4xl mx-auto w-full">
            <h1 className="text-2xl font-bold tracking-tight text-soft-black dark:text-off-white">
                lepramim
            </h1>

            <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                aria-label="Alternar tema"
            >
                {isDark ? <Sun className="w-5 h-5 text-off-white" /> : <Moon className="w-5 h-5 text-soft-black" />}
            </button>
        </header>
    );
};
