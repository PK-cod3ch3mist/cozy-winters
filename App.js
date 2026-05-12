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
  "BEACH",
  "MANGO",
  "OCEAN",
  "SUNNY",
  "TOWEL",
  "SHELL",
  "WATER",
  "SWIM",
];

const WINTER_CONFIG = [
  {
    date: "2025-12-24",
    type: "WORDLE",
    title: "Wordle: Day 1",
    target: "POSCA",
    hint: "A creative tool we know well.",
    reward: "assets/wordle1.jpg",
  },
  {
    date: "2025-12-25",
    type: "STRANDS",
    title: "Strands: Places Together",
    theme: "Places together",
    file: "assets/strand1.json",
    reward: "assets/wordle2.jpg",
  },
  {
    date: "2025-12-26",
    type: "WORDLE",
    title: "Wordle: Day 3",
    target: "WASHI",
    hint: "Sticky, decorative, fun.",
    reward: "assets/wordle3.jpg",
  },
  {
    date: "2025-12-27",
    type: "BEE",
    title: "Spelling Bee: Name Game",
    center: "A",
    letters: ["R", "I", "Y", "J", "N", "P"],
    msg: "Letters of your name (had to add a P to make it 7 letters :P)",
    reward: "assets/wordle4.jpg",
  },
  {
    date: "2025-12-28",
    type: "WORDLE",
    title: "Wordle: Day 5",
    target: "TRADE",
    hint: "Exchange of goods... or ideas?",
    reward: "assets/wordle5.jpg",
  },
  {
    date: "2025-12-29",
    type: "STRANDS",
    title: "Strands: Yum Yum",
    theme: "Yum yum yum",
    file: "assets/strand2.json",
    reward: "assets/wordle6.jpg",
  },
  {
    date: "2025-12-30",
    type: "WORDLE",
    title: "Wordle: Day 7",
    target: "SPORT",
    hint: "Physical activity and competition.",
    reward: "assets/wordle7.jpg",
  },
];

const SUMMER_CONFIG = [
  {
    date: "2026-05-01",
    type: "HANGMAN",
    title: "Save the Ice Cream",
    target: "MANGO",
    hint: "The king of summer fruits.",
    reward: "assets/summer1.jpg",
  },
  {
    date: "2026-05-02",
    type: "MEMORY",
    title: "Summer Pairs",
    emojis: ["☀️", "🍦", "🍉", "🌊", "🏖️", "🐚"],
    hint: "Find the matching summer vibes!",
    reward: "assets/summer2.jpg",
  },
  {
    date: "2026-05-03",
    type: "HANGMAN",
    title: "Save the Ice Cream 2",
    target: "OCEAN",
    hint: "Big, blue, and salty.",
    reward: "assets/summer3.jpg",
  },
  {
    date: "2026-05-04",
    type: "WORDLE",
    title: "Summer Wordle",
    target: "BEACH",
    hint: "Where the sand meets the sea.",
    reward: "assets/summer4.jpg",
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
  <header className="sticky top-0 z-40 backdrop-blur-md bg-white/70 dark:bg-slate-900/80 border-b border-cozy-100 dark:border-slate-700 transition-colors">
    <div className="max-w-md mx-auto px-4 h-16 flex justify-between items-center">
      <h1
        onClick={() => setView("HOME")}
        className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cozy-500 to-purple-500 cursor-pointer tracking-tight"
      >
        Daily Puzzle
      </h1>
      <div className="flex items-center gap-3">
        <button
          onClick={toggleDarkMode}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-ice-100 dark:bg-slate-800 text-ice-800 dark:text-yellow-400 transition-colors"
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

const RewardButton = ({ rewardUrl }) => {
  if (!rewardUrl) return null;
  return (
    <button
      onClick={() => window.open(rewardUrl, "_blank")}
      className="mt-6 mb-8 px-8 py-3 bg-gradient-to-r from-cozy-500 to-purple-500 text-white font-bold rounded-full shadow-lg shadow-cozy-200 dark:shadow-purple-900/20 transform transition hover:scale-105 active:scale-95 animate-[bounce_1s_infinite] flex items-center gap-3"
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
  // [Code remains the same as your provided Wordle component...]
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
          <div className="bg-slate-800 text-white px-4 py-1 rounded-full text-sm animate-bounce shadow-lg z-50">
            {msg}
          </div>
        )}
        {isValidating && (
          <div className="text-cozy-500 font-bold animate-pulse text-sm">
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
        <div className="text-red-500 font-bold mb-6 bg-red-50 px-4 py-2 rounded-lg">
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
                "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-b-2 border-slate-200 dark:border-slate-900";
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
  const isWon = target.split("").every((l) => guessedLetters.includes(l));
  const isLost = mistakes >= MAX_MISTAKES;

  useEffect(() => {
    if (status === "playing") {
      if (isWon) {
        setStatus("won");
        onComplete();
      } else if (isLost) {
        setStatus("lost");
      }
    }
    onSave({ guessedLetters, status });
  }, [guessedLetters, isWon, isLost, status]);

  const handleKey = useCallback(
    (key) => {
      if (status !== "playing" || guessedLetters.includes(key)) return;
      if (/^[A-Z]$/.test(key)) {
        setGuessedLetters((prev) => [...prev, key]);
      }
    },
    [status, guessedLetters],
  );

  useEffect(() => {
    const listener = (e) => handleKey(e.key.toUpperCase());
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [handleKey]);

  // Visual stages of melting ice cream (Emojis for simplicity, can swap for images)
  const iceCreamStages = ["🍦", "🍨", "🍧", "🫠", "💧", "💦", "☀️"];

  return (
    <div className="flex flex-col items-center w-full">
      <div className="text-8xl mb-8 transition-transform hover:scale-110 select-none">
        {iceCreamStages[Math.min(mistakes, 6)]}
      </div>

      <div className="flex gap-2 mb-10">
        {target.split("").map((letter, i) => (
          <div
            key={i}
            className={`w-12 h-14 flex items-center justify-center text-3xl font-black uppercase border-b-4 ${guessedLetters.includes(letter) || status === "lost" ? "border-slate-800 dark:border-white text-slate-800 dark:text-white" : "border-slate-300 dark:border-slate-600 text-transparent"}`}
          >
            {guessedLetters.includes(letter) || status === "lost"
              ? letter
              : "_"}
          </div>
        ))}
      </div>

      {status === "lost" && (
        <div className="text-red-500 font-bold mb-6 bg-red-50 px-4 py-2 rounded-lg">
          Oh no! It melted. Word: {target}
        </div>
      )}
      {status === "won" && <RewardButton rewardUrl={reward} />}

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

  useEffect(() => {
    // Initialize cards only once
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
    if (
      cards.length > 0 &&
      cards.every((c) => c.isMatched) &&
      status === "playing"
    ) {
      setStatus("won");
      onComplete();
    }
    onSave({ cards, status });
  }, [cards, status]);

  const handleCardClick = (index) => {
    if (lockBoard || cards[index].isFlipped || cards[index].isMatched) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setLockBoard(true);
      const [firstIdx, secondIdx] = newFlipped;

      if (newCards[firstIdx].emoji === newCards[secondIdx].emoji) {
        // Match found
        setTimeout(() => {
          setCards((prev) => {
            const matched = [...prev];
            matched[firstIdx].isMatched = true;
            matched[secondIdx].isMatched = true;
            return matched;
          });
          setFlippedIndices([]);
          setLockBoard(false);
        }, 500);
      } else {
        // No match
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
      <div className="grid grid-cols-4 gap-3 mb-8">
        {cards.map((card, i) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(i)}
            className={`w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center text-4xl cursor-pointer rounded-xl transition-all duration-300 transform perspective-1000 ${
              card.isFlipped || card.isMatched
                ? "bg-white dark:bg-slate-700 shadow-md rotate-y-180"
                : "bg-cozy-400 hover:bg-cozy-500 shadow-sm"
            } ${card.isMatched ? "opacity-50 scale-95" : ""}`}
          >
            {(card.isFlipped || card.isMatched) && <span>{card.emoji}</span>}
          </div>
        ))}
      </div>

      {status === "won" && <RewardButton rewardUrl={reward} />}
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
    } ${completed ? (isSummer ? "ring-2 ring-yellow-300 bg-yellow-50/30" : "ring-2 ring-green-200 bg-green-50/30") : ""}`}
  >
    <div className="flex justify-between items-center mb-2">
      <span
        className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${
          locked
            ? "bg-gray-200 text-gray-400"
            : isSummer
              ? "bg-yellow-100 text-yellow-700"
              : "bg-ice-100 dark:bg-slate-700 text-ice-700 dark:text-ice-300"
        }`}
      >
        {new Date(game.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })}
      </span>
      {completed && (
        <i
          className={`fa-solid fa-circle-check text-lg ${isSummer ? "text-yellow-500" : "text-green-500"}`}
        ></i>
      )}
      {locked && <i className="fa-solid fa-lock text-slate-300"></i>}
    </div>

    <h3
      className={`text-lg font-bold ${locked ? "text-slate-400" : "text-slate-700 dark:text-slate-200 group-hover:text-cozy-600 transition-colors"}`}
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
  const [edition, setEdition] = useState("WINTER"); // "WINTER" or "SUMMER"
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
    const newProgress = {
      ...progress,
      [gameId]: { ...(progress[gameId] || {}), ...data },
    };
    setProgress(newProgress);
    localStorage.setItem("puzzleProgressV4", JSON.stringify(newProgress));
  };

  const handleGameComplete = (gameId) => {
    fireConfetti();
    saveGameProgress(gameId, { completed: true });
  };

  const currentConfig = edition === "WINTER" ? WINTER_CONFIG : SUMMER_CONFIG;

  return (
    <div
      className={`min-h-screen pb-12 font-sans transition-colors duration-500 ${edition === "SUMMER" ? "bg-gradient-to-b from-yellow-50 to-orange-50 dark:from-slate-900 dark:to-slate-800" : "winter-bg"}`}
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
              className={`flex-1 py-2 rounded-full text-sm font-bold transition-all ${edition === "WINTER" ? "bg-ice-100 dark:bg-slate-700 text-ice-800 dark:text-white shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
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
              {edition === "WINTER" ? "Dec 24 - Dec 30" : "May 1 - May 4"}
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
          {/* Strands and Bee components would go here, omitting for space if they aren't in this specific config file currently, but you can paste them back from your previous file! */}
        </GameShell>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
