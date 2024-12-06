'use client'

import React, { useRef, useEffect } from 'react'

interface NoisyBackgroundProps {
  opacity?: number
  fps?: number
}

export default function NoisyBackground({ opacity = 0.05, fps = 30 }: NoisyBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let timeoutId: number | NodeJS.Timeout
    let animationFrameId: number

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const createNoise = () => {
      const imageData = ctx.createImageData(canvas.width, canvas.height)
      const data = imageData.data

      for (let i = 0; i < data.length; i += 4) {
        const value = Math.floor(Math.random() * 256)
        data[i] = value
        data[i + 1] = value
        data[i + 2] = value
        data[i + 3] = 255 * opacity
      }

      ctx.putImageData(imageData, 0, 0)
    }

    const animate = () => {
      createNoise()
      timeoutId = setTimeout(() => {
        animationFrameId = requestAnimationFrame(animate)
      }, 1000 / fps)
    }

    resizeCanvas()
    animate()

    window.addEventListener('resize', resizeCanvas)

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [opacity, fps])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 10 }}
    />
  )
}
