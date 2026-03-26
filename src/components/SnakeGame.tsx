import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Trophy, RotateCcw, Play } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const BASE_SPEED = 80;

type Point = { x: number; y: number };

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  const directionRef = useRef(direction);
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    setFood(generateFood(INITIAL_SNAKE));
    boardRef.current?.focus();
  };

  const handleKeyDown = useCallback((e: React.KeyboardEvent | KeyboardEvent) => {
    if (isGameOver) return;
    
    // Prevent default scrolling for arrow keys
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
      e.preventDefault();
    }

    if (e.key === ' ') {
      setIsPaused(prev => !prev);
      return;
    }

    if (isPaused) return;

    const currentDir = directionRef.current;
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (currentDir.y !== 1) setDirection({ x: 0, y: -1 });
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        if (currentDir.y !== -1) setDirection({ x: 0, y: 1 });
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (currentDir.x !== 1) setDirection({ x: -1, y: 0 });
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (currentDir.x !== -1) setDirection({ x: 1, y: 0 });
        break;
    }
  }, [isGameOver, isPaused]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (isPaused || isGameOver) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        // Check wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setIsGameOver(true);
          setHighScore(prev => Math.max(prev, score));
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setIsGameOver(true);
          setHighScore(prev => Math.max(prev, score));
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const speed = Math.max(30, BASE_SPEED - Math.floor(score / 50) * 5);
    const intervalId = setInterval(moveSnake, speed);

    return () => clearInterval(intervalId);
  }, [direction, food, isGameOver, isPaused, score, generateFood]);

  return (
    <div className="flex flex-col items-center w-full">
      {/* Score Board */}
      <div className="flex justify-between items-center w-full mb-4 px-4 py-2 bg-black border-4 border-fuchsia-500">
        <div className="flex flex-col">
          <span className="text-cyan-400 font-pixel text-xs md:text-sm mb-1">DATA_COLLECTED</span>
          <span className="text-fuchsia-500 font-pixel text-2xl md:text-3xl">
            {score.toString().padStart(4, '0')}
          </span>
        </div>
        
        <div className="flex flex-col items-end">
          <span className="text-cyan-400 font-pixel text-xs md:text-sm mb-1">MAX_CAPACITY</span>
          <span className="text-fuchsia-500 font-pixel text-2xl md:text-3xl">
            {highScore.toString().padStart(4, '0')}
          </span>
        </div>
      </div>

      {/* Game Board */}
      <div 
        ref={boardRef}
        className="relative bg-black border-4 border-cyan-400 p-1 outline-none w-full flex justify-center"
        tabIndex={0}
      >
        <div 
          className="grid gap-0 bg-black"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            width: 'min(100%, 600px)',
            aspectRatio: '1 / 1'
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            
            const snakeIndex = snake.findIndex(segment => segment.x === x && segment.y === y);
            const isSnakeHead = snakeIndex === 0;
            const isSnakeBody = snakeIndex > 0;
            const isFood = food.x === x && food.y === y;
            
            let cellClass = 'w-full h-full ';
            let cellStyle: React.CSSProperties = {};

            if (isSnakeHead) {
              cellClass += 'bg-fuchsia-500 z-10 shadow-[0_0_15px_#ff00ff]';
            } else if (isSnakeBody) {
              const opacity = Math.max(0.15, 1 - (snakeIndex / snake.length));
              cellClass += 'bg-fuchsia-500 shadow-[0_0_10px_#ff00ff]';
              cellStyle = { opacity };
            } else if (isFood) {
              cellClass += 'bg-cyan-400 animate-pulse shadow-[0_0_15px_#00ffff]';
            } else {
              cellClass += 'bg-transparent border border-cyan-900/40';
            }

            return (
              <div 
                key={i} 
                className={cellClass}
                style={cellStyle}
              />
            );
          })}
        </div>

        {/* Overlays */}
        {(isGameOver || isPaused) && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-20 border-4 border-fuchsia-500 m-2">
            {isGameOver ? (
              <>
                <h2 className="text-fuchsia-500 font-pixel text-2xl md:text-5xl mb-6 glitch text-center" data-text="SYSTEM_FAILURE">
                  SYSTEM_FAILURE
                </h2>
                <p className="text-cyan-400 font-terminal text-3xl mb-10">{'>'} FINAL_DATA: {score}</p>
                <button 
                  onClick={resetGame}
                  className="px-6 py-4 bg-cyan-400 text-black font-pixel text-xl hover:bg-fuchsia-500 hover:text-white transition-colors border-2 border-transparent hover:border-cyan-400"
                >
                  [ REBOOT_SEQUENCE ]
                </button>
              </>
            ) : (
              <>
                <h2 className="text-cyan-400 font-pixel text-2xl md:text-5xl mb-10 glitch text-center" data-text={snake.length > 1 ? 'HALTED' : 'AWAITING_INPUT'}>
                  {snake.length > 1 ? 'HALTED' : 'AWAITING_INPUT'}
                </h2>
                <button 
                  onClick={() => setIsPaused(false)}
                  className="px-8 py-4 bg-fuchsia-500 text-black font-pixel text-2xl hover:bg-cyan-400 hover:text-black transition-colors border-2 border-transparent hover:border-fuchsia-500"
                >
                  [ EXECUTE ]
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
