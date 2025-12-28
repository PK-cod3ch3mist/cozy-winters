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
];

const GAMES_CONFIG = [
  {
    date: "2025-12-23",
    type: "WORDLE",
    title: "Wordle: Day 1",
    target: "POSCA",
    hint: "A creative tool we know well.",
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
    hint: "Sticky, decorative, fun.",
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
    hint: "Exchange of goods... or ideas?",
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
    hint: "The metro brings you home",
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
    hint: "O captain my captain",
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
    hint: "Where secrets and days are kept.",
    reward: "assets/wordle7.jpg",
  },
];

/* =========================================
    MODULE: UTILS
    ========================================= */

const checkWordValidity = async (word) => {
  if (USER_WORDS.includes(word)) return true;
  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
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
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 },
    colors: ["#F43F5E", "#7DD3FC", "#FCD34D"],
  });
};

// Returns true if game is locked (future date) AND not in dev mode
const isLocked = (dateStr) => {
  // 1. Check Dev Mode in URL
  const params = new URLSearchParams(window.location.search);
  if (params.get("dev") === "true") return false;

  // 2. Check Date (Robust Local Time Comparison)
  const [y, m, d] = dateStr.split("-").map(Number);
  const gameDate = new Date(y, m - 1, d).setHours(0, 0, 0, 0); // Local midnight of config date
  const today = new Date().setHours(0, 0, 0, 0); // Local midnight of today

  return gameDate > today;
};

/* =========================================
    MODULE: SHARED COMPONENTS
    ========================================= */

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
  <div className="px-4 py-6 max-w-md mx-auto animate-fade-in">
    <h2 className="text-center text-2xl font-bold text-slate-800 dark:text-white mb-2">
      {title}
    </h2>
    {hint && (
      <p className="text-center text-sm text-slate-500 dark:text-slate-400 italic mb-8 bg-white/50 dark:bg-slate-800/50 py-2 rounded-lg">
        {hint}
      </p>
    )}
    {children}
  </div>
);

/* =========================================
    MODULE: WORDLE GAME
    ========================================= */

const WordleGrid = ({ guesses, currentGuess, target, shake }) => (
  <div
    className={`flex flex-col items-center gap-2 mb-8 ${
      shake ? "animate-[shake_0.5s]" : ""
    }`}
  >
    {[...Array(6)].map((_, i) => (
      <div key={i} className="flex gap-2">
        {[...Array(5)].map((_, j) => {
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
            // Active typing: Darker border for visibility
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
);

const WordleKeyboard = ({ onKey, guesses, target, disabled }) => {
  const getKeyColor = (char) => {
    let color =
      "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-sm border-b-2 border-slate-200 dark:border-slate-900";
    for (let g of guesses) {
      if (g.includes(char)) {
        color = "bg-slate-400 dark:bg-slate-600 text-white border-slate-500";
        for (let i = 0; i < 5; i++) {
          if (g[i] === char && target[i] === char)
            return "bg-green-500 text-white border-green-600";
        }
        if (target.includes(char) && !color.includes("green"))
          color = "bg-yellow-400 text-white border-yellow-500";
      }
    }
    return color;
  };

  return (
    <div
      className={`flex flex-col gap-2 w-full px-1 ${
        disabled ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      {["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"].map((row, i) => (
        <div key={i} className="flex justify-center gap-1.5">
          {row.split("").map((char) => (
            <button
              key={char}
              onClick={() => onKey(char)}
              className={`h-12 flex-1 rounded-md text-sm font-bold transition-all active:scale-95 ${getKeyColor(
                char
              )}`}
            >
              {char}
            </button>
          ))}
          {i === 2 && (
            <>
              <button
                onClick={() => onKey("BACKSPACE")}
                className="px-4 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 rounded-md text-lg ml-1"
              >
                <i className="fa-solid fa-delete-left"></i>
              </button>
              <button
                onClick={() => onKey("ENTER")}
                className="px-4 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300 rounded-md text-xs font-bold ml-1"
              >
                ENT
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

const Wordle = ({ target, reward, onComplete, initialState, onSave }) => {
  const [guesses, setGuesses] = useState(initialState?.guesses || []);
  const [currentGuess, setCurrentGuess] = useState("");
  const [status, setStatus] = useState(initialState?.status || "playing");
  const [shake, setShake] = useState(false);
  const [msg, setMsg] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  // Save state on every relevant change
  useEffect(() => {
    onSave({ guesses, status });
  }, [guesses, status]);

  const handleKey = useCallback(
    async (key) => {
      if (status !== "playing" || isValidating) return;

      if (key === "ENTER") {
        if (currentGuess.length !== 5) return showMessage("Too short");

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
      } else if (currentGuess.length < 5 && /^[A-Z]$/.test(key)) {
        setCurrentGuess((prev) => prev + key);
      }
    },
    [currentGuess, status, guesses, target, isValidating]
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
    <div className="flex flex-col items-center">
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

      <WordleGrid
        guesses={guesses}
        currentGuess={currentGuess}
        target={target}
        shake={shake}
      />

      {status === "lost" && (
        <div className="text-red-500 font-bold mb-6 bg-red-50 px-4 py-2 rounded-lg">
          Word: {target}
        </div>
      )}

      {status === "won" && reward && (
        <button
          onClick={() => window.open(reward, "_blank")}
          className="mb-8 px-8 py-3 bg-gradient-to-r from-cozy-500 to-purple-500 text-white font-bold rounded-full shadow-lg shadow-cozy-200 transform transition hover:scale-105 active:scale-95 animate-float flex items-center gap-2"
        >
          <i className="fa-solid fa-gift text-xl"></i> See Reward
        </button>
      )}

      <WordleKeyboard
        onKey={handleKey}
        guesses={guesses}
        target={target}
        disabled={isValidating || status !== "playing"}
      />
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
    initialState?.hintedWords || []
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
      (w) => !foundWords.includes(w) && !hintedWords.includes(w)
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
                path.some((p) => p.r === r && p.c === c)
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
            })
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
    MODULE: HOME & APP
    ========================================= */

const GameCard = ({ game, index, locked, completed, onClick }) => (
  <div
    onClick={onClick}
    className={`relative p-5 rounded-2xl border transition-all duration-300 group ${
      locked
        ? "bg-slate-100 dark:bg-slate-800/50 border-transparent opacity-60 cursor-not-allowed"
        : "bg-white dark:bg-slate-800 border-white dark:border-slate-700 shadow-sm hover:shadow-lg hover:-translate-y-1 cursor-pointer"
    } ${
      completed
        ? "ring-2 ring-green-200 dark:ring-green-900 bg-green-50/30"
        : ""
    }`}
  >
    <div className="flex justify-between items-center mb-2">
      <span
        className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${
          locked
            ? "bg-gray-200 text-gray-400"
            : "bg-ice-100 dark:bg-slate-700 text-ice-700 dark:text-ice-300"
        }`}
      >
        {new Date(game.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })}
      </span>
      {completed && (
        <i className="fa-solid fa-circle-check text-green-500 text-lg"></i>
      )}
      {locked && <i className="fa-solid fa-lock text-slate-300"></i>}
    </div>

    <h3
      className={`text-lg font-bold ${
        locked
          ? "text-slate-400"
          : "text-slate-700 dark:text-slate-200 group-hover:text-cozy-600 dark:group-hover:text-cozy-400 transition-colors"
      }`}
    >
      {game.title.split(":")[0]}
    </h3>
    <p className="text-xs text-slate-400 dark:text-slate-500 truncate mt-1">
      {game.title.split(":")[1]}
    </p>
  </div>
);

function App() {
  const [view, setView] = useState("HOME");
  const [activeGameIndex, setActiveGameIndex] = useState(null);

  // -- Dark Mode --
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
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

  // -- Game Progress Persistence --
  const [progress, setProgress] = useState(
    () => JSON.parse(localStorage.getItem("puzzleProgressV3")) || {}
  );

  const saveGameProgress = (index, data) => {
    const newProgress = {
      ...progress,
      [index]: { ...(progress[index] || {}), ...data },
    };
    setProgress(newProgress);
    localStorage.setItem("puzzleProgressV3", JSON.stringify(newProgress));
  };

  const handleGameComplete = (index) => {
    fireConfetti();
    saveGameProgress(index, { completed: true });
  };

  return (
    <div className="min-h-screen pb-12 font-sans winter-bg">
      <Header
        view={view}
        setView={setView}
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
      />

      {view === "HOME" ? (
        <div className="px-4 max-w-md mx-auto space-y-4 animate-fade-in pt-4">
          <div className="text-center mb-8">
            <span className="bg-white/60 dark:bg-slate-800/60 px-4 py-1.5 rounded-full text-xs font-bold text-slate-500 dark:text-slate-400 backdrop-blur-sm shadow-sm border border-white/50 dark:border-slate-700">
              <i className="fa-regular fa-calendar mr-2"></i>Dec 24 - Jan 5
            </span>
          </div>
          {GAMES_CONFIG.map((game, idx) => {
            const locked = isLocked(game.date);
            const isCompleted = progress[idx]?.completed;
            return (
              <GameCard
                key={idx}
                game={game}
                index={idx}
                locked={locked}
                completed={isCompleted}
                onClick={() =>
                  !locked && (setActiveGameIndex(idx), setView("GAME"))
                }
              />
            );
          })}
        </div>
      ) : (
        <GameShell
          title={GAMES_CONFIG[activeGameIndex].title}
          hint={GAMES_CONFIG[activeGameIndex].hint}
        >
          {GAMES_CONFIG[activeGameIndex].type === "WORDLE" && (
            <Wordle
              target={GAMES_CONFIG[activeGameIndex].target}
              reward={GAMES_CONFIG[activeGameIndex].reward}
              initialState={progress[activeGameIndex]}
              onSave={(data) => saveGameProgress(activeGameIndex, data)}
              onComplete={() => handleGameComplete(activeGameIndex)}
            />
          )}
          {GAMES_CONFIG[activeGameIndex].type === "STRANDS" && (
            <Strands
              file={GAMES_CONFIG[activeGameIndex].file}
              theme={GAMES_CONFIG[activeGameIndex].theme}
              reward={GAMES_CONFIG[activeGameIndex].reward}
              initialState={progress[activeGameIndex]}
              onSave={(data) => saveGameProgress(activeGameIndex, data)}
              onComplete={() => handleGameComplete(activeGameIndex)}
            />
          )}
          {GAMES_CONFIG[activeGameIndex].type === "BEE" && (
            <SpellingBee
              center={GAMES_CONFIG[activeGameIndex].center}
              letters={GAMES_CONFIG[activeGameIndex].letters}
              msg={GAMES_CONFIG[activeGameIndex].msg}
              initialState={progress[activeGameIndex]}
              onSave={(data) => saveGameProgress(activeGameIndex, data)}
              onComplete={() => handleGameComplete(activeGameIndex)}
            />
          )}
        </GameShell>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
