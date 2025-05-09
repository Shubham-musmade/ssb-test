import { useState, useEffect } from 'react';

// Sample prompt for generating situations in JSON format
const situationGenerationPrompt = `Generate SSB (Services Selection Board) interview situations for a Situation Reaction Test (SRT). Create 10-15 realistic scenarios that test a candidate's leadership, decision-making, integrity, teamwork, and problem-solving abilities in military and civilian contexts.

The response should be in JSON format as an array of strings:
[
  "Your captain falls ill and the team is left with no leader. He tells you to lead the mission...",
  "During a field exercise, you notice one of your team members tampering with their equipment to avoid participating...",
  "..."
]

Include situations that test:
- Leadership under pressure
- Crisis management in military/civilian settings
- Ethical decision-making
- Team conflicts and their resolution
- Resource management in limited situations
- Handling subordinates' personal problems
- Dealing with casualties or injuries
- Quick thinking in emergency scenarios
- Balancing mission objectives with team safety
- Moral dilemmas
- Handling insubordination
- Physical courage and mental resilience
- Adapting to unexpected changes
- Managing conflicting orders or unclear directives`;

// Sample situations in JSON format
const sampleSituationsJson = [
  "You see a senior citizen struggling to cross a busy road.",
  "You find a wallet with cash and ID cards on the street.",
  "Your friend asks you to help them cheat on an important exam.",
  "You witness a colleague taking credit for your work during a meeting.",
  "You notice your subordinate is frequently late but works efficiently."
];

export default function SrtTest() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [situations, setSituations] = useState<string[]>([]);
  const [jsonInput, setJsonInput] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [totalTestTime, setTotalTestTime] = useState(5); // Default 5 minutes
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerInterval, setTimerInterval] = useState<number | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [jsonError, setJsonError] = useState('');

  useEffect(() => {
    // Exit fullscreen when test is complete or not started
    if (!isTestStarted || isTestComplete) {
      exitFullscreen();
    }

    // Cleanup timer on unmount
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [isTestStarted, isTestComplete]);

  const enterFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen()
        .then(() => setIsFullScreen(true))
        .catch((err) => console.error(`Error attempting to enable full-screen mode: ${err.message}`));
    }
  };

  const exitFullscreen = () => {
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen()
        .then(() => setIsFullScreen(false))
        .catch((err) => console.error(`Error attempting to exit full-screen mode: ${err.message}`));
    }
  };

  const parseSituationsFromJson = () => {
    if (!jsonInput.trim()) {
      setJsonError('Please enter JSON data');
      return;
    }

    try {
      // Parse the JSON input
      const parsedData = JSON.parse(jsonInput);
      
      // Check if it's an array
      if (!Array.isArray(parsedData)) {
        setJsonError('JSON data must be an array of strings');
        return;
      }
      
      // Check if all items are strings
      if (!parsedData.every(item => typeof item === 'string')) {
        setJsonError('All items in the array must be strings');
        return;
      }
      
      // Filter out empty strings
      const validSituations = parsedData.filter(item => item.trim() !== '');
      
      if (validSituations.length === 0) {
        setJsonError('No valid situations found in the JSON data');
        return;
      }
      
      // Set the situations
      setSituations(validSituations);
      setJsonError('');
    } catch (error) {
      setJsonError('Invalid JSON format. Please check your input.');
    }
  };

  const loadSampleJson = () => {
    setJsonInput(JSON.stringify(sampleSituationsJson, null, 2));
  };

  const copyPromptToClipboard = () => {
    navigator.clipboard.writeText(situationGenerationPrompt)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  const startTest = () => {
    // Don't start if no situations are added
    if (situations.length === 0) {
      alert("Please add situations from JSON data before starting the test.");
      return;
    }
    
    // Enter fullscreen
    enterFullscreen();
    
    // Start the test
    setIsTestStarted(true);
    setCurrentIndex(0);
    setTimeLeft(totalTestTime * 60); // Convert minutes to seconds
    
    // Start timer for the entire test
    const interval = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // End test when time runs out
          completeTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    setTimerInterval(interval);
  };

  const moveToNext = () => {
    if (currentIndex < situations.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      completeTest();
    }
  };

  const moveToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const completeTest = () => {
    if (timerInterval) clearInterval(timerInterval);
    setIsTestComplete(true);
    setIsTestStarted(false);
  };

  const resetTest = () => {
    setSituations([]);
    setJsonInput('');
    setJsonError('');
    setIsTestComplete(false);
    setCurrentIndex(0);
    setTotalTestTime(5);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className={`container mx-auto px-4 py-8 ${isFullScreen ? 'h-screen flex flex-col' : ''}`}>
      <h1 className="text-3xl font-bold mb-6">Situation Reaction Test (SRT)</h1>
      
      {!isTestStarted && !isTestComplete && (
        <div className="bg-card p-6 rounded-lg shadow-md mb-8 text-card-foreground">
          <h2 className="text-xl font-semibold mb-4">Instructions</h2>
          <p className="mb-4">
            In this test, you will be presented with a series of situations.
          </p>
          <ul className="list-disc pl-5 mb-6 space-y-2">
            <li>Add situations using JSON format in the input field below</li>
            <li>Use the provided prompt to generate situations in JSON format</li>
            <li>Set the total time for the test</li>
            <li>Start the test to see the situations in fullscreen mode</li>
          </ul>
          
          <div className="space-y-6 mb-6">
            {/* Prompt for generating situations - non-editable with copy button */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium">
                  Prompt for generating situations:
                </label>
                <button 
                  type="button"
                  onClick={copyPromptToClipboard}
                  className="text-sm text-blue-500 hover:bg-blue-50 transition px-2 py-1 rounded-md flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  {isCopied ? "Copied!" : "Copy"}
                </button>
              </div>
              <div className="w-full p-3 border border-input rounded-md bg-muted/50 whitespace-pre-wrap text-sm h-48 overflow-y-auto">
                {situationGenerationPrompt}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Copy this prompt and use it with an AI tool to generate situations in JSON format, then paste the result below.
              </p>
            </div>
            
            {/* JSON Input */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="jsonInput" className="block text-sm font-medium">
                  Situations (JSON Array of Strings):
                </label>
                <button 
                  type="button"
                  onClick={loadSampleJson}
                  className="text-sm text-blue-500 hover:underline"
                >
                  Load Sample JSON
                </button>
              </div>
              <textarea
                id="jsonInput"
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                rows={8}
                className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${jsonError ? 'border-destructive' : 'border-input'}`}
                placeholder='[
  "Situation 1 description",
  "Situation 2 description",
  "..."
]'
              />
              {jsonError && (
                <p className="mt-1 text-sm text-destructive">
                  {jsonError}
                </p>
              )}
              <div className="mt-2">
                <button 
                  type="button"
                  onClick={parseSituationsFromJson}
                  className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/90 transition"
                >
                  Parse JSON Data
                </button>
              </div>
            </div>
            
            {/* Parsed situations list */}
            {situations.length > 0 && (
              <div>
                <h3 className="text-md font-medium mb-2">Parsed situations ({situations.length}):</h3>
                <ul className="bg-muted rounded-md divide-y divide-border max-h-60 overflow-y-auto">
                  {situations.map((situation, idx) => (
                    <li key={idx} className="p-3">
                      <span>{idx + 1}. {situation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Time setting */}
            <div>
              <label htmlFor="totalTime" className="block text-sm font-medium mb-2">
                Total Test Time (in minutes):
              </label>
              <input
                id="totalTime"
                type="number"
                min="1"
                max="60"
                value={totalTestTime}
                onChange={(e) => setTotalTestTime(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full p-3 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          
          <button 
            onClick={startTest}
            disabled={situations.length === 0}
            className={`px-6 py-2 rounded-md transition ${
              situations.length === 0 
              ? 'bg-muted text-muted-foreground cursor-not-allowed' 
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }`}
          >
            Start Test
          </button>
        </div>
      )}
      
      {isTestStarted && (
        <div className={`bg-card p-6 rounded-lg shadow-md text-card-foreground ${isFullScreen ? 'flex-1 flex flex-col' : ''}`}>
          <div className="flex justify-between items-center mb-6">
            <span className="text-lg font-medium">
              Situation {currentIndex + 1} of {situations.length}
            </span>
            <span className={`text-lg font-medium ${timeLeft <= 60 ? 'text-destructive animate-pulse' : ''}`}>
              Time Remaining: {formatTime(timeLeft)}
            </span>
          </div>
          
          <div className="mb-6 p-4 bg-muted rounded-md flex-1 flex flex-col justify-center">
            <h2 className="text-xl font-medium mb-4 text-muted-foreground">Situation:</h2>
            <p className="text-lg text-center py-8">{situations[currentIndex]}</p>
          </div>
          
          <div className="flex justify-between mt-auto">
            <button 
              type="button"
              onClick={completeTest}
              className="bg-destructive text-destructive-foreground px-6 py-3 rounded-md hover:bg-destructive/90 transition font-medium"
            >
              End Test
            </button>
            
            <div className="flex gap-3">
              <button 
                type="button"
                onClick={moveToPrevious}
                disabled={currentIndex === 0}
                className={`px-6 py-3 rounded-md transition font-medium ${
                  currentIndex === 0 
                  ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/90'
                }`}
              >
                Previous Situation
              </button>
              
              <button 
                type="button"
                onClick={moveToNext}
                className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition font-medium"
              >
                Next Situation
              </button>
            </div>
          </div>
        </div>
      )}
      
      {isTestComplete && (
        <div className="bg-card p-6 rounded-lg shadow-md text-card-foreground">
          <h2 className="text-2xl font-semibold mb-6">Test Completed!</h2>
          
          <div className="space-y-6">
            {situations.map((situation, index) => (
              <div key={index} className="border border-border rounded-md p-4">
                <h3 className="font-medium mb-2">Situation {index + 1}:</h3>
                <p className="bg-muted p-3 rounded mb-4">{situation}</p>
              </div>
            ))}
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
    </div>
  );
}