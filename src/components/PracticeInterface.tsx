
import { useState, useEffect } from 'react';
import { Mic, Play, X, Settings, Pause } from 'lucide-react';

export const PracticeInterface = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [performanceStatus, setPerformanceStatus] = useState<'good' | 'average' | 'poor'>('average');
  const [isMicActive, setIsMicActive] = useState(false);
  const [highlightPosition, setHighlightPosition] = useState({ left: '10%', top: '35%' }); // Adjusted initial position lower

  // Animation effect for the highlight box
  useEffect(() => {
    let animationFrame: number;
    let startTime: number;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / 300; // 300ms per movement (much faster)
      
      if (isPlaying) {
        // Calculate new position (moves from left to right)
        const newLeft = 10 + (progress % 80); // Moves between 10% and 90%
        setHighlightPosition(prev => ({
          ...prev,
          left: `${newLeft}%`
        }));
        animationFrame = requestAnimationFrame(animate);
      }
    };

    if (isPlaying) {
      animationFrame = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isPlaying]);

  const getStatusColor = () => {
    switch (performanceStatus) {
      case 'good':
        return 'bg-[#22c55e]/10 text-[#22c55e]';
      case 'average':
        return 'bg-[#f97316]/10 text-[#f97316]';
      case 'poor':
        return 'bg-[#ea384c]/10 text-[#ea384c]';
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header Controls */}
      <div className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => setIsMicActive(!isMicActive)}
            className={`control-button ${isMicActive ? 'text-blue-500' : 'text-gray-600'}`}
            title="Toggle microphone"
          >
            <Mic className={`w-6 h-6 ${isMicActive ? 'pulse' : ''}`} />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="control-button text-gray-600"
            title={isPlaying ? 'Pause practice' : 'Start practice'}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6" />
            )}
          </button>

          <div className="flex items-center gap-2">
            <button className="control-button text-gray-600" title="Settings">
              <Settings className="w-5 h-5" />
            </button>
            <button className="control-button text-gray-600" title="Close practice">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 mt-16">
        {/* Sheet Music Area */}
        <div className="flex-1 p-4 sheet-music-container">
          <img 
            src="/lovable-uploads/ca310dfc-efcf-4d7b-ad0c-f77c5b788df3.png" 
            alt="Violin Sheet Music"
            className="sheet-music"
          />
          <div 
            className="progress-highlight"
            style={{
              ...highlightPosition,
              width: '20px', // Narrower width to match single note size
              height: '40px', // Adjusted height for better note coverage
              transition: isPlaying ? 'none' : 'all 0.3s ease-out',
            }}
          />
        </div>

        {/* Performance Status Panel */}
        <div className="w-64 border-l border-gray-100 p-4">
          <div className={`status-indicator ${getStatusColor()}`}>
            <div className="flex-1">Performance</div>
            <div className="h-2 w-2 rounded-full bg-current" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticeInterface;
