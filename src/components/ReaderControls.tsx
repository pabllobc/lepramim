import { Play, Pause, Square } from 'lucide-react';
import { cn } from '../lib/utils';

interface ReaderControlsProps {
    isPlaying: boolean;
    isPaused: boolean;
    rate: number;
    onPlay: () => void;
    onPause: () => void;
    onStop: () => void;
    onRateChange: (rate: number) => void;
}

export const ReaderControls = ({
    isPlaying,

    rate,
    onPlay,
    onPause,
    onStop,
    onRateChange
}: ReaderControlsProps) => {


    const handlePlayPause = () => {
        if (isPlaying) {
            onPause();
        } else {
            onPlay();
        }
    };

    const speedOptions = [0.75, 1.0, 1.5, 2.0];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-soft-black/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 p-4 shadow-2xl transition-all duration-300 z-50">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">

                {/* Playback Buttons */}
                <div className="flex items-center gap-4">
                    {/* Stop / Reset - returns to edit mode conceptually if handled by parent */}
                    <button
                        onClick={onStop}
                        className="p-3 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 dark:text-gray-400 transition-colors"
                        aria-label="Parar"
                    >
                        <Square className="w-5 h-5 fill-current" />
                    </button>

                    <button
                        onClick={handlePlayPause}
                        className="p-4 rounded-full bg-pastel-blue dark:bg-pastel-green text-soft-black hover:brightness-105 shadow-lg transition-transform active:scale-95"
                        aria-label={isPlaying ? "Pausar" : "Ouvir"}
                    >
                        {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
                    </button>
                </div>

                {/* Speed Control */}
                <div className="flex items-center gap-4 w-full md:w-auto bg-gray-100 dark:bg-white/5 p-2 rounded-xl">
                    <span className="text-xs font-bold uppercase text-gray-500 ml-2">Velocidade</span>

                    {/* Slider for fine control */}
                    <input
                        type="range"
                        min="0.5"
                        max="3.0"
                        step="0.1"
                        value={rate}
                        onChange={(e) => onRateChange(parseFloat(e.target.value))}
                        className="w-24 md:w-32 accent-pastel-blue dark:accent-pastel-green h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                    />

                    <div className="flex gap-1 bg-gray-200 dark:bg-white/10 p-1 rounded-lg">
                        {speedOptions.map(option => {
                            const isActive = Math.abs(rate - option) < 0.05;
                            return (
                                <button
                                    key={option}
                                    onClick={() => onRateChange(option)}
                                    className={cn(
                                        "px-3 py-1.5 text-xs rounded-md transition-all duration-300 font-medium relative z-10",
                                        isActive
                                            ? "bg-white dark:bg-soft-black text-soft-black dark:text-off-white shadow-md scale-105"
                                            : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                    )}
                                >
                                    {option}x
                                </button>
                            );
                        })}
                    </div>

                    <span className="text-sm font-mono w-10 text-right text-soft-black dark:text-off-white mr-2">
                        {rate.toFixed(1)}x
                    </span>
                </div>

            </div>
        </div>
    );
};
