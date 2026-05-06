'use client'

import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode'
import { Zap, ZapOff, Camera } from 'lucide-react'

interface QRCodeScannerProps {
  onScanSuccess: (decodedText: string) => void
  onScanError?: (error: string) => void
}

export function QRCodeScanner({ onScanSuccess, onScanError }: QRCodeScannerProps) {
  const [isCameraReady, setIsCameraReady] = useState(false)
  const [hasFlash, setHasFlash] = useState(false)
  const [isFlashOn, setIsFlashOn] = useState(false)
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null)
  const containerId = 'qr-reader-container'

  useEffect(() => {
    const html5QrCode = new Html5Qrcode(containerId)
    html5QrCodeRef.current = html5QrCode

    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      formatsToSupport: [
        Html5QrcodeSupportedFormats.QR_CODE,
        Html5QrcodeSupportedFormats.CODE_128,
        Html5QrcodeSupportedFormats.EAN_13
      ]
    }

    html5QrCode.start(
      { facingMode: "environment" },
      config,
      (decodedText) => {
        onScanSuccess(decodedText)
        // Try to vibrate if available
        if (navigator.vibrate) navigator.vibrate(100)
      },
      (errorMessage) => {
        // onScanError is called for every frame without a code, usually we don't want to log it
      }
    ).then(() => {
      setIsCameraReady(true)
      // Check for flash support
      const state = html5QrCode.getState()
      if (state === 2) {
        const cameraCapabilities = (html5QrCode as any).getCameraCapabilities()
        if (cameraCapabilities?.torchFeature()?.isSupported()) {
          setHasFlash(true)
        }
      }
    }).catch(err => {
      console.error("Unable to start scanning", err)
      if (onScanError) onScanError(err)
    })

    return () => {
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        html5QrCodeRef.current.stop().catch(err => console.error("Error stopping scanner", err))
      }
    }
  }, [onScanSuccess, onScanError])

  const toggleFlash = async () => {
    if (!html5QrCodeRef.current || !hasFlash) return
    
    try {
      const newState = !isFlashOn
      await html5QrCodeRef.current.applyVideoConstraints({
        //@ts-ignore
        advanced: [{ torch: newState }]
      })
      setIsFlashOn(newState)
    } catch (err) {
      console.error("Error toggling flash", err)
    }
  }

  return (
    <div className="relative w-full aspect-square md:aspect-video rounded-3xl overflow-hidden bg-[#020617] group">
      {/* Scanner container */}
      <div id={containerId} className="w-full h-full object-cover" />

      {/* Loading overlay */}
      {!isCameraReady && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 z-30">
          <Camera className="w-8 h-8 text-cyan-500 animate-pulse mb-3" />
          <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">Initialisation caméra...</p>
        </div>
      )}

      {/* Premium Overlay */}
      <div className="absolute inset-0 pointer-events-none z-20">
        {/* Scanning line */}
        {isCameraReady && (
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_rgba(34,211,238,1)] animate-scan-line" />
        )}

        {/* Framing box overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[250px] h-[250px] relative">
                {/* 4 corners with glow */}
                <div className="absolute -top-1 -left-1 w-10 h-10 border-t-4 border-l-4 border-cyan-400 rounded-tl-2xl shadow-[-5px_-5px_15px_rgba(34,211,238,0.4)]" />
                <div className="absolute -top-1 -right-1 w-10 h-10 border-t-4 border-r-4 border-cyan-400 rounded-tr-2xl shadow-[5px_-5px_15px_rgba(34,211,238,0.4)]" />
                <div className="absolute -bottom-1 -left-1 w-10 h-10 border-b-4 border-l-4 border-cyan-400 rounded-bl-2xl shadow-[-5px_5px_15px_rgba(34,211,238,0.4)]" />
                <div className="absolute -bottom-1 -right-1 w-10 h-10 border-b-4 border-r-4 border-cyan-400 rounded-br-2xl shadow-[5px_5px_15px_rgba(34,211,238,0.4)]" />
            </div>
        </div>
        
        {/* Vignette effect */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.6)_100%)]" />
      </div>

      {/* Controls */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 z-40 px-6">
        {hasFlash && (
          <button
            onClick={toggleFlash}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-xl transition-all duration-300 border ${
              isFlashOn 
              ? 'bg-cyan-500 text-white border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.4)]' 
              : 'bg-slate-900/60 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            {isFlashOn ? <Zap className="w-5 h-5 fill-current" /> : <ZapOff className="w-5 h-5" />}
          </button>
        )}
      </div>

      <style jsx global>{`
        @keyframes scan-line {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(250px); opacity: 0; }
        }
        /* Fixing the animation for different aspect ratios */
        .animate-scan-line {
          animation: scan-line 3s ease-in-out infinite;
          height: 3px;
          background: linear-gradient(90deg, transparent, #22d3ee, transparent);
        }
        #qr-reader-container video {
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
            border-radius: 1.5rem !important;
        }
      `}</style>
    </div>
  )
}
