import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Trophy, RotateCcw, Play } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const BASE_SPEED = 150;

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

    const speed = Math.max(50, BASE_SPEED - Math.floor(score / 50) * 10);
    const intervalId = setInterval(moveSnake, speed);

    return () => clearInterval(intervalId);
  }, [direction, food, isGameOver, isPaused, score, generateFood]);

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
      {/* Score Board */}
      <div className="flex justify-between items-center w-full mb-6 px-6 py-3 bg-black/60 border border-cyan-500/30 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.2)] backdrop-blur-md">
        <div className="flex flex-col">
          <span className="text-cyan-500/70 font-mono text-xs uppercase tracking-wider">Score</span>
          <span className="text-cyan-400 font-mono text-2xl font-bold drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">
            {score.toString().padStart(4, '0')}
          </span>
        </div>
        
        <div className="flex flex-col items-end">
          <span className="text-yellow-500/70 font-mono text-xs uppercase tracking-wider flex items-center gap-1">
            <Trophy size={12} /> High Score
          </span>
          <span className="text-yellow-400 font-mono text-2xl font-bold drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]">
            {highScore.toString().padStart(4, '0')}
          </span>
        </div>
      </div>

      {/* Game Board */}
      <div 
        ref={boardRef}
        className="relative bg-black/90 border-2 border-cyan-500/50 rounded-lg p-1 shadow-[0_0_30px_rgba(6,182,212,0.3)] outline-none"
        tabIndex={0}
      >
        <div 
          className="grid gap-[1px] bg-cyan-950/30"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            width: 'min(80vw, 400px)',
            height: 'min(80vw, 400px)'
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            
            const isSnakeHead = snake[0].x === x && snake[0].y === y;
            const isSnakeBody = snake.some((segment, idx) => idx !== 0 && segment.x === x && segment.y === y);
            const isFood = food.x === x && food.y === y;

            return (
              <div 
                key={i} 
                className={`w-full h-full rounded-sm transition-all duration-75 ${
                  isSnakeHead 
                    ? 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)] z-10' 
                    : isSnakeBody 
                      ? 'bg-cyan-600/80 shadow-[0_0_5px_rgba(8,145,178,0.5)]' 
                      : isFood 
                        ? 'bg-fuchsia-500 shadow-[0_0_12px_rgba(217,70,239,0.9)] animate-pulse rounded-full scale-75' 
                        : 'bg-transparent'
                }`}
              />
            );
          })}
        </div>

        {/* Overlays */}
        {(isGameOver || isPaused) && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg z-20">
            {isGameOver ? (
              <>
                <h2 className="text-red-500 font-mono text-4xl font-bold mb-2 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)] uppercase tracking-widest">
                  Game Over
                </h2>
                <p className="text-cyan-100 font-mono mb-6">Final Score: {score}</p>
                <button 
                  onClick={resetGame}
                  className="flex items-center gap-2 px-6 py-3 bg-cyan-600 text-white font-mono uppercase tracking-wider rounded-full hover:bg-cyan-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] transition-all"
                >
                  <RotateCcw size={18} /> Play Again
                </button>
              </>
            ) : (
              <>
                <h2 className="text-cyan-400 font-mono text-3xl font-bold mb-6 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] uppercase tracking-widest">
                  {snake.length > 1 ? 'Paused' : 'Ready?'}
                </h2>
                <button 
                  onClick={() => setIsPaused(false)}
                  className="flex items-center gap-2 px-8 py-4 bg-cyan-600 text-white font-mono uppercase tracking-wider rounded-full hover:bg-cyan-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] transition-all"
                >
                  <Play size={20} className="ml-1" /> Start
                </button>
                <p className="text-cyan-500/60 font-mono text-xs mt-6 uppercase tracking-widest text-center">
                  Use Arrow Keys or WASD to move
                </p>
                <p className="text-cyan-500/60 font-mono text-xs mt-2 uppercase tracking-widest">
                  Space to pause
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
