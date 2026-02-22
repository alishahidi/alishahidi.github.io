'use client';

import { useState, useEffect } from 'react';

interface TypeWriterProps {
  text: string;
  delay?: number;
  startDelay?: number;
  onComplete?: () => void;
  cursor?: boolean;
  className?: string;
}

export function TypeWriter({
  text,
  delay = 50,
  startDelay = 0,
  onComplete,
  cursor = true,
  className = '',
}: TypeWriterProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    setDisplayedText('');
    setIsComplete(false);

    const startTimer = setTimeout(() => {
      let index = 0;

      const typeInterval = setInterval(() => {
        if (index < text.length) {
          setDisplayedText(text.slice(0, index + 1));
          index++;
        } else {
          clearInterval(typeInterval);
          setIsComplete(true);
          onComplete?.();
        }
      }, delay);

      return () => clearInterval(typeInterval);
    }, startDelay);

    return () => clearTimeout(startTimer);
  }, [text, delay, startDelay, onComplete]);

  // Blinking cursor
  useEffect(() => {
    if (!cursor) return;

    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, [cursor]);

  return (
    <span className={className}>
      {displayedText}
      {cursor && (
        <span
          className={`inline-block w-2 h-4 ml-0.5 bg-current align-middle ${
            showCursor ? 'opacity-100' : 'opacity-0'
          } ${isComplete ? 'animate-pulse' : ''}`}
        />
      )}
    </span>
  );
}

// Multi-line typewriter that types lines one after another
interface MultiLineTypeWriterProps {
  lines: string[];
  lineDelay?: number;
  charDelay?: number;
  className?: string;
  lineClassName?: string;
}

export function MultiLineTypeWriter({
  lines,
  lineDelay = 500,
  charDelay = 30,
  className = '',
  lineClassName = '',
}: MultiLineTypeWriterProps) {
  const [currentLine, setCurrentLine] = useState(0);
  const [completedLines, setCompletedLines] = useState<string[]>([]);

  const handleLineComplete = () => {
    if (currentLine < lines.length - 1) {
      setCompletedLines((prev) => [...prev, lines[currentLine]]);
      setTimeout(() => {
        setCurrentLine((prev) => prev + 1);
      }, lineDelay);
    }
  };

  return (
    <div className={className}>
      {/* Completed lines */}
      {completedLines.map((line, i) => (
        <div key={i} className={lineClassName}>
          {line}
        </div>
      ))}

      {/* Currently typing line */}
      {currentLine < lines.length && (
        <div className={lineClassName}>
          <TypeWriter
            text={lines[currentLine]}
            delay={charDelay}
            onComplete={handleLineComplete}
            cursor={currentLine === lines.length - 1}
          />
        </div>
      )}
    </div>
  );
}
