import React from 'react';
import { useRef, useState, useEffect } from "react";
import video_ from "./catch_pikachu.mp4";

const MyVideo = () => {
  const videoRef = useRef(null);
  const intervalRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMute, setIsMute] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volumn, setVolumn] = useState(1);
  const [useNativeControls, setUseNativeControls] = useState(
    window.innerWidth < 767
  );

  useEffect(() => {
    const handleResize = () => {
      setUseNativeControls(window.innerWidth < 767);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const updateProgress = () => {
    if(videoRef.current){
        const value = 
        (videoRef.current.currentTime / videoRef.current.duration)  * 100;
        setProgress(value);
    }
  };

  const startProgressLoop = () => {
    if(intervalRef.current){
        clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
        updateProgress();
    }, 1000);
  };

  const stopProgressLoop = () => {
    if(intervalRef.current){
        clearInterval(intervalRef.current);
        intervalRef.current = null;
    }
  };

  const togglePlayPause = () => {
    if(videoRef.current){
        if(videoRef.current.paused){
            videoRef.current.play();
            setIsPlaying(true);
            startProgressLoop();
        }else{
            videoRef.current.pause();
            setIsPlaying(false);
            stopProgressLoop();
        }
    }
  };

  const handleSeek = (event) => {
    const seekTo = (event.target.value / event.target.duration) *100;
    videoRef.current.currentTime = seekTo;
    setProgress(event.target.value);
  };

  const stopVideo = () => {
    if(videoRef.current){
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
        setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const currentVolumn = videoRef.current.volumn;
    if(currentVolumn > 0){
        videoRef.current.volumn = 0;
        setVolumn(0);
        setIsMute(true);
    }else{
        videoRef.current.volumn = 1;
        setVolumn(1);
        setIsMute(false);
    }
  };

  const handleVolumnChange = (event) => {
    const newVolumn = event.target.value;
    videoRef.current.volumn = newVolumn;
    setVolumn(newVolumn);
    setIsMute(newVolumn === 0);
  }

  const toggleFullscreen = () => {
    if(!isFullscreen){
        if(videoRef.current.requestFullscreen){
            videoRef.current.requestFullscreen();
        } else if(videoRef.current.mozRequestFullscreen){
            // fire fox
            videoRef.current.mozRequestFullscreen();
        } else if(videoRef.current.webkitRequestFullscreen){
            // chorme, safari & opera
            videoRef.current.webkitRequestFullscreen();
        } else if(videoRef.current.msRequestFullscreen){
            // IE/edge
            videoRef.current.msRequestFullscreen();
        }
    }else{
        if(document.exitFullscreen){
            document.exitFullscreen();
        } else if(document.mozCancelFullscreen){
            document.mozCancelFullscreen();
        } else if(document.webkitExitFullscreen){
            document.webkitExitFullscreen();
        } else if(document.msExitFullscreen){
            document.msExitFullscreen();
        }
    }
    setIsFullscreen(!isFullscreen);
  };

  document.addEventListener('fullscreenchange', () => {
    setIsFullscreen(!!document.fullscreenElement);
  });

  useEffect(() => {
    const handleFullscreenChange = () => 
        setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const videoi = videoRef.current;

    const handleVideoEnd = () => {
        setIsPlaying(false);
        setProgress(0);
        stopProgressLoop();
    };

    if(videoi){
        videoi.addEventListener('ended', handleVideoEnd);
    };

    return() =>{
        if(videoi){
            videoi.removeEventListener('ended', handleVideoEnd);
        }
        stopProgressLoop();
    };
  }, []);

  const renderCustomControls = () =>{
    return(
        <>
            <button onClick={togglePlayPause}>
                {isPlaying ? <ion-icon aria-hidden="true" name="play-outline"/> : <ion-icon name="pause-outline"/>}
            </button>
            <button onClick={stopVideo}>
            <ion-icon name="stop-outline"/>
            </button>
            <input 
                type="range" 
                min='0' 
                max='100' 
                value={progress} 
                onChange={handleSeek}
            />
            <button onClick={toggleMute}>
                {isMute ? <ion-icon name="volume-mute-outline"/> : <ion-icon name="volume-high-outline"/>}
            </button>
            <input 
                type="range" 
                min='0' max='1' 
                step='0.05' 
                value={volumn} 
                onChange={handleVolumnChange}
            />
            <button onClick={toggleFullscreen}>
                {isFullscreen ? <ion-icon name="contract-outline"/> : <ion-icon name="expand-outline"/>}
            </button>
        </>
    );
  };

  return (
    <div>
      <h1>My Custom Player</h1>
      <video
        className="video-player"
        src={video_}
        ref={videoRef}
        onClick={togglePlayPause}
        onPlay={startProgressLoop}
        onPause={stopProgressLoop}
        controls={useNativeControls}
      />
      <>
        {!useNativeControls && renderCustomControls()}
      </>
      
    </div>
  );
};

export default MyVideo;
