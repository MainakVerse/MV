"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [hasExpanded, setHasExpanded] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  type Click = { id: number; x: number; y: number }
  const [clicks, setClicks] = useState<Click[]>([])
  const [isMousePressed, setIsMousePressed] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Handle loading screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      // Trigger expand animation after loading
      setTimeout(() => {
        setHasExpanded(true)
      }, 100)
    }, 3000) // Reduced loading time for better UX

    return () => clearTimeout(timer)
  }, [])

  // Track mouse position and interactions
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseDown = () => {
      setIsMousePressed(true)
    }

    const handleMouseUp = () => {
      setIsMousePressed(false)
    }

    const handleClick = (e: MouseEvent) => {
      if (!containerRef.current) return
      
      const rect = containerRef.current.getBoundingClientRect()
      const newClick = {
        id: Date.now(),
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
      
      setClicks(prev => [...prev, newClick])
      
      // Remove click after animation
      setTimeout(() => {
        setClicks(prev => prev.filter(click => click.id !== newClick.id))
      }, 2000)
    }

    if (!isLoading) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mousedown", handleMouseDown)
      window.addEventListener("mouseup", handleMouseUp)
      containerRef.current?.addEventListener("click", handleClick)
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mouseup", handleMouseUp)
      containerRef.current?.removeEventListener("click", handleClick)
    }
  }, [isLoading])



  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div 
      ref={containerRef} 
      className="min-h-screen bg-gradient-to-b from-slate-950 via-black to-slate-950 relative overflow-hidden cursor-none"
      style={{
        background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(6,182,212,0.15), transparent 40%), linear-gradient(to bottom, rgb(2 6 23), rgb(0 0 0), rgb(2 6 23))`
      }}
    >
      {/* Custom cursor */}
      <div 
        className="fixed pointer-events-none z-50 mix-blend-difference"
        style={{
          left: mousePosition.x - 10,
          top: mousePosition.y - 10,
          transform: `scale(${isMousePressed ? 1.5 : 1})`,
          transition: 'transform 0.1s ease-out'
        }}
      >
        <div className="w-5 h-5 rounded-full border-2 border-cyan-400 bg-cyan-400/20 animate-pulse"></div>
      </div>

      {/* Click ripple effects */}
      {clicks.map((click) => (
        <div
          key={click.id}
          className="absolute pointer-events-none z-40"
          style={{
            left: click.x,
            top: click.y,
          }}
        >
          <div className="w-4 h-4 -translate-x-2 -translate-y-2 rounded-full bg-cyan-400/60 animate-ripple-expand"></div>
          <div className="w-4 h-4 -translate-x-2 -translate-y-2 rounded-full border-2 border-cyan-400/80 animate-ripple-expand-border"></div>
        </div>
      ))}



      {/* Interactive grid pattern with mouse influence */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.08)_1px,transparent_1px)] bg-[size:60px_60px] animate-grid-move transition-opacity duration-300"
        style={{
          opacity: Math.min(1, (mousePosition.x + mousePosition.y) / 2000),
          transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
        }}
      ></div>
      
      {/* Secondary interactive grid */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(rgba(147,51,234,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.04)_1px,transparent_1px)] bg-[size:120px_120px] animate-grid-move-reverse transition-opacity duration-300"
        style={{
          opacity: Math.min(0.8, (mousePosition.x + mousePosition.y) / 2500),
          transform: `translate(${mousePosition.x * -0.01}px, ${mousePosition.y * -0.01}px)`
        }}
      ></div>

      {/* Interactive floating orbs */}
      <div className="absolute inset-0">
        <div 
          className="floating-orb floating-orb-1 transition-transform duration-500"
          style={{
            transform: `translate(${mousePosition.x * 0.03}px, ${mousePosition.y * 0.02}px) rotate(${mousePosition.x * 0.1}deg)`
          }}
        ></div>
        <div 
          className="floating-orb floating-orb-2 transition-transform duration-500"
          style={{
            transform: `translate(${mousePosition.x * -0.02}px, ${mousePosition.y * 0.03}px) rotate(${mousePosition.y * -0.1}deg)`
          }}
        ></div>
        <div 
          className="floating-orb floating-orb-3 transition-transform duration-500"
          style={{
            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * -0.02}px) rotate(${(mousePosition.x + mousePosition.y) * 0.05}deg)`
          }}
        ></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        {/* Main header with enhanced expand animation */}
        <div className="text-center mb-20 relative">
          <h1
            className={`text-4xl md:text-7xl lg:text-9xl font-black text-white relative transition-all duration-1500 ease-out ${
              hasExpanded ? "scale-100 opacity-100" : "scale-0 opacity-0"
            }`}
            style={{
              transformOrigin: "center center",
              fontFamily: "'Orbitron', 'Arial Black', sans-serif",
              letterSpacing: "0.02em",
            }}
          >
            <span className="bg-gradient-to-r from-cyan-300 via-blue-400 via-purple-400 to-cyan-300 bg-clip-text text-transparent bg-[length:200%_100%] animate-gradient-flow drop-shadow-[0_0_25px_rgba(6,182,212,0.9)] hover:drop-shadow-[0_0_40px_rgba(6,182,212,1)]">
              MAINAKVERSE
            </span>
            
            {/* Enhanced glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-300 via-blue-400 via-purple-400 to-cyan-300 bg-clip-text text-transparent opacity-30 blur-sm animate-gradient-flow"></div>
          </h1>

          {/* Enhanced subtitle with typewriter effect */}
          <div
            className={`mt-6 transition-all duration-1500 ease-out delay-500 ${
              hasExpanded ? "scale-100 opacity-100" : "scale-0 opacity-0"
            }`}
            style={{
              transformOrigin: "center center",
            }}
          >
            <p className="text-xl md:text-3xl lg:text-4xl font-light text-white typewriter-text relative">
              <span className="bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent">
                The Genesis of Curiosity
              </span>
              <span className="typewriter-cursor">|</span>
            </p>
          </div>

          {/* Enhanced particle animation */}
          {hasExpanded && (
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none opacity-80"
              viewBox="0 0 800 200"
              style={{ transform: "scale(1.2)" }}
            >
              <defs>
                <linearGradient id="particleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{stopColor:"#06b6d4", stopOpacity:1}} />
                  <stop offset="50%" style={{stopColor:"#8b5cf6", stopOpacity:1}} />
                  <stop offset="100%" style={{stopColor:"#06b6d4", stopOpacity:1}} />
                </linearGradient>
                <path
                  id="letterPath"
                  d="M50,150 L50,50 L80,50 L110,90 L140,50 L170,50 L170,150 M200,150 L200,50 L270,50 L270,80 L230,80 L230,100 L260,100 L260,130 L200,130 M300,150 L300,50 L330,50 L330,150 M360,150 L360,50 L430,50 L430,150 M460,150 L460,50 L530,50 L530,80 L490,80 L490,100 L520,100 L520,130 L460,130 M560,150 L560,50 L590,50 L620,100 L650,50 L680,50 L680,150 M710,150 L710,50 L780,50 L780,80 L740,80 L740,100 L770,100 L770,130 L710,130"
                  fill="none"
                  stroke="transparent"
                />
              </defs>

              {/* Enhanced particles with different sizes and speeds */}
              <circle r="6" fill="url(#particleGrad)" className="drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">
                <animateMotion dur="5s" repeatCount="indefinite" rotate="auto">
                  <mpath href="#letterPath" />
                </animateMotion>
              </circle>

              <circle r="4" fill="#8b5cf6" opacity="0.8" className="drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]">
                <animateMotion dur="5s" repeatCount="indefinite" rotate="auto" begin="0.2s">
                  <mpath href="#letterPath" />
                </animateMotion>
              </circle>

              <circle r="2" fill="#06b6d4" opacity="0.6">
                <animateMotion dur="5s" repeatCount="indefinite" rotate="auto" begin="0.4s">
                  <mpath href="#letterPath" />
                </animateMotion>
              </circle>
            </svg>
          )}
        </div>

        {/* Enhanced explore button with improved glassmorphism */}
        <div
          className={`transition-all duration-1500 ease-out delay-1000 ${
            hasExpanded ? "scale-100 opacity-100 translate-y-0" : "scale-0 opacity-0 translate-y-10"
          }`}
        >
          <button className="group relative px-12 py-5 text-xl font-bold text-white rounded-2xl backdrop-blur-lg bg-gradient-to-r from-white/10 to-white/5 border border-white/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.4)] hover:shadow-[0_0_50px_rgba(6,182,212,0.8)] transition-all duration-500 hover:scale-110 active:scale-95 overflow-hidden">
          <Link href="/homepage"><span className="relative z-20 tracking-wider">EXPLORE</span></Link>
           
            
            {/* Button background effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-purple-400/20 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-all duration-500 bg-[length:200%_100%] animate-gradient-flow"></div>
            
            {/* Button border glow */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 opacity-0 group-hover:opacity-30 blur-sm transition-all duration-500 bg-[length:200%_100%] animate-gradient-flow"></div>
            
            {/* Ripple effect */}
            <div className="absolute inset-0 rounded-2xl bg-white/10 scale-0 group-active:scale-100 transition-transform duration-300 ease-out"></div>
          </button>
        </div>

        {/* Additional UI enhancement - floating navigation hints */}
        <div
          className={`absolute bottom-10 left-1/2 transform -translate-x-1/2 transition-all duration-2000 ease-out delay-1500 ${
            hasExpanded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="flex items-center space-x-4 text-white/60 text-sm animate-pulse">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
            <span>Move your mouse to interact with the stars</span>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
          </div>
        </div>
      </div>

     
    </div>
  )
}

function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-black to-slate-950 flex items-center justify-center z-50">
      <div className="relative">
        {/* Enhanced 3D Cube */}
        <div className="cube-container perspective-1000">
          <div className="cube-3d relative w-20 h-20 mx-auto preserve-3d animate-cube-spin">
            <div className="face-3d front-3d absolute w-20 h-20 bg-gradient-to-br from-cyan-400/30 to-blue-500/30 border border-cyan-400/50 backdrop-blur-sm"></div>
            <div className="face-3d back-3d absolute w-20 h-20 bg-gradient-to-br from-purple-400/30 to-pink-500/30 border border-purple-400/50 backdrop-blur-sm"></div>
            <div className="face-3d right-3d absolute w-20 h-20 bg-gradient-to-br from-blue-400/30 to-cyan-500/30 border border-blue-400/50 backdrop-blur-sm"></div>
            <div className="face-3d left-3d absolute w-20 h-20 bg-gradient-to-br from-pink-400/30 to-purple-500/30 border border-pink-400/50 backdrop-blur-sm"></div>
            <div className="face-3d top-3d absolute w-20 h-20 bg-gradient-to-br from-cyan-500/30 to-purple-500/30 border border-cyan-500/50 backdrop-blur-sm"></div>
            <div className="face-3d bottom-3d absolute w-20 h-20 bg-gradient-to-br from-purple-500/30 to-cyan-500/30 border border-purple-500/50 backdrop-blur-sm"></div>
          </div>
        </div>

        {/* Enhanced loading text */}
        <div className="text-center mt-12">
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 animate-gradient-flow bg-[length:200%_100%] mb-2">
            INITIALIZING MAINAKVERSE
          </h2>
          <p className="text-white/60 text-sm tracking-wider mb-6">Preparing your cosmic journey...</p>
          
          {/* Enhanced loading dots */}
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce shadow-[0_0_10px_rgba(147,51,234,0.8)]" style={{ animationDelay: "0.1s" }}></div>
            <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce shadow-[0_0_10px_rgba(236,72,153,0.8)]" style={{ animationDelay: "0.2s" }}></div>
          </div>
          
          {/* Loading progress bar */}
          <div className="w-64 h-1 bg-white/10 rounded-full mx-auto mt-6 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-loading-bar"></div>
          </div>
        </div>
      </div>

    
    </div>
  )
}