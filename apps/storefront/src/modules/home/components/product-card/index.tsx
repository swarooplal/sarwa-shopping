"use client"

import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { useState } from "react"
import { addToCart } from "@lib/data/cart"

interface ProductCardProps {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
}

export default function ProductCard({ product, region }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const { cheapestPrice } = getProductPrice({ product })

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!product.variants?.length) return

    setIsAdding(true)

    try {
      await addToCart({
        variantId: product.variants[0].id,
        quantity: 1,
        countryCode: region.countries?.[0]?.iso_2 || "us",
      })
      setAddedToCart(true)
      setTimeout(() => setAddedToCart(false), 2000)
    } catch (error) {
      console.error("Failed to add to cart:", error)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className="group block"
    >
      <div className="relative overflow-hidden rounded-xl bg-cream-50 mb-4 product-card-hover">
        <div className="aspect-[3/4] overflow-hidden">
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="full"
          />
        </div>

        {/* Hover overlay with Add to Cart */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
          <button
            onClick={handleAddToCart}
            disabled={isAdding || addedToCart}
            className={`px-5 py-2.5 text-sm font-medium rounded-full transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 ${
              addedToCart
                ? "bg-green-600 text-white"
                : "bg-white text-sarwa-800 hover:bg-sarwa-600 hover:text-white shadow-lg"
            }`}
          >
            {isAdding ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Adding...
              </span>
            ) : addedToCart ? (
              "✓ Added"
            ) : (
              "Add to Cart"
            )}
          </button>
        </div>

        {/* Quick view badge */}
        {product.tags?.length ? (
          <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-semibold tracking-wide uppercase bg-sarwa-600 text-white rounded-full">
            {product.tags[0].value}
          </span>
        ) : (
          <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-semibold tracking-wide uppercase bg-white/80 backdrop-blur-sm text-sarwa-700 rounded-full">
            New
          </span>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-900 group-hover:text-sarwa-600 transition-colors truncate">
          {product.title}
        </h3>
        {product.description && (
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}
        {cheapestPrice && (
          <div className="pt-1">
            <span className="text-sm font-semibold text-sarwa-800">
              {cheapestPrice.calculated_price_number}{" "}
              <span className="text-xs font-normal text-gray-500">
                {cheapestPrice.calculated_price?.currency_code?.toUpperCase()}
              </span>
            </span>
          </div>
        )}
      </div>
    </LocalizedClientLink>
  )
}
