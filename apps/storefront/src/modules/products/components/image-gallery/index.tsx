"use client"

import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import { useState, useRef, useCallback } from "react"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

const ZoomInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
    <line x1="11" y1="8" x2="11" y2="14" />
    <line x1="8" y1="11" x2="14" y2="11" />
  </svg>
)

const ZoomOutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
    <line x1="8" y1="11" x2="14" y2="11" />
  </svg>
)

const MinimizeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 14 10 14 10 20" />
    <polyline points="20 10 14 10 14 4" />
    <line x1="14" y1="10" x2="21" y2="3" />
    <line x1="3" y1="21" x2="10" y2="14" />
  </svg>
)

const ChevronLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
)

const ChevronRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [isZoomed, setIsZoomed] = useState(false)
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const safeImages = images?.filter((img) => img.url) || []
  const displayImages = safeImages.length > 0 ? safeImages : []

  const currentImage = displayImages[currentIndex]

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index)
    setZoomLevel(1)
    setIsZoomed(false)
    setImagePosition({ x: 0, y: 0 })
  }, [])

  const nextSlide = useCallback(() => {
    goToSlide((currentIndex + 1) % displayImages.length)
  }, [currentIndex, displayImages.length, goToSlide])

  const prevSlide = useCallback(() => {
    goToSlide((currentIndex - 1 + displayImages.length) % displayImages.length)
  }, [currentIndex, displayImages.length, goToSlide])

  const zoomIn = useCallback(() => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 4))
    setIsZoomed(true)
  }, [])

  const zoomOut = useCallback(() => {
    setZoomLevel((prev) => {
      const newZoom = Math.max(prev - 0.5, 1)
      if (newZoom === 1) {
        setIsZoomed(false)
        setImagePosition({ x: 0, y: 0 })
      }
      return newZoom
    })
  }, [])

  const resetZoom = useCallback(() => {
    setZoomLevel(1)
    setIsZoomed(false)
    setImagePosition({ x: 0, y: 0 })
  }, [])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - imagePosition.x, y: e.clientY - imagePosition.y })
    }
  }, [zoomLevel, imagePosition])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1) {
      setImagePosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
  }, [isDragging, dragStart, zoomLevel])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    if (e.deltaY < 0) {
      zoomIn()
    } else {
      zoomOut()
    }
  }, [zoomIn, zoomOut])

  if (displayImages.length === 0) {
    return (
      <div className="flex items-center justify-center w-full aspect-[3/4] bg-cream-50 rounded-xl">
        <span className="text-gray-400 text-sm">No images available</span>
      </div>
    )
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Main Image Container */}
      <div className="relative w-full aspect-[3/4] bg-cream-50 rounded-xl overflow-hidden mb-4 group">
        {/* Zoom Controls */}
        <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={zoomIn}
            className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
            title="Zoom in"
          >
            <ZoomInIcon />
          </button>
          <button
            onClick={zoomOut}
            className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
            title="Zoom out"
          >
            <ZoomOutIcon />
          </button>
          {isZoomed && (
            <button
              onClick={resetZoom}
              className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
              title="Reset zoom"
            >
              <MinimizeIcon />
            </button>
          )}
        </div>

        {/* Navigation Arrows */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all opacity-0 group-hover:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeftIcon />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all opacity-0 group-hover:opacity-100"
              aria-label="Next image"
            >
              <ChevronRightIcon />
            </button>
          </>
        )}

        {/* Image Display */}
        <div
          ref={containerRef}
          className="w-full h-full cursor-zoom-in relative"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onWheel={handleWheel}
          onClick={() => {
            if (zoomLevel === 1) {
              zoomIn()
            }
          }}
        >
          {currentImage && (
            <div
              className="w-full h-full transition-transform duration-300 ease-out"
              style={{
                transform: `scale(${zoomLevel}) translate(${imagePosition.x / zoomLevel}px, ${imagePosition.y / zoomLevel}px)`,
                transformOrigin: "center center",
              }}
            >
              <Image
                src={currentImage.url!}
                alt={`Product image ${currentIndex + 1}`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                priority={currentIndex === 0}
                draggable={false}
              />
            </div>
          )}
        </div>

        {/* Image Counter */}
        {displayImages.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 px-2.5 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white text-xs font-medium">
            {currentIndex + 1} / {displayImages.length}
          </div>
        )}
      </div>

      {/* Thumbnail Slider */}
      {displayImages.length > 1 && (
        <div className="flex gap-2 justify-center overflow-x-auto no-scrollbar pb-2">
          {displayImages.map((image, index) => (
            <button
              key={image.id}
              onClick={() => goToSlide(index)}
              className={`relative flex-shrink-0 w-16 h-20 rounded-lg overflow-hidden transition-all duration-200 ${
                index === currentIndex
                  ? "ring-2 ring-sarwa-600 ring-offset-2"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={image.url!}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Zoom Hint */}
      {!isZoomed && displayImages.length > 0 && (
        <p className="text-xs text-gray-400 text-center mt-3">
          Click image to zoom • Scroll to zoom in/out • Drag to pan when zoomed
        </p>
      )}
    </div>
  )
}

export default ImageGallery
