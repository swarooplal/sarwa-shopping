import { Suspense } from "react"

import { listCategories } from "@lib/data/categories"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import Image from "next/image"

export default async function Nav() {
  const categories = await listCategories()

  const mainCategories = categories?.filter((c) => !c.parent_category).slice(0, 5) || []

  return (
    <div className="sticky top-0 inset-x-0 z-50">
      <header className="relative h-16 mx-auto bg-white/80 backdrop-blur-md border-b border-cream-200">
        <nav className="content-container flex items-center justify-between w-full h-full">
          {/* Logo */}
          <div className="flex items-center h-full">
            <LocalizedClientLink href="/" className="flex items-center gap-3">
              <div className="relative h-10 w-10">
                <Image
                  src="/sarwa-logo.png"
                  alt="SARWA"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-xl font-semibold tracking-wide text-sarwa-800 hidden small:block">
                SARWA
              </span>
            </LocalizedClientLink>
          </div>

          {/* Categories - Center */}
          <div className="hidden medium:flex items-center gap-8 h-full">
            <LocalizedClientLink
              href="/"
              className="text-sm font-medium text-gray-900 hover:text-sarwa-600 transition-colors"
            >
              Home
            </LocalizedClientLink>
            {mainCategories.map((category) => (
              <LocalizedClientLink
                key={category.id}
                href={`/categories/${category.handle}`}
                className="text-sm font-medium text-gray-900 hover:text-sarwa-600 transition-colors"
              >
                {category.name}
              </LocalizedClientLink>
            ))}
            <LocalizedClientLink
              href="/store"
              className="text-sm font-medium text-gray-900 hover:text-sarwa-600 transition-colors"
            >
              Shop All
            </LocalizedClientLink>
          </div>

          {/* Right side - Account & Cart */}
          <div className="flex items-center gap-6 h-full">
            <div className="hidden small:flex items-center gap-6 h-full">
              <LocalizedClientLink
                className="text-sm font-medium text-gray-900 hover:text-sarwa-600 transition-colors"
                href="/account"
              >
                Account
              </LocalizedClientLink>
            </div>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="text-sm font-medium text-gray-900 hover:text-sarwa-600 transition-colors"
                  href="/cart"
                >
                  Cart (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>

      {/* Mobile bottom nav */}
      <div className="medium:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-cream-200 z-50">
        <nav className="flex items-center justify-around h-16">
          <LocalizedClientLink href="/" className="flex flex-col items-center gap-1">
            <svg className="w-5 h-5 text-sarwa-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-[10px] font-medium text-gray-900">Home</span>
          </LocalizedClientLink>
          <LocalizedClientLink href="/store" className="flex flex-col items-center gap-1">
            <svg className="w-5 h-5 text-sarwa-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="text-[10px] font-medium text-gray-900">Shop</span>
          </LocalizedClientLink>
          <LocalizedClientLink href="/cart" className="flex flex-col items-center gap-1">
            <svg className="w-5 h-5 text-sarwa-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="text-[10px] font-medium text-gray-900">Cart</span>
          </LocalizedClientLink>
          <LocalizedClientLink href="/account" className="flex flex-col items-center gap-1">
            <svg className="w-5 h-5 text-sarwa-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-[10px] font-medium text-gray-900">Account</span>
          </LocalizedClientLink>
        </nav>
      </div>
    </div>
  )
}
