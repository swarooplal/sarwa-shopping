"use client"

import { useState, useEffect, useCallback } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ChevronLeft, ChevronRight } from "@medusajs/icons"

const slides = [
  {
    id: 1,
    title: "Wear Your Story",
    subtitle: "Handcrafted Kerala sarees that celebrate tradition and elegance",
    buttonText: "Explore Collection",
    buttonLink: "/store",
    bgGradient: "from-cream-100 via-cream-50 to-white",
    accentColor: "text-sarwa-700",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
  },
  {
    id: 2,
    title: "Timeless Elegance",
    subtitle: "Premium silk sarees woven with heritage craftsmanship",
    buttonText: "Shop Now",
    buttonLink: "/store",
    bgGradient: "from-sarwa-50 via-cream-50 to-white",
    accentColor: "text-sarwa-600",
    image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80",
  },
  {
    id: 3,
    title: "Limited Edition",
    subtitle: "Exclusive Kasavu and designer sarees for special occasions",
    buttonText: "View Collection",
    buttonLink: "/store",
    bgGradient: "from-cream-200 via-cream-100 to-white",
    accentColor: "text-sarwa-800",
    image: "https://images.unsplash.com/photo-1609357606050-14e882f75052?w=800&q=80",
  },
]

const SLIDE_INTERVAL = 6000

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const goToSlide = useCallback((index: number) => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentSlide(index)
      setIsTransitioning(false)
    }, 400)
  }, [])

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % slides.length)
  }, [currentSlide, goToSlide])

  const prevSlide = useCallback(() => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length)
  }, [currentSlide, goToSlide])

  useEffect(() => {
    const timer = setInterval(nextSlide, SLIDE_INTERVAL)
    return () => clearInterval(timer)
  }, [nextSlide])

  const slide = slides[currentSlide]

  return (
    <div className="relative h-[85vh] small:h-[90vh] w-full overflow-hidden">
      {/* Background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${slide.bgGradient} transition-opacity duration-700 ${
          isTransitioning ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="w-full h-full" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-sarwa-100/30 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-cream-200/40 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-6 small:px-16 medium:px-24">
        <div className="max-w-2xl">
          <div
            className={`transition-all duration-700 ${
              isTransitioning
                ? "opacity-0 translate-y-12"
                : "opacity-100 translate-y-0"
            }`}
          >
            {/* Tag */}
            <span className={`inline-block px-4 py-1.5 mb-8 text-xs font-medium tracking-widest uppercase ${slide.accentColor} bg-white/60 rounded-full backdrop-blur-sm border border-sarwa-200/50`}>
              New Collection
            </span>

            {/* Title */}
            <h1 className="text-5xl small:text-6xl medium:text-7xl font-light text-sarwa-900 mb-6 leading-[1.1] tracking-tight">
              {slide.title}
            </h1>

            {/* Subtitle */}
            <p className="text-base small:text-lg text-gray-500 mb-10 max-w-md leading-relaxed">
              {slide.subtitle}
            </p>

            {/* CTA Button */}
            <LocalizedClientLink href={slide.buttonLink}>
              <button className="group px-8 py-3.5 bg-sarwa-600 text-white font-medium rounded-full hover:bg-sarwa-700 transition-all duration-300 text-sm tracking-wide">
                {slide.buttonText}
                <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
              </button>
            </LocalizedClientLink>
          </div>
        </div>
      </div>

      {/* Product image - right side */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[45%] h-[70%] hidden small:block">
        <div
          className={`w-full h-full transition-all duration-700 ${
            isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
          }`}
        >
          <img
            src={slide.image}
            alt=""
            className="w-full h-full object-contain drop-shadow-2xl"
          />
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 small:left-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/60 backdrop-blur-sm text-sarwa-700 hover:bg-white/80 transition-all duration-200 shadow-sm"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 small:right-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/60 backdrop-blur-sm text-sarwa-700 hover:bg-white/80 transition-all duration-200 shadow-sm"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              index === currentSlide
                ? "w-10 bg-sarwa-600"
                : "w-1.5 bg-sarwa-300 hover:bg-sarwa-400"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cream-50 to-transparent" />
    </div>
  )
}
