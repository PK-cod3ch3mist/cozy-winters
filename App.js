const { useState, useEffect, useCallback, useRef } = React;

/* =========================================
    MODULE: DATA & CONFIGURATION
    ========================================= */

const USER_WORDS = [
  "POSCA",
  "WASHI",
  "TRADE",
  "SPORT",
  "MODEL",
  "CHESS",
  "DIARY",
  "COLLEGE",
  "DASHI",
  "DELISH",
  "MALKA",
  "SACHDEVA",
  "ECHOES",
  "CHILIS",
  "DARYAGANJ",
  "DOSACOFFEE",
  "BISTRO",
  "BUZZ",
  "BLUETOKAI",
  "SUSHI",
  "KURKURE",
  "KACHORI",
  "PANEER",
  "POPCORN",
  "MACCHIATO",
  "LATTE",
  "FALAFEL",
  "BURRITO",
  "KULCHA",
  "COOKIE",
  "SANDWICH",
  "MAVERICKS",
  "DONCIC",
  "MEGHALAYA",
  "MEXICAN",
  "OUTSIDERS",
  "AASHIQTERA",
  "CARAMEL",
  "QUIZ",
  "KEARNEY",
  "FLUTE",
  // Summer additions:
  "VIKRANT",
  "TEMPLE",
  "CLIFF",
  "ARCHAEOLOGY",
  "TOWEL",
  "SHELL",
  "TOSSINPIZZA",
  "SAREE",
  "EXCEL",
  "DUNKS",
  "PUMPS",
];

const WINTER_CONFIG = [
  {
    date: "2025-12-23",
    type: "WORDLE",
    title: "Wordle: Day 1",
    target: "POSCA",
    hint: "My first gift to you (i think)...",
    reward: "assets/wordle1.jpg",
  },
  {
    date: "2025-12-24",
    type: "STRANDS",
    title: "Strands: Places Together",
    theme: "Places together",
    file: "assets/strand1.json",
  },
  {
    date: "2025-12-25",
    type: "WORDLE",
    title: "Wordle: Day 3",
    target: "WASHI",
    hint: "Blinkit can be so cool sometimes...",
    reward: "assets/wordle2.jpg",
  },
  {
    date: "2025-12-26",
    type: "BEE",
    title: "Spelling Bee: Name Game",
    center: "A",
    letters: ["R", "I", "Y", "J", "N", "P"],
    msg: "Letters of your name (had to add a P to make it 7 letters :P)",
  },
  {
    date: "2025-12-27",
    type: "WORDLE",
    title: "Wordle: Day 5",
    target: "TRADE",
    hint: "Oye Alpha!",
    reward: "assets/wordle3.jpg",
  },
  {
    date: "2025-12-28",
    type: "STRANDS",
    title: "Strands: Yum Yum",
    theme: "Yum yum yum",
    file: "assets/strand2.json",
    reward: "assets/strand2.jpg",
  },
  {
    date: "2025-12-28",
    type: "WORDLE",
    title: "Wordle: Day 7",
    target: "SPORT",
    hint: "Oye?",
    reward: "assets/wordle4.jpg",
  },
  {
    date: "2025-12-29",
    type: "WORDLE",
    title: "Another wordle?? Wow",
    target: "FIFTH",
    hint: "Cause you're so classic!",
    reward: "assets/wordlebonus.jpg",
  },
  {
    date: "2025-12-29",
    type: "WORDLE",
    title: "How many in a day??",
    target: "CRAFT",
    hint: "No hints this time",
    reward: "assets/wordlehuh.jpg",
  },
  {
    date: "2025-12-30",
    type: "BEE",
    title: "Spelling Bee: My Turn",
    center: "T",
    letters: ["P", "R", "A", "U", "S", "H"],
    msg: "Letters of mine (if someone butchered the pronunciation XD)",
  },
  {
    date: "2025-12-31",
    type: "WORDLE",
    title: "Wordle: New Year",
    target: "MODEL",
    hint: "Not a hint: aren't metro pickups also dreamy?",
    reward: "assets/wordle5.jpg",
  },
  {
    date: "2026-01-01",
    type: "STRANDS",
    title: "Strands: 4:45",
    theme: "Four forty five",
    file: "assets/strand3.json",
    reward: "assets/strand3.jpg",
  },
  {
    date: "2026-01-02",
    type: "WORDLE",
    title: "Wordle: Day 11",
    target: "CHESS",
    hint: "Not a hint: first photo together yaad hai?",
    reward: "assets/wordle6.jpg",
  },
  {
    date: "2026-01-03",
    type: "BEE",
    title: "Spelling Bee: Hoops",
    center: "E",
    letters: ["B", "A", "S", "K", "T", "L"],
    msg: "Can you score more than an NBA game?",
  },
  {
    date: "2026-01-04",
    type: "WORDLE",
    title: "Wordle: Finale",
    target: "DIARY",
    hint: "Not a hint: this one took time to decide.",
    reward: "assets/wordle7.jpg",
  },
];

const SUMMER_CONFIG = [
  {
    date: "2026-05-14",
    type: "WORDLE",
    title: "Wordle: New Seasons",
    target: "CLIFF",
    hint: "A leap of faith (wary of the bushes)",
    reward: "assets/summer1.mp4",
  },
  {
    date: "2026-05-15",
    type: "MEMORY",
    title: "Pairs: Ones like us",
    emojis: ["☀️", "🍦", "🍉", "🌊", "🏖️", "🐚", "🌴", "🌺"],
    hint: "Find the matching summer vibes!",
  },
  {
    date: "2026-05-16",
    type: "WORDLE",
    title: "Wordle: Day 2",
    target: "TOWEL",
    hint: "Took my breath away",
    reward: "assets/summer2.mp4",
  },
  {
    date: "2026-05-17",
    type: "HANGMAN",
    title: "Lemonade: And filter coffee",
    target: "VIKRANT",
    hint: "First of many.",
  },
  {
    date: "2026-05-17",
    type: "PURBLE",
    title: "Outfit Match: Beach Day",
    target: { hat: 1, glasses: 2, shirt: 0, shoes: 1 },
    hint: "Memorize the outfit before it disappears!",
    reward: "assets/summer8.mp4",
  },
  {
    date: "2026-05-18",
    type: "WORDLE",
    title: "Wordle: White",
    target: "EXCEL",
    hint: "In bed, or is it?",
    reward: "assets/summer3.mp4",
  },
  {
    date: "2026-05-19",
    type: "HANGMAN",
    title: "Lemonade: And a puzzle",
    target: "ARCHAEOLOGY",
    hint: "Kid Riya's day one offer",
  },
  {
    date: "2026-05-20",
    type: "WORDLE",
    title: "Wordle: Play",
    target: "BLINK",
    hint: "Enough to sleep or vibe",
    reward: "assets/summer4.mp4",
  },
  {
    date: "2026-05-21",
    type: "MEMORY",
    title: "Pairs: A competition?",
    emojis: ["🐫", "🥈", "🎹", "🪈", "🍸", "🌻", "☕️", "👙"],
    hint: "Find the matching summer vibes!",
  },
  {
    date: "2026-05-22",
    type: "WORDLE",
    title: "Wordle: Vacay",
    target: "SHELL",
    hint: "Always on the shelf",
    reward: "assets/summer5.mp4",
  },
  {
    date: "2026-05-23",
    type: "HANGMAN",
    title: "Lemonade: And some sides",
    target: "TOSSINPIZZA",
    hint: "Maid-sama sesh?",
  },
  {
    date: "2026-05-24",
    type: "WORDLE",
    title: "Wordle: Gorjusss",
    target: "SAREE",
    hint: "Owned it",
    reward: "assets/summer6.mp4",
  },
  {
    date: "2026-05-25",
    type: "BEE",
    title: "Spelling Bee: Hug",
    center: "A",
    letters: ["Y", "I", "E", "R", "N", "G"],
    msg: "All I need right now",
  },
  {
    date: "2026-05-26",
    type: "WORDLE",
    title: "Wordle: Courage",
    target: "DUNKS",
    hint: "Golden state",
    reward: "assets/summer7.mp4",
  },
  {
    date: "2026-05-27",
    type: "HANGMAN",
    title: "Lemonade: Riya Jain",
    target: "TEMPLE",
    hint: "Auspicious start?",
  },
  {
    date: "2026-05-28",
    type: "WORDLE",
    title: "Wordle: Tarantino",
    target: "PUMPS",
    hint: "Black bone earth red",
    reward: "assets/summer8.mp4",
  },
  {
    date: "2026-05-29",
    type: "STRANDS",
    title: "Strands: Love",
    theme: "Love",
    file: "assets/strand4.json",
    reward: "assets/strand4.jpg",
  },
  {
    date: "2026-05-30",
    type: "WORDLE",
    title: "Wordle: Games",
    target: "CARDS",
    hint: "Off with the clothes",
    reward: "assets/summer9.mp4",
  },
  {
    date: "2026-05-31",
    type: "WORDLE",
    title: "Wordle: I miss you",
    target: "CAMEL",
    hint: "cutu, girl, baby,...",
    reward: "assets/summer10.png",
  },
  {
    date: "2026-06-14",
    type: "STRANDS",
    title: "Strands: Dating to 8 and more",
    theme: "It's a date!",
    file: "assets/strand5.json",
    reward: "assets/summerfin.mp4",
  },
];

/* =========================================
    MODULE: UTILS & SHARED UI
    ========================================= */

const checkWordValidity = async (word) => {
  if (USER_WORDS.includes(word)) return true;
  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
    );
    if (response.ok) {
      const data = await response.json();
      return Array.isArray(data) && data.length > 0;
    }
    return false;
  } catch (error) {
    return false;
  }
};

const fireConfetti = () => {
  if (typeof confetti === "function") {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#F43F5E", "#7DD3FC", "#FCD34D"],
    });
  }
};

const isLocked = (dateStr) => {
  const params = new URLSearchParams(window.location.search);
  if (params.get("dev") === "true") return false;
  const [y, m, d] = dateStr.split("-").map(Number);
  const gameDate = new Date(y, m - 1, d).setHours(0, 0, 0, 0);
  const today = new Date().setHours(0, 0, 0, 0);
  return gameDate > today;
};

const Header = ({ view, setView, darkMode, toggleDarkMode }) => (
  <header className="sticky top-0 z-40 backdrop-blur-md bg-white/70 dark:bg-slate-900/80 border-b border-gray-200 dark:border-slate-700 transition-colors">
    <div className="max-w-md mx-auto px-4 h-16 flex justify-between items-center">
      <h1
        onClick={() => setView("HOME")}
        className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 dark:from-yellow-400 dark:to-orange-500 cursor-pointer tracking-tight"
      >
        Daily Puzzle
      </h1>
      <div className="flex items-center gap-3">
        <button
          onClick={toggleDarkMode}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-yellow-400 transition-colors"
        >
          {darkMode ? (
            <i className="fa-solid fa-sun"></i>
          ) : (
            <i className="fa-solid fa-moon"></i>
          )}
        </button>
        {view === "GAME" && (
          <button
            onClick={() => setView("HOME")}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
          >
            <i className="fa-solid fa-xmark text-gray-500 dark:text-white"></i>
          </button>
        )}
      </div>
    </div>
  </header>
);

const GameShell = ({ title, hint, children }) => (
  <div className="px-4 py-6 max-w-md mx-auto animate-fade-in flex flex-col items-center">
    <h2 className="text-center text-2xl font-bold text-slate-800 dark:text-white mb-2">
      {title}
    </h2>
    {hint && (
      <p className="text-center text-sm text-slate-500 dark:text-slate-400 italic mb-8 bg-white/50 dark:bg-slate-800/50 py-2 px-4 rounded-lg">
        {hint}
      </p>
    )}
    <div className="w-full flex flex-col items-center justify-center">
      {children}
    </div>
  </div>
);

// Updated Reward Button to handle the new tab functionality securely
const RewardButton = ({ rewardUrl }) => {
  if (!rewardUrl) return null;
  return (
    <button
      onClick={() => window.open(rewardUrl, "_blank", "noopener,noreferrer")}
      className="mt-6 mb-8 px-8 py-3 bg-gradient-to-r from-green-400 to-blue-500 dark:from-yellow-400 dark:to-orange-500 text-white dark:text-slate-900 font-bold rounded-full shadow-lg transform transition hover:scale-105 active:scale-95 animate-[bounce_1s_infinite] flex items-center gap-3"
    >
      <i className="fa-solid fa-gift text-xl"></i>
      <span>See Reward</span>
    </button>
  );
};

/* =========================================
    MODULE: WORDLE GAME
    ========================================= */

const Wordle = ({ target, reward, onComplete, initialState, onSave }) => {
  const [guesses, setGuesses] = useState(initialState?.guesses || []);
  const [currentGuess, setCurrentGuess] = useState("");
  const [status, setStatus] = useState(initialState?.status || "playing");
  const [shake, setShake] = useState(false);
  const [msg, setMsg] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    onSave({ guesses, status });
  }, [guesses, status]);

  const handleKey = useCallback(
    async (key) => {
      if (status !== "playing" || isValidating) return;

      if (key === "ENTER") {
        if (currentGuess.length !== target.length)
          return showMessage("Too short");

        setIsValidating(true);
        const isValid = await checkWordValidity(currentGuess);
        setIsValidating(false);

        if (!isValid) return showMessage("Not in word list");

        const newGuesses = [...guesses, currentGuess];
        setGuesses(newGuesses);
        setCurrentGuess("");

        if (currentGuess === target) {
          setStatus("won");
          onComplete();
        } else if (newGuesses.length >= 6) {
          setStatus("lost");
        }
      } else if (key === "BACKSPACE") {
        setCurrentGuess((prev) => prev.slice(0, -1));
      } else if (currentGuess.length < target.length && /^[A-Z]$/.test(key)) {
        setCurrentGuess((prev) => prev + key);
      }
    },
    [currentGuess, status, guesses, target, isValidating],
  );

  const showMessage = (text) => {
    setMsg(text);
    setShake(true);
    setTimeout(() => setMsg(""), 2000);
    setTimeout(() => setShake(false), 500);
  };

  useEffect(() => {
    const listener = (e) => {
      if (e.key === "Enter") handleKey("ENTER");
      else if (e.key === "Backspace") handleKey("BACKSPACE");
      else handleKey(e.key.toUpperCase());
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [handleKey]);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="h-8 mb-2 w-full flex justify-center">
        {msg && (
          <div className="bg-slate-800 text-white px-4 py-1 rounded-full text-sm shadow-lg z-50">
            {msg}
          </div>
        )}
        {isValidating && (
          <div className="text-blue-500 font-bold animate-pulse text-sm">
            checking...
          </div>
        )}
      </div>

      <div
        className={`flex flex-col items-center gap-2 mb-8 ${shake ? "animate-[shake_0.5s]" : ""}`}
      >
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex gap-2">
            {[...Array(target.length)].map((_, j) => {
              const guess = guesses[i];
              const isCurrent = i === guesses.length;
              const letter = guess
                ? guess[j]
                : isCurrent && currentGuess[j]
                  ? currentGuess[j]
                  : "";

              let style =
                "border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white";
              if (guess) {
                if (guess[j] === target[j])
                  style = "bg-green-500 border-green-500 text-white";
                else if (target.includes(guess[j]))
                  style = "bg-yellow-500 border-yellow-500 text-white";
                else
                  style =
                    "bg-gray-400 border-gray-400 text-white dark:bg-slate-600 dark:border-slate-600";
              } else if (letter) {
                style =
                  "border-gray-500 dark:border-gray-400 text-slate-800 dark:text-white bg-white dark:bg-slate-800";
              }

              return (
                <div
                  key={j}
                  className={`w-14 h-14 flex items-center justify-center text-3xl font-bold uppercase select-none transition-colors duration-100 ${style}`}
                >
                  {letter}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {status === "lost" && (
        <div className="text-red-500 font-bold mb-6 bg-red-50 dark:bg-red-900/30 px-4 py-2 rounded-lg">
          Word was: {target}
        </div>
      )}
      {status === "won" && <RewardButton rewardUrl={reward} />}

      <div
        className={`flex flex-col gap-2 w-full px-1 ${status !== "playing" ? "opacity-50 pointer-events-none" : ""}`}
      >
        {["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"].map((row, i) => (
          <div key={i} className="flex justify-center gap-1.5">
            {row.split("").map((char) => {
              let color =
                "bg-gray-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-b-2 border-gray-300 dark:border-slate-900";
              for (let g of guesses) {
                if (g.includes(char)) {
                  color =
                    "bg-slate-400 dark:bg-slate-600 text-white border-slate-500";
                  for (let k = 0; k < target.length; k++) {
                    if (g[k] === char && target[k] === char)
                      return (
                        <button
                          key={char}
                          onClick={() => handleKey(char)}
                          className={`h-12 flex-1 rounded-md text-sm font-bold bg-green-500 text-white border-green-600 border-b-2`}
                        >
                          {char}
                        </button>
                      );
                  }
                  if (target.includes(char))
                    color = "bg-yellow-400 text-white border-yellow-500";
                }
              }
              return (
                <button
                  key={char}
                  onClick={() => handleKey(char)}
                  className={`h-12 flex-1 rounded-md text-sm font-bold active:scale-95 transition-colors ${color}`}
                >
                  {char}
                </button>
              );
            })}
            {i === 2 && (
              <>
                <button
                  onClick={() => handleKey("BACKSPACE")}
                  className="px-4 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 rounded-md text-lg ml-1"
                >
                  <i className="fa-solid fa-delete-left"></i>
                </button>
                <button
                  onClick={() => handleKey("ENTER")}
                  className="px-4 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300 rounded-md text-xs font-bold ml-1"
                >
                  ENT
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

/* =========================================
    MODULE: NEW GAME - HANGMAN (SAVE ICE CREAM)
    ========================================= */

const Hangman = ({ target, reward, onComplete, initialState, onSave }) => {
  const [guessedLetters, setGuessedLetters] = useState(
    initialState?.guessedLetters || [],
  );
  const [status, setStatus] = useState(initialState?.status || "playing");
  const MAX_MISTAKES = 6;

  const mistakes = guessedLetters.filter((l) => !target.includes(l)).length;
  const triesLeft = MAX_MISTAKES - mistakes;

  useEffect(() => {
    onSave({ guessedLetters, status });
  }, [guessedLetters, status, onSave]);

  const handleKey = useCallback(
    (key) => {
      if (status !== "playing" || guessedLetters.includes(key)) return;
      if (/^[A-Z]$/.test(key)) {
        const newGuesses = [...guessedLetters, key];
        setGuessedLetters(newGuesses);

        const newMistakes = newGuesses.filter(
          (l) => !target.includes(l),
        ).length;
        const isWonNow = target.split("").every((l) => newGuesses.includes(l));
        const isLostNow = newMistakes >= MAX_MISTAKES;

        if (isWonNow) {
          setStatus("won");
          onComplete();
        } else if (isLostNow) {
          setStatus("lost");
        }
      }
    },
    [status, guessedLetters, target, onComplete],
  );

  useEffect(() => {
    const listener = (e) => handleKey(e.key.toUpperCase());
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [handleKey]);

  return (
    <div className="flex flex-col items-center w-full">
      {/* Tries Indicator */}
      <div
        className={`mb-4 px-4 py-1.5 rounded-full font-bold text-sm shadow-sm border flex items-center gap-2 transition-colors ${
          triesLeft <= 2
            ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800"
            : "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800"
        }`}
      >
        <i
          className={`fa-solid fa-sun ${triesLeft > 0 && status === "playing" ? "animate-[spin_4s_linear_infinite]" : ""}`}
        ></i>
        Tries Left: {triesLeft}
      </div>

      {/* CSS-Art Lemonade Bottle */}
      <div className="flex flex-col items-center mb-8">
        {/* Bottle Cap & Neck */}
        <div className="w-8 h-4 bg-amber-500 rounded-t-md border-2 border-slate-400 dark:border-slate-500 border-b-0 z-10 relative">
          {/* Cute little straw sticking out */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-2 h-10 bg-stripes bg-[length:10px_10px] bg-red-400 border border-red-500 rounded-t-full origin-bottom rotate-12 z-0"></div>
        </div>
        <div className="w-12 h-6 border-x-4 border-slate-300 dark:border-slate-500 bg-white/30 dark:bg-slate-800/50 z-10 relative shadow-inner"></div>

        {/* Bottle Body */}
        <div className="relative w-28 h-40 border-4 border-slate-300 dark:border-slate-500 rounded-xl overflow-hidden flex flex-col justify-end bg-slate-50/50 dark:bg-slate-800/40 shadow-[inset_0_-4px_10px_rgba(0,0,0,0.1)] z-10">
          {/* Lemonade Liquid */}
          <div
            className="w-full bg-gradient-to-t from-yellow-400 to-yellow-200 transition-all duration-700 ease-out relative flex justify-center"
            style={{ height: `${(triesLeft / MAX_MISTAKES) * 100}%` }}
          >
            {/* Bubbles */}
            {triesLeft > 0 && (
              <>
                <div className="absolute top-2 left-3 w-3 h-3 border-[2px] border-yellow-500 rounded-full opacity-60"></div>
                <div className="absolute top-6 right-4 w-2 h-2 border-[2px] border-yellow-500 rounded-full opacity-60"></div>
              </>
            )}
          </div>
          {/* Glass reflection */}
          <div className="absolute top-0 left-2 w-4 h-full bg-white/40 dark:bg-white/10 skew-x-12 z-10"></div>
        </div>
      </div>

      {/* Word Guessing Area */}
      <div className="flex gap-2 mb-10">
        {target.split("").map((letter, i) => (
          <div
            key={i}
            className={`w-10 h-14 sm:w-12 flex items-center justify-center text-3xl font-black uppercase border-b-4 ${guessedLetters.includes(letter) || status === "lost" ? "border-slate-800 dark:border-white text-slate-800 dark:text-white" : "border-slate-300 dark:border-slate-600 text-transparent"}`}
          >
            {guessedLetters.includes(letter) || status === "lost"
              ? letter
              : "_"}
          </div>
        ))}
      </div>

      {status === "lost" && (
        <div className="text-red-500 font-bold mb-6 bg-red-50 dark:bg-red-900/30 px-4 py-2 rounded-lg">
          Oh no! The bottle is empty. Word: {target}
        </div>
      )}
      {status === "won" && <RewardButton rewardUrl={reward} />}

      {/* Keyboard */}
      <div
        className={`flex flex-wrap justify-center gap-2 max-w-sm ${status !== "playing" ? "opacity-50 pointer-events-none" : ""}`}
      >
        {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((char) => {
          const isGuessed = guessedLetters.includes(char);
          const isCorrect = isGuessed && target.includes(char);
          const isWrong = isGuessed && !target.includes(char);

          let colorClass =
            "bg-white dark:bg-slate-700 text-slate-700 dark:text-white border border-slate-200 dark:border-slate-600 shadow-sm";
          if (isCorrect)
            colorClass =
              "bg-green-500 text-white border-green-600 shadow-inner";
          if (isWrong)
            colorClass =
              "bg-gray-300 dark:bg-slate-800 text-gray-500 dark:text-gray-600 shadow-inner";

          return (
            <button
              key={char}
              onClick={() => handleKey(char)}
              disabled={isGuessed}
              className={`w-10 h-10 rounded font-bold text-lg transition-all active:scale-95 ${colorClass}`}
            >
              {char}
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* =========================================
    MODULE: NEW GAME - MEMORY MATCH
    ========================================= */

const MemoryMatch = ({ emojis, reward, onComplete, initialState, onSave }) => {
  const [cards, setCards] = useState(initialState?.cards || []);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [status, setStatus] = useState(initialState?.status || "playing");
  const [lockBoard, setLockBoard] = useState(false);
  const [tries, setTries] = useState(initialState?.tries || 0);

  useEffect(() => {
    if (cards.length === 0 && emojis) {
      const shuffledCards = [...emojis, ...emojis]
        .sort(() => Math.random() - 0.5)
        .map((emoji, id) => ({
          id,
          emoji,
          isFlipped: false,
          isMatched: false,
        }));
      setCards(shuffledCards);
    }
  }, [emojis]);

  useEffect(() => {
    onSave({ cards, status, tries });
  }, [cards, status, tries, onSave]);

  const handleCardClick = (index) => {
    if (lockBoard || cards[index].isFlipped || cards[index].isMatched) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setLockBoard(true);
      setTries((prev) => prev + 1);
      const [firstIdx, secondIdx] = newFlipped;

      if (newCards[firstIdx].emoji === newCards[secondIdx].emoji) {
        setTimeout(() => {
          let isGameWon = false;
          setCards((prev) => {
            const matched = [...prev];
            matched[firstIdx].isMatched = true;
            matched[secondIdx].isMatched = true;
            if (matched.every((c) => c.isMatched)) isGameWon = true;
            return matched;
          });

          if (isGameWon) {
            setStatus("won");
            onComplete();
          }

          setFlippedIndices([]);
          setLockBoard(false);
        }, 500);
      } else {
        setTimeout(() => {
          setCards((prev) => {
            const unflipped = [...prev];
            unflipped[firstIdx].isFlipped = false;
            unflipped[secondIdx].isFlipped = false;
            return unflipped;
          });
          setFlippedIndices([]);
          setLockBoard(false);
        }, 1000);
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="mb-6 px-5 py-2 rounded-full font-bold text-sm shadow-sm border flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 transition-colors">
        <i className="fa-solid fa-layer-group"></i>
        Pairs Tried: {tries}
      </div>

      <div className="grid grid-cols-4 gap-3 mb-8">
        {cards.map((card, i) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(i)}
            className={`w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center text-4xl cursor-pointer rounded-xl transition-all duration-300 transform perspective-1000 ${
              card.isFlipped || card.isMatched
                ? "bg-white dark:bg-slate-700 shadow-md rotate-y-180"
                : "bg-blue-200 dark:bg-blue-900 hover:bg-blue-300 shadow-sm"
            } ${card.isMatched ? "opacity-50 scale-95" : ""}`}
          >
            {(card.isFlipped || card.isMatched) && <span>{card.emoji}</span>}
          </div>
        ))}
      </div>

      {status === "won" && (
        <div className="flex flex-col items-center animate-fade-in">
          <p className="text-green-500 font-bold mb-2">
            Solved in {tries} tries!
          </p>
          <RewardButton rewardUrl={reward} />
        </div>
      )}
    </div>
  );
};

/* =========================================
    MODULE: NEW GAME - OUTFIT MATCH (PURBLE PLACE)
    ========================================= */

const OUTFIT_OPTIONS = {
  hat: ["🪖", "🎓", "🎩", "🧢"],
  glasses: ["🕶️", "👓", "🥽", "👀"],
  shirt: ["👕", "👔", "🎽", "👚"],
  shoes: ["👟", "🩴", "⛸️", "👞"],
};

const PurbleMatch = ({ target, reward, onComplete, initialState, onSave }) => {
  const [phase, setPhase] = useState(initialState?.phase || "memorize");
  const [userOutfit, setUserOutfit] = useState(
    initialState?.userOutfit || { hat: 0, glasses: 0, shirt: 0, shoes: 0 },
  );
  const [status, setStatus] = useState(initialState?.status || "playing");
  const [tries, setTries] = useState(initialState?.tries || 0);
  const [timeLeft, setTimeLeft] = useState(3);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    onSave({ phase, userOutfit, status, tries });
  }, [phase, userOutfit, status, tries, onSave]);

  useEffect(() => {
    if (phase === "memorize" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (phase === "memorize" && timeLeft === 0) {
      setPhase("recreate");
      setUserOutfit({ hat: 0, glasses: 0, shirt: 0, shoes: 0 }); // Reset to default when phase switches
    }
  }, [phase, timeLeft]);

  const handleSelect = (category, index) => {
    if (status !== "playing") return;
    setUserOutfit((prev) => ({ ...prev, [category]: index }));
    setFeedback(null); // Clear feedback when user changes an item
  };

  const handleSubmit = () => {
    const newFeedback = {
      hat: userOutfit.hat === target.hat,
      glasses: userOutfit.glasses === target.glasses,
      shirt: userOutfit.shirt === target.shirt,
      shoes: userOutfit.shoes === target.shoes,
    };

    setFeedback(newFeedback);
    setTries((prev) => prev + 1);

    if (Object.values(newFeedback).every((isCorrect) => isCorrect)) {
      setStatus("won");
      onComplete();
    }
  };

  const OutfitAvatar = ({ outfit }) => (
    <div className="flex flex-col items-center leading-none text-6xl drop-shadow-lg pb-6 pt-4 bg-white dark:bg-slate-700/50 rounded-2xl w-48 shadow-inner border border-slate-200 dark:border-slate-600">
      <span className="z-40">{OUTFIT_OPTIONS.hat[outfit.hat]}</span>
      <span className="-mt-3 z-30">
        {OUTFIT_OPTIONS.glasses[outfit.glasses]}
      </span>
      <span className="-mt-2 z-20">{OUTFIT_OPTIONS.shirt[outfit.shirt]}</span>
      <span className="-mt-2 z-10">{OUTFIT_OPTIONS.shoes[outfit.shoes]}</span>
    </div>
  );

  return (
    <div className="flex flex-col items-center w-full">
      <div className="mb-4 px-5 py-2 rounded-full font-bold text-sm shadow-sm border flex items-center gap-2 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800">
        <i className="fa-solid fa-shirt"></i>
        Attempts: {tries}
      </div>

      {phase === "memorize" ? (
        <div className="flex flex-col items-center animate-fade-in">
          <h3 className="text-xl font-black mb-4 text-slate-700 dark:text-white animate-pulse">
            Memorize this! ({timeLeft}s)
          </h3>
          <OutfitAvatar outfit={target} />
          <button
            onClick={() => setPhase("recreate")}
            className="mt-6 px-6 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-bold rounded-full transition-colors"
          >
            I'm Ready!
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center w-full animate-fade-in">
          <div className="flex items-center gap-6 mb-8 w-full justify-center">
            <OutfitAvatar outfit={userOutfit} />
          </div>

          <div className="grid grid-cols-1 gap-3 w-full max-w-xs mb-6">
            {Object.keys(OUTFIT_OPTIONS).map((category) => (
              <div
                key={category}
                className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/80 p-2 rounded-xl border border-slate-200 dark:border-slate-700"
              >
                <span className="text-xs uppercase font-bold text-slate-400 w-16 pl-2">
                  {category}
                </span>
                <div className="flex gap-2">
                  {OUTFIT_OPTIONS[category].map((emoji, idx) => {
                    const isSelected = userOutfit[category] === idx;
                    let borderClass =
                      "border-transparent bg-white dark:bg-slate-700 shadow-sm";

                    if (isSelected) {
                      if (feedback) {
                        borderClass = feedback[category]
                          ? "border-green-500 bg-green-100 dark:bg-green-900/50 shadow-inner"
                          : "border-red-500 bg-red-100 dark:bg-red-900/50 shadow-inner";
                      } else {
                        borderClass =
                          "border-blue-500 bg-blue-50 dark:bg-blue-900/50 shadow-inner";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelect(category, idx)}
                        disabled={status === "won"}
                        className={`text-2xl w-12 h-12 flex items-center justify-center rounded-lg border-2 transition-all active:scale-95 ${borderClass}`}
                      >
                        {emoji}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {status === "playing" && (
            <button
              onClick={handleSubmit}
              className="px-10 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-full shadow-lg transform transition hover:scale-105 active:scale-95"
            >
              Check Outfit
            </button>
          )}

          {status === "won" && (
            <div className="flex flex-col items-center mt-4">
              <p className="text-green-500 font-bold mb-2">Perfect match!</p>
              <RewardButton rewardUrl={reward} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* =========================================
    MODULE: SPELLING BEE GAME
    ========================================= */

const Hive = ({ center, letters, onLetterClick }) => {
  const positions = [
    { x: 0, y: -82 },
    { x: 72, y: -41 },
    { x: 72, y: 41 },
    { x: 0, y: 82 },
    { x: -72, y: 41 },
    { x: -72, y: -41 },
  ];
  return (
    <div className="relative w-64 h-64 flex items-center justify-center mb-8 mt-4">
      <div className="absolute z-10" onClick={() => onLetterClick(center)}>
        <div className="hex-btn center-letter shadow-lg">{center}</div>
      </div>
      {letters.map((l, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            transform: `translate(${positions[i].x}px, ${positions[i].y}px)`,
          }}
          onClick={() => onLetterClick(l)}
        >
          <div className="hex-btn">{l}</div>
        </div>
      ))}
    </div>
  );
};

const SpellingBee = ({
  center,
  letters,
  msg,
  onComplete,
  initialState,
  onSave,
}) => {
  const [input, setInput] = useState("");
  const [found, setFound] = useState(initialState?.found || []);
  const [score, setScore] = useState(initialState?.score || 0);
  const [error, setError] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const allLetters = [center, ...letters];

  useEffect(() => {
    onSave({ found, score });
  }, [found, score]);

  const handleSubmit = async () => {
    if (isValidating) return;
    const word = input.toUpperCase();
    if (word.length < 4) return showError("Too short!");
    if (!word.includes(center)) return showError("Missing center letter");
    if (found.includes(word)) return showError("Already found");
    if ([...word].some((c) => !allLetters.includes(c)))
      return showError("Bad letters");

    setIsValidating(true);
    const isValid = await checkWordValidity(word);
    setIsValidating(false);

    if (!isValid) return showError("Not in word list");

    setFound([...found, word]);
    const pts = word.length === 4 ? 1 : word.length;
    const isPangram = allLetters.every((l) => word.includes(l));
    const newScore = score + pts + (isPangram ? 7 : 0);
    setScore(newScore);
    setInput("");
    if (newScore > 15 && score <= 15) onComplete();
  };

  const showError = (txt) => {
    setError(txt);
    setTimeout(() => setError(""), 1000);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="h-16 flex items-center justify-center w-full relative mb-4">
        <span
          className={`text-3xl font-black tracking-widest uppercase border-b-2 border-cozy-200 dark:border-slate-600 pb-1 min-w-[200px] text-center ${
            input ? "text-slate-800 dark:text-white" : "text-gray-300"
          }`}
        >
          {input || <span className="opacity-0">_</span>}
          <span className="animate-pulse text-cozy-400">|</span>
        </span>
        {error && (
          <div className="absolute -top-8 bg-slate-800 text-white px-3 py-1 rounded text-xs animate-bounce whitespace-nowrap">
            {error}
          </div>
        )}
      </div>

      <Hive
        center={center}
        letters={letters}
        onLetterClick={(l) => !isValidating && setInput((prev) => prev + l)}
      />

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setInput((prev) => prev.slice(0, -1))}
          className="w-14 h-14 rounded-full border-2 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 transition-all"
        >
          <i className="fa-solid fa-delete-left"></i>
        </button>
        <button
          onClick={() => setInput("")}
          className="w-14 h-14 rounded-full border-2 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 transition-all"
        >
          <i className="fa-solid fa-rotate-left"></i>
        </button>
        <button
          onClick={handleSubmit}
          className="px-8 h-14 rounded-full bg-cozy-500 hover:bg-cozy-600 text-white font-bold text-lg shadow-lg shadow-cozy-200 active:scale-95 transition-all flex items-center gap-2"
        >
          Enter
        </button>
      </div>

      <div className="w-full bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-ice-100 dark:border-slate-700">
        <div className="flex justify-between items-center mb-4 border-b border-gray-100 dark:border-slate-700 pb-2">
          <span className="text-xs font-bold uppercase text-gray-400 tracking-wider">
            Words found: {found.length}
          </span>
          <span className="text-sm font-black text-cozy-500 bg-cozy-50 dark:bg-slate-900 px-3 py-1 rounded-full">
            {score} pts
          </span>
        </div>
        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
          {found.length === 0 && (
            <span className="text-gray-300 text-sm italic w-full text-center">
              Start typing...
            </span>
          )}
          {found.map((f) => (
            <span
              key={f}
              className="text-slate-600 dark:text-slate-300 text-sm px-2 py-1 bg-gray-50 dark:bg-slate-700 rounded"
            >
              {f}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

/* =========================================
    MODULE: STRANDS GAME
    ========================================= */

const Strands = ({ file, theme, reward, onComplete, initialState, onSave }) => {
  const [grid, setGrid] = useState([]);
  const [placedWords, setPlacedWords] = useState([]);
  const [foundWords, setFoundWords] = useState(initialState?.foundWords || []);
  const [foundPaths, setFoundPaths] = useState(initialState?.foundPaths || []);
  const [hintedWords, setHintedWords] = useState(
    initialState?.hintedWords || [],
  );
  const [selection, setSelection] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(true);

  // Save state
  useEffect(() => {
    if (!loading) onSave({ foundWords, foundPaths, hintedWords });
  }, [foundWords, foundPaths, hintedWords, loading]);

  useEffect(() => {
    setLoading(true);
    fetch(file)
      .then((res) => res.json())
      .then((data) => {
        setGrid(data.grid);
        setPlacedWords(data.words);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [file]);

  const handleStart = (r, c) => {
    setIsDragging(true);
    setSelection([{ r, c }]);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    if (!isDragging) return;
    const touch = e.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    if (target) {
      const r = target.getAttribute("data-r");
      const c = target.getAttribute("data-c");
      if (r && c) handleEnter(parseInt(r), parseInt(c));
    }
  };

  const handleEnter = (r, c) => {
    if (!isDragging) return;
    const last = selection[selection.length - 1];
    const isAdjacent = Math.abs(last.r - r) <= 1 && Math.abs(last.c - c) <= 1;
    const indexInSel = selection.findIndex((s) => s.r === r && s.c === c);
    if (isAdjacent) {
      if (indexInSel === -1) setSelection([...selection, { r, c }]);
      else if (indexInSel === selection.length - 2)
        setSelection(selection.slice(0, -1));
    }
  };

  const handleEnd = () => {
    setIsDragging(false);
    const word = selection.map((s) => grid[s.r][s.c]).join("");
    const revWord = word.split("").reverse().join("");
    const check = (w) => {
      if (placedWords.includes(w) && !foundWords.includes(w)) {
        const newFound = [...foundWords, w];
        setFoundWords(newFound);
        setFoundPaths([...foundPaths, selection]);
        if (newFound.length === placedWords.length) onComplete();
      }
    };
    check(word);
    check(revWord);
    setSelection([]);
  };

  const handleHint = () => {
    const available = placedWords.filter(
      (w) => !foundWords.includes(w) && !hintedWords.includes(w),
    );
    if (available.length > 0) {
      setHintedWords([
        ...hintedWords,
        available[Math.floor(Math.random() * available.length)],
      ]);
    }
  };

  const getPathD = (pathCoords) => {
    if (pathCoords.length < 2 || grid.length === 0) return "";
    const numRows = grid.length;
    const numCols = grid[0].length;

    // Convert logic coordinates to percentages (0-100)
    // Center of a cell at (r,c) is ((c + 0.5)/cols * 100, (r + 0.5)/rows * 100)
    const toPercent = (r, c) => [
      ((c + 0.5) / numCols) * 100,
      ((r + 0.5) / numRows) * 100,
    ];

    return pathCoords
      .map((s, i) => {
        const [x, y] = toPercent(s.r, s.c);
        return `${i === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  };

  if (loading)
    return (
      <div className="text-center p-8 text-cozy-400 animate-pulse">
        Building Puzzle...
      </div>
    );

  const numCols = grid.length > 0 ? grid[0].length : 6;

  return (
    <div
      className="flex flex-col items-center select-none"
      onMouseUp={handleEnd}
      onTouchEnd={handleEnd}
    >
      <div className="bg-white dark:bg-slate-800 px-6 py-2 rounded-full mb-6 shadow-sm border border-cozy-100 dark:border-slate-700">
        <span className="text-sm font-bold text-cozy-500 uppercase tracking-wider">
          {theme}
        </span>
      </div>

      {foundWords.length >= placedWords.length && reward && (
        <button
          onClick={() => window.open(reward, "_blank")}
          className="mb-8 px-8 py-3 bg-gradient-to-r from-cozy-500 to-purple-500 text-white font-bold rounded-full shadow-lg shadow-cozy-200 transform transition hover:scale-105 active:scale-95 animate-float flex items-center gap-2"
        >
          <i className="fa-solid fa-gift text-xl"></i> See Reward
        </button>
      )}

      <div
        className="relative bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-inner border-4 border-ice-100 dark:border-slate-700 touch-none"
        onTouchMove={handleTouchMove}
      >
        {/* SVG Overlay for Lines */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-20"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {foundPaths.map((path, i) => (
            <path
              key={i}
              d={getPathD(path)}
              stroke="rgba(186, 230, 253, 0.6)"
              strokeWidth="1.5"
              fill="none"
              className="dark:stroke-slate-600"
            />
          ))}
          <path
            d={getPathD(selection)}
            stroke="rgba(244, 63, 94, 0.5)"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>

        <div
          className="grid gap-2 relative z-10"
          style={{ gridTemplateColumns: `repeat(${numCols}, minmax(0, 1fr))` }}
        >
          {grid.map((row, r) =>
            row.map((char, c) => {
              const isSelected = selection.some((s) => s.r === r && s.c === c);
              const isFound = foundPaths.some((path) =>
                path.some((p) => p.r === r && p.c === c),
              );
              let cls =
                "w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center font-bold text-lg sm:text-xl rounded-full select-none cursor-pointer transition-all duration-200 ";

              if (isSelected)
                cls +=
                  "bg-cozy-500 text-white scale-110 shadow-lg ring-2 ring-cozy-200";
              else if (isFound)
                cls +=
                  "bg-ice-200 dark:bg-ice-800 text-ice-800 dark:text-ice-200";
              else
                cls +=
                  "bg-gray-50 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-600";

              return (
                <div
                  key={`${r}-${c}`}
                  data-r={r}
                  data-c={c}
                  className={cls}
                  onMouseDown={() => handleStart(r, c)}
                  onMouseEnter={() => handleEnter(r, c)}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    handleStart(r, c);
                  }}
                >
                  {char}
                </div>
              );
            }),
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2 justify-center max-w-sm">
        {placedWords.map((w) => {
          const isFound = foundWords.includes(w);
          const isHinted = hintedWords.includes(w);
          if (!isFound && !isHinted) return null;
          return (
            <span
              key={w}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all animate-fade-in ${
                isFound
                  ? "bg-ice-500 text-pink border-ice-500 shadow-md"
                  : "bg-gray-100 dark:bg-slate-700 text-gray-500 border-gray-200 dark:border-slate-600 border-dashed"
              }`}
            >
              {w}
            </span>
          );
        })}
      </div>

      {foundWords.length < placedWords.length && (
        <button
          onClick={handleHint}
          className="mt-8 text-xs font-bold text-cozy-400 hover:text-cozy-600 underline decoration-dashed underline-offset-4"
        >
          Need a hint? ({placedWords.length - foundWords.length} remaining)
        </button>
      )}
    </div>
  );
};

/* =========================================
    MODULE: HOME & APP
    ========================================= */

const GameCard = ({ game, index, locked, completed, onClick, isSummer }) => (
  <div
    onClick={onClick}
    className={`relative p-5 rounded-2xl border transition-all duration-300 group ${
      locked
        ? "bg-slate-100 dark:bg-slate-800/50 border-transparent opacity-60 cursor-not-allowed"
        : "bg-white dark:bg-slate-800 border-white dark:border-slate-700 shadow-sm hover:shadow-lg hover:-translate-y-1 cursor-pointer"
    } ${completed ? "ring-2 ring-green-400 bg-green-50/50 dark:bg-green-900/20" : ""}`}
  >
    <div className="flex justify-between items-center mb-2">
      <span
        className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${
          locked
            ? "bg-gray-200 text-gray-400"
            : isSummer
              ? "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-400"
              : "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
        }`}
      >
        {new Date(game.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })}
      </span>
      {completed && (
        <i className="fa-solid fa-circle-check text-lg text-green-500"></i>
      )}
      {locked && <i className="fa-solid fa-lock text-slate-300"></i>}
    </div>

    <h3
      className={`text-lg font-bold ${locked ? "text-slate-400" : "text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-yellow-400 transition-colors"}`}
    >
      {game.title.split(":")[0]}
    </h3>
    {game.title.includes(":") && (
      <p className="text-xs text-slate-400 dark:text-slate-500 truncate mt-1">
        {game.title.split(":")[1]}
      </p>
    )}
  </div>
);

function App() {
  const [view, setView] = useState("HOME");
  const [edition, setEdition] = useState("WINTER");
  const [activeGameIndex, setActiveGameIndex] = useState(null);

  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark",
  );
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const [progress, setProgress] = useState(
    () => JSON.parse(localStorage.getItem("puzzleProgressV4")) || {},
  );

  const saveGameProgress = (gameId, data) => {
    setProgress((prev) => {
      const newProgress = {
        ...prev,
        [gameId]: { ...(prev[gameId] || {}), ...data },
      };
      localStorage.setItem("puzzleProgressV4", JSON.stringify(newProgress));
      return newProgress;
    });
  };

  const handleGameComplete = (gameId) => {
    fireConfetti();
    saveGameProgress(gameId, { completed: true });
  };

  const currentConfig = edition === "WINTER" ? WINTER_CONFIG : SUMMER_CONFIG;

  return (
    <div
      className={`min-h-screen pb-12 font-sans transition-colors duration-500 ${edition === "SUMMER" ? "bg-gradient-to-b from-yellow-50 to-orange-50 dark:from-slate-900 dark:to-slate-800" : "bg-gradient-to-b from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800"}`}
    >
      <Header
        view={view}
        setView={setView}
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
      />

      {view === "HOME" ? (
        <div className="px-4 max-w-md mx-auto space-y-4 animate-fade-in pt-4">
          {/* Edition Toggle */}
          <div className="flex bg-white dark:bg-slate-800 p-1 rounded-full shadow-sm mb-6 border border-gray-100 dark:border-slate-700">
            <button
              onClick={() => setEdition("WINTER")}
              className={`flex-1 py-2 rounded-full text-sm font-bold transition-all ${edition === "WINTER" ? "bg-blue-100 dark:bg-slate-700 text-blue-800 dark:text-white shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
            >
              ❄️ Winter Edition
            </button>
            <button
              onClick={() => setEdition("SUMMER")}
              className={`flex-1 py-2 rounded-full text-sm font-bold transition-all ${edition === "SUMMER" ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
            >
              ☀️ Summer Edition
            </button>
          </div>

          <div className="text-center mb-6">
            <span className="bg-white/60 dark:bg-slate-800/60 px-4 py-1.5 rounded-full text-xs font-bold text-slate-500 dark:text-slate-400 backdrop-blur-sm shadow-sm border border-white/50 dark:border-slate-700">
              <i className="fa-regular fa-calendar mr-2"></i>
              {edition === "WINTER" ? "Dec 24 - Jan 4" : "May 14 - Jul 14"}
            </span>
          </div>

          {currentConfig.map((game, idx) => {
            const locked = isLocked(game.date);
            const globalGameId = `${edition}_${idx}`;
            const isCompleted = progress[globalGameId]?.completed;
            return (
              <GameCard
                key={globalGameId}
                game={game}
                index={idx}
                locked={locked}
                completed={isCompleted}
                isSummer={edition === "SUMMER"}
                onClick={() =>
                  !locked && (setActiveGameIndex(idx), setView("GAME"))
                }
              />
            );
          })}
        </div>
      ) : (
        <GameShell
          title={currentConfig[activeGameIndex].title}
          hint={currentConfig[activeGameIndex].hint}
        >
          {currentConfig[activeGameIndex].type === "WORDLE" && (
            <Wordle
              target={currentConfig[activeGameIndex].target}
              reward={currentConfig[activeGameIndex].reward}
              initialState={progress[`${edition}_${activeGameIndex}`]}
              onSave={(data) =>
                saveGameProgress(`${edition}_${activeGameIndex}`, data)
              }
              onComplete={() =>
                handleGameComplete(`${edition}_${activeGameIndex}`)
              }
            />
          )}
          {currentConfig[activeGameIndex].type === "HANGMAN" && (
            <Hangman
              target={currentConfig[activeGameIndex].target}
              reward={currentConfig[activeGameIndex].reward}
              initialState={progress[`${edition}_${activeGameIndex}`]}
              onSave={(data) =>
                saveGameProgress(`${edition}_${activeGameIndex}`, data)
              }
              onComplete={() =>
                handleGameComplete(`${edition}_${activeGameIndex}`)
              }
            />
          )}
          {currentConfig[activeGameIndex].type === "MEMORY" && (
            <MemoryMatch
              emojis={currentConfig[activeGameIndex].emojis}
              reward={currentConfig[activeGameIndex].reward}
              initialState={progress[`${edition}_${activeGameIndex}`]}
              onSave={(data) =>
                saveGameProgress(`${edition}_${activeGameIndex}`, data)
              }
              onComplete={() =>
                handleGameComplete(`${edition}_${activeGameIndex}`)
              }
            />
          )}
          {currentConfig[activeGameIndex].type === "PURBLE" && (
            <PurbleMatch
              target={currentConfig[activeGameIndex].target}
              reward={currentConfig[activeGameIndex].reward}
              initialState={progress[`${edition}_${activeGameIndex}`]}
              onSave={(data) =>
                saveGameProgress(`${edition}_${activeGameIndex}`, data)
              }
              onComplete={() =>
                handleGameComplete(`${edition}_${activeGameIndex}`)
              }
            />
          )}
          {currentConfig[activeGameIndex].type === "BEE" && (
            <SpellingBee
              center={currentConfig[activeGameIndex].center}
              letters={currentConfig[activeGameIndex].letters}
              msg={currentConfig[activeGameIndex].msg}
              reward={currentConfig[activeGameIndex].reward}
              initialState={progress[`${edition}_${activeGameIndex}`]}
              onSave={(data) =>
                saveGameProgress(`${edition}_${activeGameIndex}`, data)
              }
              onComplete={() =>
                handleGameComplete(`${edition}_${activeGameIndex}`)
              }
            />
          )}
          {currentConfig[activeGameIndex].type === "STRANDS" && (
            <Strands
              theme={currentConfig[activeGameIndex].theme}
              file={currentConfig[activeGameIndex].file}
              reward={currentConfig[activeGameIndex].reward}
              initialState={progress[`${edition}_${activeGameIndex}`]}
              onSave={(data) =>
                saveGameProgress(`${edition}_${activeGameIndex}`, data)
              }
              onComplete={() =>
                handleGameComplete(`${edition}_${activeGameIndex}`)
              }
            />
          )}
        </GameShell>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
