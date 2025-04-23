import React, { useRef, useState, useEffect } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize,
} from "lucide-react";

const VideoDesign = ({ post, isSelected, onSelect }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [duration, setDuration] = useState("0:00");
  const [currentTime, setCurrentTime] = useState("0:00");
  const [videoEnded, setVideoEnded] = useState(false);
  const [showCenterButton, setShowCenterButton] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Format time (mm:ss)
  const formatTime = (time) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? "0" + secs : secs}`;
  };

  // Format date to show time ago
  const formatDate = (date) => {
    const diff = Math.floor((new Date() - new Date(date)) / 1000);
    const units = [
      { name: "year", seconds: 31536000 },
      { name: "month", seconds: 2592000 },
      { name: "day", seconds: 86400 },
      { name: "hour", seconds: 3600 },
      { name: "minute", seconds: 60 },
      { name: "second", seconds: 1 },
    ];

    for (let unit of units) {
      const interval = Math.floor(diff / unit.seconds);
      if (interval >= 1) {
        return `${interval} ${unit.name}${interval > 1 ? "s" : ""} ago`;
      }
    }
    return "just now";
  };

  // Load metadata and set total duration
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.onloadedmetadata = () => {
        setDuration(formatTime(video.duration));
      };
    }
  }, [post.videoUrl]);

  useEffect(() => {
    if (!isSelected && videoRef.current) {
      videoRef.current.pause();
    }
  }, [isSelected]);

  // Play/Pause Video
  const togglePlay = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
      setVideoEnded(false);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    showTemporaryCenterButton();
  };

  // Show Center Play/Pause Button Temporarily
  const showTemporaryCenterButton = () => {
    setShowCenterButton(true);
    setTimeout(() => {
      setShowCenterButton(false);
    }, 1000);
  };

  // Retry Video (When Video Ends)
  const handleRetry = () => {
    videoRef.current.currentTime = 0;
    videoRef.current.play();
    setIsPlaying(true);
    setVideoEnded(false);
  };

  // Update Progress Bar & Current Time
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    setProgress((video.currentTime / video.duration) * 100);
    setCurrentTime(formatTime(video.currentTime));
  };

  // Detect Video End
  const handleVideoEnd = () => {
    setIsPlaying(false);
    setVideoEnded(true);
  };

  // Seek Video
  const handleSeek = (e) => {
    const video = videoRef.current;
    const seekTime = (e.target.value / 100) * video.duration;
    video.currentTime = seekTime;
    setProgress(e.target.value);
  };

  // Change Volume
  const toggleMute = () => {
    if (videoRef.current.volume === 0) {
      videoRef.current.volume = volume;
    } else {
      setVolume(videoRef.current.volume);
      videoRef.current.volume = 0;
    }
  };

  // Fullscreen Mode
  const handleFullScreen = () => {
    if (!document.fullscreenElement) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`cursor-pointer transition-all duration-300 mb-auto ${
        isSelected
          ? "col-span-3 row-span-3 h-auto w-auto"
          : "col-span-1 row-span-1 h-auto w-full"
      }`}
      onClick={(e) => {
        if (isSelected) {
          togglePlay();
        } else {
          onSelect(post._id, videoRef.current);
          setTimeout(() => {
            if (videoRef.current) {
              videoRef.current.play();
              setIsPlaying(true);
            }
          }, 100);
        }
      }}
    >
      <div
        className="relative w-full h-full cursor-pointer transition-all duration-300"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        <video
          ref={videoRef}
          src={post.videoUrl}
          className="w-full h-full object-cover rounded-lg"
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleVideoEnd}
        />

        {!isSelected && (
          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
            {duration}
          </div>
        )}
        {videoEnded && (
          <div className="absolute inset-0 flex justify-center items-center bg-black/50">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRetry();
              }}
              className="bg-white/80 text-black p-4 rounded-full hover:bg-white transition"
            >
              <RotateCcw size={30} />
            </button>
          </div>
        )}
        {isSelected && showCenterButton && (
          <div className="absolute inset-0 flex justify-center items-center">
            <div className="bg-black/60 p-4 rounded-full animate-fadeOut">
              {isPlaying ? (
                <Pause size={40} color="white" />
              ) : (
                <Play size={40} color="white" />
              )}
            </div>
          </div>
        )}
        {isSelected && showControls && !videoEnded && (
          <div className="absolute inset-0 flex flex-col justify-end transition-opacity duration-300">
            <div
              className="flex items-center space-x-4 p-4 bg-gradient-to-t from-black/50 via-black/30 to-transparent rounded-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                className="text-white hover:text-gray-300 transition"
              >
                {isPlaying ? <Pause size={30} /> : <Play size={30} />}
              </button>
              <div className="flex items-center space-x-2">
                <span className="text-white text-sm min-w-[25px]">
                  {currentTime}
                </span>
                <span className="text-white text-sm">/</span>
                <span className="text-white text-sm min-w-[50px]">
                  {duration}
                </span>
              </div>
              <input
                type="range"
                value={progress}
                onChange={handleSeek}
                min="0"
                max="100"
                className="w-full"
              />
              <div className="relative group flex items-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMute();
                  }}
                  className="text-white hover:text-gray-300 transition"
                >
                  {videoRef.current && videoRef.current.volume === 0 ? (
                    <VolumeX size={24} />
                  ) : (
                    <Volume2 size={24} />
                  )}
                </button>
                <div className="absolute bottom-7 left-1/2 transform -translate-x-1/2 flex justify-center items-center bg-black/70 px-3 w-1 h-[100px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <input
                    type="range"
                    value={volume * 100}
                    onChange={(e) => {
                      const newVolume = e.target.value / 100;
                      setVolume(newVolume);
                      videoRef.current.volume = newVolume;
                    }}
                    min="0"
                    max="100"
                    className="w-20 h-1 appearance-none bg-gray-400 cursor-pointer rotate-[-90deg] accent-white"
                  />
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFullScreen();
                }}
                className="text-white hover:text-gray-300 transition"
              >
                <Maximize size={24} />
              </button>
            </div>
          </div>
        )}
      </div>
      {!isSelected && (
        <div className="mt-2">
          <span className="font-bold">{post.videoTitle}</span>
          <div className="text-gray-500 text-[12px] mt-[2px]">
            <span>240K views • {formatDate(post.createdAt)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoDesign;
