import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TextInput } from './components/TextInput';
import { HighlightView } from './components/HighlightView';
import { ReaderControls } from './components/ReaderControls';
import { useSpeech } from './hooks/useSpeech';

function App() {
  const [text, setText] = useState('');
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [highlightLength, setHighlightLength] = useState(0);

  // Initialize rate from localStorage
  // usage: passed to useSpeech via some mechanism? 
  // No, useSpeech has internal state. We should probably sync it.
  // But for MVP, let's just let useSpeech handle its default and we set it on mount if needed.
  // Actually, useSpeech exposed setRate. We can use an effect.

  const { isPlaying, isPaused, rate, setRate, speak, pause, resume, stop } = useSpeech({
    onBoundary: (index, length) => {
      setHighlightIndex(index);
      setHighlightLength(length || 0);
    },
    onEnd: () => {
      setHighlightIndex(0);
      setHighlightLength(0);
    }
  });

  // Load persistence
  useEffect(() => {
    const savedRate = localStorage.getItem('speech-rate');
    if (savedRate) {
      const parsed = parseFloat(savedRate);
      if (!isNaN(parsed) && parsed >= 0.5 && parsed <= 3.0) {
        setRate(parsed);
      } else {
        // Reset invalid cache
        localStorage.removeItem('speech-rate');
        setRate(1.0);
      }
    }
  }, [setRate]); // setRate is stable from hook

  const handleRateChange = (newRate: number) => {
    // Sanitize input
    const clamped = Math.min(Math.max(newRate, 0.5), 3.0);
    setRate(clamped);
    localStorage.setItem('speech-rate', clamped.toString());
  };

  const handlePlay = () => {
    if (isPaused) {
      resume();
    } else {
      speak(text);
    }
  };

  const showHighlight = isPlaying || isPaused;

  return (
    <div className="min-h-screen bg-off-white dark:bg-soft-black transition-colors duration-300 flex flex-col font-sans">
      <Header />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 md:px-8 pb-32 pt-4">
        <div className="h-[60vh] md:h-[70vh] w-full">
          {showHighlight ? (
            <HighlightView
              text={text}
              highlightIndex={highlightIndex}
              highlightLength={highlightLength}
              onJump={(index) => speak(text, index)}
            />
          ) : (
            <TextInput
              value={text}
              onChange={setText}
              placeholder="Cole seu texto aqui para ouvir..."
            />
          )}
        </div>
      </main>

      <ReaderControls
        isPlaying={isPlaying}
        isPaused={isPaused}
        rate={rate}
        onPlay={handlePlay}
        onPause={pause}
        onStop={stop}
        onRateChange={handleRateChange}
      />
    </div>
  );
}

export default App;
