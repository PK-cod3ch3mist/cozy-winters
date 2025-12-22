const { useState, useEffect, useMemo, useCallback } = React;

/* =========================================
    MODULE: DATA & CONFIGURATION
    ========================================= */

// User Custom Words (Always considered valid for Dictionary checks)
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
    date: "2024-12-24",
    type: "WORDLE",
    title: "Wordle: Day 1",
    target: "POSCA",
    hint: "A creative tool we know well.",
    reward: "assets/wordle1.jpg",
  },
  {
    date: "2024-12-25",
    type: "STRANDS",
    title: "Strands: Places Together",
    theme: "Places together",
    file: "assets/strand1.json",
  },
  {
    date: "2024-12-26",
    type: "WORDLE",
    title: "Wordle: Day 3",
    target: "WASHI",
    hint: "Sticky, decorative, fun.",
    reward: "assets/wordle2.jpg",
  },
  {
    date: "2024-12-27",
    type: "BEE",
    title: "Spelling Bee: Name Game",
    center: "A",
    letters: ["R", "I", "Y", "J", "N", "P"],
    msg: "Letters of your name (had to add a P to make it 7 letters :P)",
  },
  {
    date: "2024-12-28",
    type: "WORDLE",
    title: "Wordle: Day 5",
    target: "TRADE",
    hint: "Exchange of goods... or ideas?",
    reward: "assets/wordle3.jpg",
  },
  {
    date: "2024-12-29",
    type: "STRANDS",
    title: "Strands: Yum Yum",
    theme: "Yum yum yum",
    file: "assets/strand2.json",
  },
  {
    date: "2024-12-30",
    type: "WORDLE",
    title: "Wordle: Day 7",
    target: "SPORT",
    hint: "Physical activity and competition.",
    reward: "assets/wordle4.jpg",
  },
  {
    date: "2024-12-31",
    type: "BEE",
    title: "Spelling Bee: My Turn",
    center: "T",
    letters: ["P", "R", "A", "U", "S", "H"],
    msg: "Letters of mine (if someone butchered the pronunciation XD)",
  },
  {
    date: "2025-01-01",
    type: "WORDLE",
    title: "Wordle: New Year",
    target: "MODEL",
    hint: "Pose, structure, or example.",
    reward: "assets/wordle5.jpg",
  },
  {
    date: "2025-01-02",
    type: "STRANDS",
    title: "Strands: 4:45",
    theme: "Four forty five",
    file: "assets/strand3.json",
  },
  {
    date: "2025-01-03",
    type: "WORDLE",
    title: "Wordle: Day 11",
    target: "CHESS",
    hint: "Strategy on 64 squares.",
    reward: "assets/wordle6.jpg",
  },
  {
    date: "2025-01-04",
    type: "BEE",
    title: "Spelling Bee: Hoops",
    center: "E",
    letters: ["B", "A", "S", "K", "T", "L"],
    msg: "Can you score more than an NBA game?",
  },
  {
    date: "2025-01-05",
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

// Helper to check validity using User Words first, then API
const checkWordValidity = async (word) => {
  // 1. Check Custom List Sync
  if (USER_WORDS.includes(word)) return true;

  // 2. Check API
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
    console.error("Dictionary API Error:", error);
    return false;
  }
};

const fireConfetti = () => {
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 },
    colors: ["#F472B6", "#60A5FA", "#34D399"],
  });
};

const isLocked = (date, devMode) => {
  if (devMode) return false;
  return new Date(date).setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0);
};

/* =========================================
    MODULE: SHARED COMPONENTS
    ========================================= */

const Header = ({ onTitleClick, view, setView }) => (
  <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-30 mb-6 border-b border-pink-100">
    <div className="px-4 py-4 flex justify-between items-center">
      <h1
        onClick={onTitleClick}
        className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 cursor-pointer"
      >
        The Daily Puzzle
      </h1>
      {view === "GAME" && (
        <button
          onClick={() => setView("HOME")}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
        >
          <i className="fa-solid fa-xmark text-gray-500"></i>
        </button>
      )}
    </div>
  </header>
);

const GameShell = ({ title, hint, children }) => (
  <div className="px-2">
    <h2 className="text-center text-xl font-bold text-gray-800 mb-1">
      {title}
    </h2>
    {hint && (
      <p className="text-center text-xs text-gray-500 italic mb-6">{hint}</p>
    )}
    {children}
  </div>
);

/* =========================================
    MODULE: WORDLE GAME
    ========================================= */

const WordleGrid = ({ guesses, currentGuess, target, shake }) => (
  <div
    className={`grid grid-rows-6 gap-2 mb-6 ${
      shake ? "animate-[shake_0.5s]" : ""
    }`}
  >
    {[...Array(6)].map((_, i) => (
      <div key={i} className="grid grid-cols-5 gap-2">
        {[...Array(5)].map((_, j) => {
          const guess = guesses[i];
          const isCurrent = i === guesses.length;
          const letter = guess
            ? guess[j]
            : isCurrent && currentGuess[j]
            ? currentGuess[j]
            : "";

          let colorClass = "border-2 border-pink-200 bg-white";
          if (guess) {
            if (guess[j] === target[j])
              colorClass = "bg-green-500 border-green-500 text-white";
            else if (target.includes(guess[j]))
              colorClass = "bg-yellow-500 border-yellow-500 text-white";
            else colorClass = "bg-gray-400 border-gray-400 text-white";
          }

          return (
            <div
              key={j}
              className={`w-12 h-12 flex items-center justify-center text-xl font-bold rounded ${colorClass} uppercase transition-all duration-300`}
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
    let color = "bg-white shadow-sm";
    for (let g of guesses) {
      if (g.includes(char)) {
        color = "bg-gray-400 text-white";
        for (let i = 0; i < 5; i++) {
          if (g[i] === char && target[i] === char)
            return "bg-green-500 text-white";
        }
        if (target.includes(char) && color !== "bg-green-500 text-white")
          color = "bg-yellow-500 text-white";
      }
    }
    return color;
  };

  return (
    <div
      className={`flex flex-col gap-1 w-full max-w-sm px-2 ${
        disabled ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      {["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"].map((row, i) => (
        <div key={i} className="flex justify-center gap-1">
          {row.split("").map((char) => (
            <button
              key={char}
              onClick={() => onKey(char)}
              className={`h-10 flex-1 rounded text-sm font-bold ${getKeyColor(
                char
              )} transition-colors`}
            >
              {char}
            </button>
          ))}
          {i === 2 && (
            <>
              <button
                onClick={() => onKey("BACKSPACE")}
                className="px-3 bg-pink-100 rounded text-xs ml-1"
              >
                ⌫
              </button>
              <button
                onClick={() => onKey("ENTER")}
                className="px-3 bg-green-100 rounded text-xs ml-1"
              >
                ↵
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

const Wordle = ({ target, reward, onComplete }) => {
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [status, setStatus] = useState("playing");
  const [shake, setShake] = useState(false);
  const [msg, setMsg] = useState("");
  const [isValidating, setIsValidating] = useState(false);

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
    setTimeout(() => setMsg(""), 1000);
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
      <div className="relative mb-2 h-8">
        {msg && (
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-3 py-1 rounded text-sm whitespace-nowrap z-10">
            {msg}
          </div>
        )}
        {isValidating && (
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-pink-100 text-pink-600 px-3 py-1 rounded text-sm whitespace-nowrap z-10 animate-pulse">
            Checking...
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
        <div className="text-red-500 font-bold mb-4">
          The word was: {target}
        </div>
      )}

      {status === "won" && reward && (
        <button
          onClick={() => window.open(reward, "_blank")}
          className="mb-6 px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-full shadow-lg transform transition hover:scale-105 animate-bounce flex items-center gap-2"
        >
          <i className="fa-solid fa-gift"></i> See Reward
        </button>
      )}

      <WordleKeyboard
        onKey={handleKey}
        guesses={guesses}
        target={target}
        disabled={isValidating}
      />
    </div>
  );
};

/* =========================================
    MODULE: STRANDS GAME (UPDATED TO FETCH ASSETS)
    ========================================= */

const Strands = ({ file, theme, onComplete }) => {
  const [grid, setGrid] = useState([]);
  const [placedWords, setPlacedWords] = useState([]);
  // Removed internal theme state, using prop instead
  const [foundWords, setFoundWords] = useState([]);
  const [foundPaths, setFoundPaths] = useState([]);
  const [hintedWords, setHintedWords] = useState([]);
  const [selection, setSelection] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Grid Data from Assets
  useEffect(() => {
    setLoading(true);
    fetch(file)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load grid file");
        return res.json();
      })
      .then((data) => {
        // Expected JSON format: { "grid": [...], "words": [...] }
        // Theme is now passed as a prop, ignoring data.theme
        setGrid(data.grid);
        setPlacedWords(data.words);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Could not load puzzle data.");
        setLoading(false);
      });
  }, [file]);

  const handleStart = (r, c) => {
    setIsDragging(true);
    setSelection([{ r, c }]);
  };

  const handleTouchMove = (e) => {
    e.preventDefault(); // Prevent scrolling while playing
    if (!isDragging) return;

    const touch = e.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);

    if (target) {
      const r = target.getAttribute("data-r");
      const c = target.getAttribute("data-c");

      if (r !== null && c !== null) {
        handleEnter(parseInt(r), parseInt(c));
      }
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
      const nextHint = available[Math.floor(Math.random() * available.length)];
      setHintedWords([...hintedWords, nextHint]);
    }
  };

  const getPathD = (pathCoords) => {
    if (pathCoords.length < 2) return "";
    const toPixels = (r, c) => [c * 48 + 28, r * 48 + 28]; // approx based on CSS
    return pathCoords
      .map((s, i) => `${i === 0 ? "M" : "L"} ${toPixels(s.r, s.c).join(" ")}`)
      .join(" ");
  };

  if (loading)
    return (
      <div className="text-center p-8 text-pink-500">Loading Puzzle...</div>
    );
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

  // Determine grid columns dynamically if grid exists, else default to 6
  const numCols = grid.length > 0 ? grid[0].length : 6;

  return (
    <div
      className="flex flex-col items-center select-none"
      onMouseUp={handleEnd}
      onTouchEnd={handleEnd}
    >
      <div className="bg-white px-4 py-2 rounded-full mb-4 shadow-sm text-sm font-bold text-pink-500 uppercase tracking-wider">
        {theme}
      </div>

      <div
        className="relative bg-gray-200 p-2 rounded-xl touch-none inline-block"
        onTouchMove={handleTouchMove}
      >
        {/* Dynamically styled grid based on column count */}
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
                "w-10 h-10 flex items-center justify-center font-bold text-lg rounded-full select-none cursor-pointer transition-colors duration-150 ";

              if (isSelected)
                cls += "bg-blue-500 text-white z-20 relative scale-110";
              else if (isFound) cls += "bg-pink-300 text-white";
              else cls += "bg-white text-gray-700 hover:bg-gray-100";

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
        <svg className="strands-svg">
          {foundPaths.map((path, i) => (
            <path
              key={i}
              d={getPathD(path)}
              className="strands-path"
              style={{ stroke: "rgba(249, 168, 212, 0.6)" }}
            />
          ))}
          <path d={getPathD(selection)} className="strands-path" />
        </svg>
      </div>

      {/* Hint Button */}
      {foundWords.length < placedWords.length && (
        <button
          onClick={handleHint}
          className="mt-4 px-4 py-1 text-xs font-bold text-pink-500 bg-pink-50 hover:bg-pink-100 rounded-full border border-pink-200 transition-colors"
        >
          Need a hint? ({placedWords.length - foundWords.length} left)
        </button>
      )}

      {/* Word List */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center max-w-sm min-h-[40px]">
        {placedWords.map((w) => {
          const isFound = foundWords.includes(w);
          const isHinted = hintedWords.includes(w);

          if (!isFound && !isHinted) return null;

          return (
            <span
              key={w}
              className={`px-2 py-1 rounded text-xs font-bold border transition-all ${
                isFound
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-gray-100 text-gray-600 border-gray-300"
              }`}
            >
              {w}
            </span>
          );
        })}
      </div>
    </div>
  );
};

/* =========================================
    MODULE: SPELLING BEE GAME
    ========================================= */

const Hive = ({ center, letters, onLetterClick }) => {
  const positions = [
    { x: 0, y: -85 },
    { x: 75, y: -42 },
    { x: 75, y: 42 },
    { x: 0, y: 85 },
    { x: -75, y: 42 },
    { x: -75, y: -42 },
  ];
  return (
    <div className="relative w-64 h-64 flex items-center justify-center mb-6 scale-90">
      <div className="absolute z-10" onClick={() => onLetterClick(center)}>
        <div className="hex-btn center-letter">{center}</div>
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
          <div className="hex-btn shadow-sm">{l}</div>
        </div>
      ))}
    </div>
  );
};

const SpellingBee = ({ center, letters, msg, onComplete }) => {
  const [input, setInput] = useState("");
  const [found, setFound] = useState([]);
  const [score, setScore] = useState(0);
  const [error, setError] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  const allLetters = [center, ...letters];

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

    if (newScore > 15) onComplete();
  };

  const showError = (txt) => {
    setError(txt);
    setTimeout(() => setError(""), 1000);
  };

  return (
    <div className="flex flex-col items-center">
      <p className="text-center text-pink-600 font-medium mb-4 italic px-4 text-sm">
        {msg}
      </p>
      <div className="h-12 flex items-center text-3xl font-bold text-gray-800 uppercase tracking-widest mb-6 border-b-2 border-pink-200 min-w-[200px] justify-center relative">
        {input}
        <span className="absolute animate-pulse text-gray-300 right-0">|</span>
      </div>

      <div className="absolute top-48 z-50 flex flex-col items-center gap-1">
        {error && (
          <div className="bg-gray-800 text-white px-3 py-1 rounded text-sm pop-in">
            {error}
          </div>
        )}
        {isValidating && (
          <div className="bg-pink-100 text-pink-600 px-3 py-1 rounded text-sm animate-pulse shadow-sm border border-pink-200">
            Checking...
          </div>
        )}
      </div>

      <Hive
        center={center}
        letters={letters}
        onLetterClick={(l) => !isValidating && setInput((prev) => prev + l)}
      />

      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setInput("")}
          className="px-5 py-2 rounded-full border border-gray-300 text-gray-600 font-bold text-sm hover:bg-gray-50 disabled:opacity-50"
          disabled={isValidating}
        >
          Clear
        </button>
        <button
          onClick={handleSubmit}
          className="px-5 py-2 rounded-full bg-pink-500 text-white font-bold shadow-lg text-sm hover:bg-pink-600 disabled:opacity-50"
          disabled={isValidating}
        >
          Enter
        </button>
        <button
          onClick={() => setInput((prev) => prev.slice(0, -1))}
          className="px-5 py-2 rounded-full border border-gray-300 text-gray-600 font-bold text-sm hover:bg-gray-50 disabled:opacity-50"
          disabled={isValidating}
        >
          Delete
        </button>
      </div>

      <div className="w-full max-w-md bg-white rounded-lg p-4 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-400 font-bold uppercase">
            Words: {found.length}
          </span>
          <span className="text-xs text-pink-500 font-bold uppercase">
            Score: {score}/15
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {found.map((f) => (
            <span
              key={f}
              className="text-gray-700 text-sm border-b border-gray-100"
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
    className={`relative p-4 rounded-xl border-2 transition-all flex items-center justify-between
        ${
          locked
            ? "bg-gray-50 border-gray-100 opacity-60"
            : "bg-white border-white shadow-sm hover:shadow-md cursor-pointer"
        }
        ${completed ? "border-green-200 bg-green-50/50" : ""}`}
  >
    <div>
      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
        {new Date(game.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })}
      </div>
      <div className="font-bold text-gray-700">{game.title.split(":")[0]}</div>
    </div>
    <div className="text-xl">{locked ? "🔒" : completed ? "✅" : "👉"}</div>
  </div>
);

function App() {
  const [view, setView] = useState("HOME");
  const [activeGameIndex, setActiveGameIndex] = useState(null);
  const [completedGames, setCompletedGames] = useState(() => {
    const saved = localStorage.getItem("dailyPuzzleCompletedV2");
    return saved ? JSON.parse(saved) : [];
  });
  const [devMode, setDevMode] = useState(false);
  const [clicks, setClicks] = useState(0);

  const handleGameComplete = (index) => {
    fireConfetti();
    const newCompleted = [...completedGames, index];
    setCompletedGames(newCompleted);
    localStorage.setItem(
      "dailyPuzzleCompletedV2",
      JSON.stringify(newCompleted)
    );
    // Increased timeout slightly so user sees the reward button before navigating away automatically
    setTimeout(() => setView("HOME"), 4000);
  };

  const unlockDev = () => {
    if (devMode) return;
    const n = clicks + 1;
    setClicks(n);
    if (n >= 5) {
      setDevMode(true);
      alert("Dev Mode Unlocked");
    }
  };

  return (
    <div className="min-h-screen pb-10 max-w-md mx-auto">
      <Header onTitleClick={unlockDev} view={view} setView={setView} />

      {view === "HOME" ? (
        <div className="px-4 space-y-3 animate-fade-in">
          <div className="text-center mb-6">
            <p className="text-gray-500 text-sm">Dec 24 - Jan 5</p>
          </div>
          {GAMES_CONFIG.map((game, idx) => {
            const locked = isLocked(game.date, devMode);
            return (
              <GameCard
                key={idx}
                game={game}
                index={idx}
                locked={locked}
                completed={completedGames.includes(idx)}
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
              onComplete={() => handleGameComplete(activeGameIndex)}
            />
          )}
          {GAMES_CONFIG[activeGameIndex].type === "STRANDS" && (
            <Strands
              file={GAMES_CONFIG[activeGameIndex].file}
              theme={GAMES_CONFIG[activeGameIndex].theme}
              onComplete={() => handleGameComplete(activeGameIndex)}
            />
          )}
          {GAMES_CONFIG[activeGameIndex].type === "BEE" && (
            <SpellingBee
              center={GAMES_CONFIG[activeGameIndex].center}
              letters={GAMES_CONFIG[activeGameIndex].letters}
              msg={GAMES_CONFIG[activeGameIndex].msg}
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
