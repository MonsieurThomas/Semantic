import React from "react";
import { motion } from "framer-motion";

interface AnimatedWordProps {
  word: string;
  top: string;
  left: string;
  progressThreshold: number;
  currentProgress: number;
}

const AnimatedWord: React.FC<AnimatedWordProps> = ({
  word,
  top,
  left,
  progressThreshold,
  currentProgress,
}) => {
  return (
    <>
      {currentProgress >= progressThreshold && (
        <motion.h1
          key={word}
          className="font-bold text-2xl absolute"
          style={{ top, left }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {word}
        </motion.h1>
      )}
    </>
  );
};

export default AnimatedWord;
