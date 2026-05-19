import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import SectionHeader from "@modules/common/components/section-header"
import ProductCard from "@modules/home/components/product-card"

interface NewArrivalsProps {
  region: HttpTypes.StoreRegion
}

export default async function NewArrivals({ region }: NewArrivalsProps) {
  const {
    response: { products },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      limit: 8,
      order: "created_at",
      fields: "*variants.calculated_price",
    },
  })

  if (!products?.length) return null

  return (
    <section className="bg-cream-100/50">
      <div className="content-container py-16 small:py-24">
        <SectionHeader
          title="New Arrivals"
          subtitle="The latest additions to our collection"
          href="/store"
        />
        <div className="grid grid-cols-2 small:grid-cols-4 gap-4 small:gap-6 medium:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} region={region} />
          ))}
        </div>
      </div>
    </section>
  )
}
