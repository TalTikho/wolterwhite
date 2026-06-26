import { useRef, useEffect } from "react";

//Custom Audio playback hook

export function useSound () {
    //Do not refresh the page more than once.
    //just one playback is needed.
    const audioRef = useRef(new Audio(''));

    //play method
    const playSound = (soundPath) => {
        audioRef.current = new Audio(soundPath);
        audioRef.current.play().catch(error=>{
            console.error("Audio Playback failed", error);
        });
    }
    //pause method
    const pause = () =>{
        audioRef.current.pause();
    };
    //clear after leaving the using component.
    useEffect(()=>{
        const currentAudio = audioRef.current;
        return () => {
            currentAudio.pause();
            currentAudio.src = "";
        }
    }, []);
    return {playSound, pause}

}
