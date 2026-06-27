import { useRef, useEffect, useCallback } from "react";

export function useSound() {
    const audioRef = useRef(null);

    const playSound = useCallback((soundPath, offset = 0) => {
        // Stop any in-flight audio before starting new one
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = "";
        }
        const audio = new Audio(soundPath);
        //return a promise so we finish playing the sound.
        audioRef.current = audio;
        audio.currentTime = offset;
        return new Promise((resolve) => {
            audio.addEventListener('ended', resolve);
            audio.play().catch((error) => {
                if (error.name !== "AbortError") {
                    console.error("Audio playback failed:", error);
                }
                resolve();
            });
        });
    }, []);

    const pause = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
        }
    }, []); //useEffect([pause]) will only run once

    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = "";
            }
        };
    }, []);

    return { playSound, pause };
}