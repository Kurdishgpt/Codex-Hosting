import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Server, CheckCircle } from 'lucide-react';

const ServerInstallation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const serverId = searchParams.get('id') || 'default';
  const serverName = searchParams.get('name') || 'My Server';
  
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Initializing server components...');
  const [isComplete, setIsComplete] = useState(false);

  // Snake game state
  const [snake, setSnake] = useState([[5, 5]]);
  const [food, setFood] = useState([10, 10]);
  const [direction, setDirection] = useState('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const gridSize = 20;
  const cellSize = 15;

  // Installation progress simulation
  useEffect(() => {
    const steps = [
      { progress: 20, status: 'Allocating resources...', delay: 1000 },
      { progress: 40, status: 'Installing runtime environment...', delay: 2000 },
      { progress: 60, status: 'Configuring network settings...', delay: 1500 },
      { progress: 80, status: 'Setting up file system...', delay: 1500 },
      { progress: 95, status: 'Finalizing installation...', delay: 1000 },
      { progress: 100, status: 'Installation complete!', delay: 500 }
    ];

    let currentStep = 0;
    const runNextStep = () => {
      if (currentStep < steps.length) {
        setTimeout(() => {
          setProgress(steps[currentStep].progress);
          setStatus(steps[currentStep].status);
          
          if (steps[currentStep].progress === 100) {
            setIsComplete(true);
          }
          
          currentStep++;
          runNextStep();
        }, steps[currentStep].delay);
      }
    };

    runNextStep();
  }, []);

  // Snake game logic
  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      let newHead;

      switch (direction) {
        case 'UP':
          newHead = [head[0], head[1] - 1];
          break;
        case 'DOWN':
          newHead = [head[0], head[1] + 1];
          break;
        case 'LEFT':
          newHead = [head[0] - 1, head[1]];
          break;
        case 'RIGHT':
          newHead = [head[0] + 1, head[1]];
          break;
        default:
          newHead = head;
      }

      // Check wall collision
      if (
        newHead[0] < 0 ||
        newHead[0] >= gridSize ||
        newHead[1] < 0 ||
        newHead[1] >= gridSize
      ) {
        setGameOver(true);
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some(([x, y]) => x === newHead[0] && y === newHead[1])) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead[0] === food[0] && newHead[1] === food[1]) {
        setScore((s) => {
          const newScore = s + 1;
          if (newScore > highScore) setHighScore(newScore);
          return newScore;
        });
        // Generate new food
        let newFood: [number, number];
        do {
          newFood = [
            Math.floor(Math.random() * gridSize),
            Math.floor(Math.random() * gridSize)
          ];
        } while (newSnake.some(([x, y]) => x === newFood[0] && y === newFood[1]));
        setFood(newFood);
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, gameOver, isPaused, food, highScore]);

  useEffect(() => {
    const interval = setInterval(moveSnake, 150);
    return () => clearInterval(interval);
  }, [moveSnake]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver) {
        if (e.key === ' ') {
          setSnake([[5, 5]]);
          setFood([10, 10]);
          setDirection('RIGHT');
          setGameOver(false);
          setScore(0);
        }
        return;
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
        case ' ':
          setIsPaused((p) => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, gameOver]);

  const handleGoToServer = () => {
    navigate(`/server-console?id=${serverId}`);
  };

  return (
    <div className="min-h-screen text-white flex items-center justify-center" style={{ backgroundImage: `url('/background.png')`, backgroundAttachment: 'fixed', backgroundSize: 'cover' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-900/90 backdrop-blur-md border border-gray-700 rounded-2xl p-8 max-w-lg w-full mx-4"
      >
        {/* Server Installation Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Server className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Server Installation</h1>
          <p className="text-gray-400 text-sm">
            Your server "{serverName}" is currently being set up and configured.<br/>
            Please check back in a few minutes.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="bg-gray-800 rounded-full h-2 mb-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-full"
            />
          </div>
          <p className="text-center text-sm text-gray-400">{status}</p>
        </div>

        {/* Snake Game */}
        <div className="bg-gray-800 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-center mb-3">
            <span className="text-green-400 mr-2">🐍</span>
            <h3 className="text-lg font-semibold">Play Snake While You Wait!</h3>
          </div>
          
          <div 
            className="bg-black rounded-lg mx-auto mb-3 relative"
            style={{ 
              width: gridSize * cellSize, 
              height: gridSize * cellSize,
              border: '2px solid #4B5563'
            }}
          >
            {/* Snake */}
            {snake.map(([x, y], i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: x * cellSize,
                  top: y * cellSize,
                  width: cellSize - 1,
                  height: cellSize - 1,
                  backgroundColor: i === 0 ? '#10B981' : '#34D399',
                  borderRadius: '2px'
                }}
              />
            ))}

            {/* Food */}
            <div
              style={{
                position: 'absolute',
                left: food[0] * cellSize,
                top: food[1] * cellSize,
                width: cellSize - 1,
                height: cellSize - 1,
                backgroundColor: '#EF4444',
                borderRadius: '50%'
              }}
            />

            {/* Game Over Overlay */}
            {gameOver && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-red-500 font-bold text-xl mb-2">Game Over!</p>
                  <p className="text-white text-sm mb-2">Score: {score}</p>
                  <p className="text-gray-400 text-xs">Press SPACE to restart</p>
                </div>
              </div>
            )}

            {/* Pause Overlay */}
            {isPaused && !gameOver && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <p className="text-white font-bold">PAUSED</p>
              </div>
            )}
          </div>

          <div className="flex justify-between text-sm">
            <div>
              <span className="text-gray-400">Score: </span>
              <span className="text-white font-bold">{score}</span>
            </div>
            <div>
              <span className="text-gray-400">High Score: </span>
              <span className="text-yellow-400 font-bold">{highScore}</span>
            </div>
          </div>
          <p className="text-center text-xs text-gray-500 mt-2">
            Use Arrow Keys or WASD to move • Click to start
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {isComplete ? (
            <button
              onClick={handleGoToServer}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle size={20} />
              Go to Server
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate('/dashboard')}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Check Status Later
              </button>
              <button
                onClick={handleGoToServer}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Go to Server
              </button>
            </>
          )}
        </div>

        {/* Info Note */}
        <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-700/50 rounded-lg">
          <p className="text-yellow-200 text-xs">
            <strong>Note:</strong> If your server doesn't install within 10-15 minutes, it may be stuck due to high server load. You can go to the server console and check logs for more information.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ServerInstallation;
