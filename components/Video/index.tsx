"use client";
import Image from "next/image";
import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
import Slider from "../Slider";
import {
  formatTime,
  getDimensionsfromRatio,
  percentageToTime,
  timeToPercentage,
} from "@/utils/functions";

interface ICustomVideoPlayer {
  playBackSpeed: number;
  showCropper: boolean;
  aspectRatio: string;
  setPreviewData: Dispatch<
    SetStateAction<
      {
        timeStamp: number;
        coordinates: number[];
        volume: number;
        playbackRate: number;
      }[]
    >
  >;
}
//forwardRef<HTMLVideoElement, { src: string }>((props, ref)
const CustomVideoPlayer = forwardRef<HTMLCanvasElement, ICustomVideoPlayer>(
  (props, ref) => {
    const { playBackSpeed, showCropper, aspectRatio, setPreviewData } = props;
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPaused, setIsPaused] = useState(true);
    const [duration, setDuration] = useState<number>(0); // Total duration
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [position, setPosition] = useState({ x: 0 });
    const [isDragging, setIsDragging] = useState(false);

    const [cropperWidth, setcropperWidth] = useState(0);

    useEffect(() => {
      const width = getDimensionsfromRatio(
        aspectRatio,
        videoRef.current?.offsetHeight || 0
      );
      setcropperWidth(width);
    }, [aspectRatio]);

    const handleMouseDown = () => {
      setIsDragging(true);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (
        !isDragging ||
        !(videoRef as React.RefObject<HTMLVideoElement>).current
      )
        return;

      const parent = (
        videoRef as React.RefObject<HTMLVideoElement>
      ).current!.getBoundingClientRect();

      // Calculate the new position
      const newX = Math.min(
        Math.max(0, e.clientX - parent.left),
        parent.width - cropperWidth
      );

      setPosition({ x: newX });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    useEffect(() => {
      if (isDragging) {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
      } else {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      }

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }, [isDragging]);

    const handlePlayPause = () => {
      if (videoRef.current) {
        if (videoRef.current.paused) {
          videoRef.current.play();
          setIsPaused(false);
        } else {
          videoRef.current.pause();
          setIsPaused(true);
        }
        setDuration(videoRef.current.duration);
      }
    };

    const handleMuteUnmute = () => {
      if (videoRef.current) {
        setIsMuted((prev) => {
          if (!prev && videoRef.current) videoRef.current.volume = 0;
          else if (prev && videoRef.current) videoRef.current.volume = 0.5;
          return !prev;
        });
      }
    };

    const handleLoadedMetadata = () => {
      if (videoRef.current) {
        setDuration(videoRef.current.duration);
      }
    };

    // Update the current time during playback
    const handleTimeUpdate = () => {
      if (videoRef.current) {
        setCurrentTime(videoRef.current.currentTime);
        generatePreview();
      }
    };

    function handleVolumeChange(val: string | number) {
      const newVolume = parseFloat(String(Number(val) / 100));
      if (videoRef.current) {
        videoRef.current.volume = newVolume;
      }
    }

    const getVideoVolume = () => {
      if (videoRef.current) {
        setVolume(videoRef.current.volume);
        if (videoRef.current.volume === 0) {
          setIsMuted(true);
        } else if (videoRef.current.volume > 0) {
          setIsMuted(false);
        }
      }
    };

    const drawVideoPreview = useCallback(() => {
      if (videoRef.current && showCropper && (ref as any)?.current) {
        const context = (ref as any).current.getContext("2d");
        if (context) {
          // Set the canvas dimensions to match the cropper's width
          const cropperWidth2 = getDimensionsfromRatio(
            aspectRatio,
            videoRef.current.videoHeight
          ); // width of the cropper based on aspect ratio
          (ref as any).current.width = cropperWidth;
          (ref as any).current.height = videoRef.current.offsetHeight; // Use the desired height for the preview

          // Get the position and dimensions of the draggable cropper
          const cropperX = position.x; // X position of the cropper

          // Draw the current frame of the video on the canvas, but only the area covered by the cropper
          context.drawImage(
            videoRef.current,
            cropperX,
            0,
            cropperWidth2,
            videoRef.current.videoHeight, // Source rectangle (from the video)
            0,
            0,
            cropperWidth,
            videoRef.current.offsetHeight // Destination rectangle (on the canvas)
          );
        }
      }
    }, [aspectRatio, cropperWidth, position.x, ref, showCropper]);

    const generatePreview = useCallback(() => {
      if (videoRef.current && !isPaused) {
        setPreviewData((prev) => [
          ...prev,
          {
            timeStamp: currentTime,
            coordinates: [
              position.x,
              0,
              cropperWidth,
              videoRef.current!.offsetHeight,
            ],
            volume: volume,
            playbackRate: playBackSpeed,
          },
        ]);
      }
    }, [
      cropperWidth,
      currentTime,
      isPaused,
      playBackSpeed,
      position.x,
      setPreviewData,
      volume,
    ]);

    useEffect(() => {
      if (videoRef.current) videoRef.current.playbackRate = playBackSpeed;
    }, [playBackSpeed]);

    useEffect(() => {
      drawVideoPreview();
    });

    return (
      <div className="flex flex-col gap-4">
        <div className="w-full h-full relative">
          <video
            ref={videoRef}
            src="/test-video-3.mp4"
            className="w-auto h-auto max-w-lg rounded-lg shadow-md"
            loop
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
            onVolumeChange={getVideoVolume}
          />
          {showCropper && (
            <div
              className="absolute h-full top-0 bottom-0 border-l border-r flex flex-wrap border-l-white border-r-white bg-[#FFFFFF66] cursor-crosshair"
              onMouseDown={handleMouseDown}
              style={{
                left: `${position.x}px`,
                width: `${cropperWidth}px`,
              }}
            >
              <div className="w-[50%] h-[50%] border-dotted border-r border-b" />
              <div className="w-[50%] h-[50%]" />
              <div className="w-[50%] h-[50%]" />
              <div className="w-[50%] h-[50%] border-dotted border-l border-t" />
            </div>
          )}
        </div>
        <div className="flex gap-4 items-center w-[75%]">
          <div onClick={handlePlayPause} className="cursor-pointer">
            {!isPaused ? (
              <Image
                src="/icons/pause-icon.png"
                width={16}
                height={16}
                alt="play"
              />
            ) : (
              <Image
                src="/icons/play-icon.png"
                width={16}
                height={16}
                alt="play"
              />
            )}
          </div>
          <Slider
            min="0"
            max="100"
            step="1"
            defaultValue="0"
            width="100%"
            customValue={String(timeToPercentage(currentTime, duration))}
            onChange={(val) => {
              if (videoRef.current)
                videoRef.current.currentTime = percentageToTime(+val, duration);
            }}
          />
        </div>
        {/* Duration Audio Section */}
        <div className="flex items-center justify-between w-[75%]">
          <p className="text-xs text-white font-medium">
            {formatTime(currentTime)}{" "}
            <span className="text-[#FFFFFF80]">| {formatTime(duration)}</span>
          </p>
          <div className="flex items-center gap-[10px]">
            <div onClick={handleMuteUnmute} className="cursor-pointer">
              {!isMuted ? (
                <Image
                  src="/icons/audio-on.svg"
                  width={16}
                  height={16}
                  alt="audio-on"
                />
              ) : (
                <Image
                  src="/icons/audio-off.png"
                  width={16}
                  height={16}
                  alt="audio-off"
                />
              )}
            </div>
            <Slider
              min="0"
              max="100"
              step="10"
              defaultValue="0"
              width="45px"
              onChange={(val) => {
                handleVolumeChange(val);
              }}
              customValue={String(volume * 100)}
            />
          </div>
        </div>
      </div>
    );
  }
);

export default CustomVideoPlayer;
CustomVideoPlayer.displayName = "CustomVideoPlayer";
