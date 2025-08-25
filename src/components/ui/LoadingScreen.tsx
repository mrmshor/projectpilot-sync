import React from 'react'
import { motion } from 'framer-motion'

interface LoadingScreenProps {
  message?: string
}

export default function LoadingScreen({ message = 'טוען...' }: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 bg-gray-50 dark:bg-gray-950 flex items-center justify-center z-50">
      <div className="text-center">
        <motion.div
          className="w-16 h-16 bg-gradient-to-br from-apple-blue to-apple-purple rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-apple-lg"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            className="text-white"
          >
            <path
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-2"
        >
          <h3 className="heading-sm">מנהל משימות מודרני</h3>
          <p className="text-caption">{message}</p>
        </motion.div>
        
        <motion.div
          className="mt-8 flex justify-center space-x-1 rtl:space-x-reverse"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-apple-blue rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  )
}