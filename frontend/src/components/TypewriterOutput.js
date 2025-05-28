import React, { useState, useEffect, useRef } from 'react';

const TypewriterOutput = ({ textArray, speed = 30, delay = 500 }) => {
  const [displayText, setDisplayText] = useState('');
  const animationRef = useRef();

  useEffect(() => {
    if (!textArray || textArray.length === 0) {
      setDisplayText('');
      return;
    }

    setDisplayText('');
    let currentLine = 0;
    let charIndex = 0;

    const type = () => {
      if (currentLine < textArray.length) {
        const line = textArray[currentLine];
        
        if (charIndex < line.length) {
          setDisplayText(prev => prev + line.charAt(charIndex));
          charIndex++;
          animationRef.current = setTimeout(type, speed);
        } else {
          setDisplayText(prev => prev + '\n');
          currentLine++;
          charIndex = 0;
          animationRef.current = setTimeout(type, delay);
        }
      }
    };

    animationRef.current = setTimeout(type, delay);

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [textArray, speed, delay]);

  return (
    <pre className="typewriter-output">
      {displayText || 'Generating output...'}
    </pre>
  );
};

export default TypewriterOutput;