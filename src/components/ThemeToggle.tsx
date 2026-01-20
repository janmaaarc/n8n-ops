import React from 'react';
import { motion } from 'framer-motion';

interface ThemeToggleProps {
  darkMode: boolean;
  toggleTheme: () => void;
}

const AnimatedSun: React.FC<{ isActive: boolean }> = ({ isActive }) => (
  <motion.svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    animate={{
      rotate: isActive ? 360 : 0,
      scale: isActive ? 1 : 0.8,
    }}
    transition={{
      rotate: { duration: 10, repeat: Infinity, ease: "linear" },
      scale: { duration: 0.3 },
    }}
  >
    <motion.circle
      cx="12"
      cy="12"
      r="4"
      animate={{ scale: isActive ? 1 : 0.9 }}
      transition={{ duration: 0.3 }}
    />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
      <motion.line
        key={angle}
        x1="12"
        y1="2"
        x2="12"
        y2="4"
        transform={`rotate(${angle} 12 12)`}
        animate={{
          opacity: isActive ? 1 : 0.4,
        }}
        transition={{ duration: 0.2, delay: i * 0.03 }}
      />
    ))}
  </motion.svg>
);

const AnimatedMoon: React.FC<{ isActive: boolean }> = ({ isActive }) => (
  <motion.div className="relative flex items-center justify-center">
    <motion.svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      animate={{
        rotate: isActive ? [0, -10, 0] : 0,
        scale: isActive ? 1 : 0.8,
      }}
      transition={{
        rotate: { duration: 2, repeat: Infinity, ease: "easeInOut" },
        scale: { duration: 0.3 },
      }}
    >
      <motion.path
        d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"
        transform="translate(-2, 0)"
        animate={{ pathLength: isActive ? 1 : 0.8 }}
        transition={{ duration: 0.5 }}
      />
    </motion.svg>
    {isActive && (
      <>
        <motion.div
          className="absolute -top-1 -right-1 text-current"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0.5, 1, 0.5], scale: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0 }}
        >
          ✦
        </motion.div>
        <motion.div
          className="absolute -bottom-0.5 -left-1.5 text-current text-[8px]"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
        >
          ✦
        </motion.div>
      </>
    )}
  </motion.div>
);

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ darkMode, toggleTheme }) => {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      onClick={toggleTheme}
      className="relative flex items-center p-1 rounded-full bg-gradient-to-r from-amber-100 to-amber-200 dark:from-indigo-900 dark:to-purple-900 transition-all duration-500 shadow-inner"
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      <motion.div
        className="absolute w-8 h-8 rounded-full shadow-lg"
        style={{
          background: darkMode
            ? 'linear-gradient(135deg, #312e81 0%, #4c1d95 100%)'
            : 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
          boxShadow: darkMode
            ? '0 0 15px rgba(99, 102, 241, 0.5)'
            : '0 0 15px rgba(251, 191, 36, 0.6)',
        }}
        animate={{
          x: darkMode ? 28 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25,
        }}
      />

      <motion.div
        className="relative z-10 p-1.5 rounded-full"
        animate={{
          color: !darkMode ? '#ffffff' : '#9ca3af',
        }}
        transition={{ duration: 0.3 }}
      >
        <AnimatedSun isActive={!darkMode} />
      </motion.div>

      <motion.div
        className="relative z-10 p-1.5 rounded-full"
        animate={{
          color: darkMode ? '#ffffff' : '#9ca3af',
        }}
        transition={{ duration: 0.3 }}
      >
        <AnimatedMoon isActive={darkMode} />
      </motion.div>
    </motion.button>
  );
};
