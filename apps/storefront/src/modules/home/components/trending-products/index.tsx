import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import SectionHeader from "@modules/common/components/section-header"
import ProductCard from "@modules/home/components/product-card"

interface TrendingProductsProps {
  region: HttpTypes.StoreRegion
}

export default async function TrendingProducts({ region }: TrendingProductsProps) {
  const {
    response: { products },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      limit: 4,
      order: "-created_at",
      fields: "*variants.calculated_price",
    },
  })

  if (!products?.length) return null

  return (
    <section className="content-container py-16 small:py-24">
      <SectionHeader
        title="Trending Now"
        subtitle="Our most popular products this week"
        href="/store"
      />
      <div className="grid grid-cols-2 small:grid-cols-4 gap-4 small:gap-6 medium:gap-8">
        {products.slice(0, 4).map((product) => (
          <div key={product.id} className="relative">
            <ProductCard product={product} region={region} />
            <span className="absolute top-3 right-3 flex items-center gap-1 text-[10px] text-sarwa-600 font-semibold uppercase tracking-wide bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                  clipRule="evenodd"
                />
              </svg>
              Hot
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
