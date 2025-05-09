import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

// interface Word {
//   word: string;
//   timeStart?: number;
// }

// Default words as fallback
const defaultWords = [
  'Money', 'Power', 'Family', 'Duty', 'Leadership',
  'Challenge', 'Conflict', 'Success', 'Failure', 'Respect',
  'Honor', 'Courage', 'Discipline', 'Loyalty', 'Integrity'
];

export default function WatTest() {
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [testWords, setTestWords] = useState<string[]>([]);
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [timePerWord, setTimePerWord] = useState(15);
  const [timeRemaining, setTimeRemaining] = useState(timePerWord);
  const [customWordInput, setCustomWordInput] = useState('');
  const [wordsToUse, setWordsToUse] = useState<string[]>(defaultWords);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Initialize test with shuffled words
  useEffect(() => {
    const shuffled = [...wordsToUse]
      .sort(() => Math.random() - 0.5)
      .slice(0, 10);
    setTestWords(shuffled);
  }, [wordsToUse]);

  // Timer for each word
  useEffect(() => {
    if (!isTestStarted || currentWordIndex < 0 || currentWordIndex >= testWords.length) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Move to next word when time expires
          moveToNextWord();
          return timePerWord;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTestStarted, currentWordIndex, timePerWord, testWords.length]);

  // Handle ESC key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        exitFullscreen();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Monitor fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleCustomWordsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomWordInput(e.target.value);
  };

  const processCustomWords = () => {
    if (customWordInput.trim()) {
      // Split by commas, newlines, or spaces and filter out empty strings
      const words = customWordInput
        .split(/[,\n\s]+/)
        .map(word => word.trim())
        .filter(word => word.length > 0);
      
      if (words.length > 0) {
        setWordsToUse(words);
        return words;
      }
    }
    
    // Fallback to default words if custom input is invalid
    setWordsToUse(defaultWords);
    return defaultWords;
  };

  const enterFullscreen = async () => {
    try {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      }
    } catch (err) {
      console.error('Failed to enter fullscreen mode:', err);
    }
  };

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(err => {
        console.error('Error exiting fullscreen:', err);
      });
    }
  };

  const startTest = async () => {
    // Process custom words if they exist
    const wordsForTest = processCustomWords();
    
    // Update test words with the appropriate set
    const shuffled = [...wordsForTest]
      .sort(() => Math.random() - 0.5)
      .slice(0, 10);
    
    setTestWords(shuffled);
    
    // Enter fullscreen before starting test
    await enterFullscreen();
    
    setIsTestStarted(true);
    setCurrentWordIndex(0);
    setTimeRemaining(timePerWord);
  };

  const moveToNextWord = () => {
    // Move to next word or end test
    if (currentWordIndex < testWords.length - 1) {
      const nextIndex = currentWordIndex + 1;
      setCurrentWordIndex(nextIndex);
      setTimeRemaining(timePerWord);
    } else {
      // End of test
      setIsTestComplete(true);
      setIsTestStarted(false);
      exitFullscreen();
    }
  };

  const resetTest = () => {
    setIsTestComplete(false);
    setCurrentWordIndex(-1);
    setCustomWordInput('');
    setWordsToUse(defaultWords);
    setTimePerWord(15);
    
    // Reinitialize with default words
    const shuffled = [...defaultWords]
      .sort(() => Math.random() - 0.5)
      .slice(0, 10);
    setTestWords(shuffled);
  };

  return (
    <div className={cn(
      "container mx-auto px-4 py-8",
      isFullscreen && "max-w-none p-0 m-0 w-screen h-screen"
    )}>
      <h1 className={cn(
        "text-3xl font-bold mb-6",
        isFullscreen && "hidden"
      )}>Word Association Test (WAT)</h1>
      
      {!isTestStarted && !isTestComplete && (
        <div className="bg-card p-6 rounded-lg shadow-md mb-8 text-card-foreground">
          <h2 className="text-xl font-semibold mb-4">Instructions</h2>
          <p className="mb-4">
            In this test, you will be shown a series of words one after another:
          </p>
          <ul className="list-disc pl-5 mb-6 space-y-2">
            <li>Each word will appear for the set amount of time</li>
            <li>Words will automatically change after {timePerWord} seconds</li>
            <li>The test will run in fullscreen mode for better focus</li>
            <li>Press ESC key anytime to exit fullscreen</li>
          </ul>
          
          <div className="bg-muted/50 p-4 rounded-md mb-6 border border-muted">
            <h3 className="text-md font-medium mb-2">💡 Need word ideas?</h3>
            <p className="text-sm mb-3">
              Try this prompt with ChatGPT or any AI assistant to generate appropriate words:
            </p>
            <div className="bg-muted p-3 rounded text-sm font-mono whitespace-pre-wrap">
              Generate a list of 15-20 neutral, evocative words suitable for a word association test. 
              Include a mix of concrete nouns, abstract concepts, and emotional terms. 
              Format as a simple comma-separated list.
            </div>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(
                  "Generate a list of 15-20 neutral, evocative words suitable for a word association test. Include a mix of concrete nouns, abstract concepts, and emotional terms. Format as a simple comma-separated list."
                ).then(() => {
                  alert("Prompt copied to clipboard!");
                }).catch(err => {
                  console.error('Failed to copy text: ', err);
                });
              }}
              className="mt-3 text-xs bg-muted-foreground/20 hover:bg-muted-foreground/30 text-foreground px-2 py-1 rounded transition-colors"
            >
              Copy to clipboard
            </button>
          </div>
          
          <div className="space-y-6 mb-6">
            <div>
              <label htmlFor="customWords" className="block text-sm font-medium mb-2">
                Enter your own words (separated by commas, spaces, or new lines):
              </label>
              <textarea
                id="customWords"
                value={customWordInput}
                onChange={handleCustomWordsChange}
                className="w-full p-3 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px]"
                placeholder="e.g. Ocean, Mountain, Desert, Forest, River..."
              />
            </div>
            
            <div>
              <label htmlFor="timePerWord" className="block text-sm font-medium mb-2">
                Time per word (seconds):
              </label>
              <input
                type="number"
                id="timePerWord"
                value={timePerWord}
                onChange={(e) => setTimePerWord(Math.max(1, Math.min(60, parseInt(e.target.value) || 15)))}
                className="w-full p-3 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                min="1"
                max="60"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Choose between 1-60 seconds (default: 15 seconds)
              </p>
            </div>
          </div>
          
          <button 
            onClick={startTest}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 transition"
          >
            Start Test in Fullscreen
          </button>
        </div>
      )}

      {isTestStarted && (
        <div className={cn(
          "bg-card rounded-lg shadow-md text-card-foreground flex flex-col items-center justify-center",
          isFullscreen ? "w-full h-full" : "p-6 min-h-[300px]"
        )}>
          <div className={cn(
            "flex justify-between items-center mb-8 w-full",
            isFullscreen && "px-6 pt-6"
          )}>
            <span className="text-lg font-medium">
              Word {currentWordIndex + 1} of {testWords.length}
            </span>
            <span className={cn(
              "text-lg font-medium",
              timeRemaining <= Math.min(5, Math.floor(timePerWord / 3)) && "text-destructive animate-pulse"
            )}>
              Next word in: {timeRemaining}s
            </span>
          </div>
          
          <h2 className={cn(
            "font-bold text-center mb-8 animate-fadeIn",
            isFullscreen ? "text-8xl" : "text-6xl"
          )}>
            {testWords[currentWordIndex]}
          </h2>
          
          <div className={cn(
            "w-full bg-muted rounded-full h-2",
            isFullscreen ? "max-w-3xl mx-auto px-6 mb-6" : "mt-8"
          )}>
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-1000"
              style={{ width: `${(timeRemaining / timePerWord) * 100}%` }}
            ></div>
          </div>
          
          {isFullscreen && (
            <div className="absolute bottom-4 right-4 text-sm text-muted-foreground">
              Press ESC to exit fullscreen
            </div>
          )}
        </div>
      )}

      {isTestComplete && (
        <div className="bg-card p-6 rounded-lg shadow-md text-card-foreground">
          <h2 className="text-2xl font-semibold mb-6">Test Completed!</h2>
          
          <p className="mb-6">You've viewed all the words in the sequence.</p>
          
          <div className="border border-border rounded-md overflow-hidden mb-6">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Word</th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {testWords.map((word, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{word}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6">
            <button 
              onClick={resetTest}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 transition"
            >
              Take Test Again
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}