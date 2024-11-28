'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import Image from 'next/image'

const challenges = [
  { id: 1, name: "Recycling Awareness and Sorting" },
  { id: 2, name: "Trash Can Improvement" },
  { id: 3, name: "Water Conservation Solution" },
  { id: 4, name: "Efficient Plant Watering" },
  { id: 5, name: "Reducing Electricity Waste" },
  { id: 6, name: "Encouraging Eco-Friendly Transportation" },
  { id: 7, name: "Recycling Awareness and Sorting" },
  { id: 8, name: "Trash Can Improvement" },
  { id: 9, name: "Water Conservation Solution" },
  { id: 10, name: "Efficient Plant Watering" },
  { id: 11, name: "Reducing Electricity Waste" },
  { id: 12, name: "Encouraging Eco-Friendly Transportation" }
]

export default function HackathonLottery() {
  const [remainingChallenges, setRemainingChallenges] = useState([...challenges])
  const [selectedChallenge, setSelectedChallenge] = useState<typeof challenges[0] | null>(null)
  const [assignedGroups, setAssignedGroups] = useState<typeof challenges>([])
  const [isSpinning, setIsSpinning] = useState(false)
  const [displayedChallenge, setDisplayedChallenge] = useState<typeof challenges[0] | null>(null)
  
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    audioRef.current = new Audio('/sounds/wheel-spin.mp3')
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        conductLottery()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [remainingChallenges, isSpinning])

  const conductLottery = () => {
    if (remainingChallenges.length === 0 || isSpinning) return

    setIsSpinning(true)
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play()
    }

    const spinDuration = 3000
    const spinInterval = 50
    let spinCount = 0

    const spinAnimation = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * remainingChallenges.length)
      setDisplayedChallenge(remainingChallenges[randomIndex])
      spinCount++
    }, spinInterval)

    setTimeout(() => {
      clearInterval(spinAnimation)
      const randomIndex = Math.floor(Math.random() * remainingChallenges.length)
      const selected = remainingChallenges[randomIndex]
      setSelectedChallenge(selected)
      setDisplayedChallenge(selected)
      setAssignedGroups([...assignedGroups, selected])
      setRemainingChallenges(remainingChallenges.filter(c => c.id !== selected.id))
      setIsSpinning(false)
      if (audioRef.current) {
        audioRef.current.pause()
      }
      new Audio('/sounds/tada.mp3').play()
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6CA32F', '#275D38', '#A4C639']
      })
    }, spinDuration)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-start p-4 pt-8">
      <div className="w-full max-w-2xl mb-8">
        <Image
          src="/logo.jpg"
          alt="Ecological Entrepreneurship Hackathon Logo"
          width={300}
          height={150}
          className="mx-auto mb-8"
        />
        <Card className="border-[#275D38] shadow-lg">
          <CardHeader className="text-center pb-2">
            <h1 className="text-3xl font-bold text-[#3B3B3B] mb-2">
              Challenge Lottery
            </h1>
            <p className="text-[#6CA32F]">
              Remaining Challenges: {remainingChallenges.length}
            </p>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6 min-h-[100px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={displayedChallenge?.id || 'initial'}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white p-6 rounded-lg shadow-sm border border-[#A4C639] w-full"
                >
                  <span className="text-2xl font-semibold text-[#3B3B3B]">
                    {displayedChallenge 
                      ? `Group ${displayedChallenge.id}: ${displayedChallenge.name}`
                      : "Press Space or Click the Button to Start!"}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>
            
            <Button 
              onClick={conductLottery} 
              disabled={remainingChallenges.length === 0 || isSpinning}
              className="w-full text-lg py-6 bg-[#6CA32F] hover:bg-[#275D38] text-white transition-colors"
            >
              {isSpinning ? "Spinning..." : "Draw Challenge"}
            </Button>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4 text-[#3B3B3B]">Assigned Challenges:</h3>
              <div className="space-y-2">
                <AnimatePresence>
                  {assignedGroups.map((group) => (
                    <motion.div
                      key={group.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.5 }}
                      className="bg-white p-4 rounded-lg shadow-sm border border-[#A4C639]"
                    >
                      <span className="font-medium text-[#3B3B3B]">
                        Group {group.id}:
                      </span>{' '}
                      <span className="text-[#6CA32F]">
                        {group.name}
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
