import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import SectionHeader from "@modules/common/components/section-header"
import ProductCard from "@modules/home/components/product-card"

interface FeaturedProductsProps {
  collections: HttpTypes.StoreCollection[]
  region: HttpTypes.StoreRegion
}

export default async function FeaturedProducts({
  collections,
  region,
}: FeaturedProductsProps) {
  if (!collections.length) return null

  const featuredCollection = collections[0]

  const {
    response: { products },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      collection_id: featuredCollection.id,
      limit: 4,
      fields: "*variants.calculated_price",
    },
  })

  if (!products?.length) return null

  return (
    <section className="content-container py-16 small:py-24">
      <SectionHeader
        title="Featured Collection"
        subtitle={featuredCollection.title}
        href={`/collections/${featuredCollection.handle}`}
      />
      <div className="grid grid-cols-2 small:grid-cols-4 gap-4 small:gap-6 medium:gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} region={region} />
        ))}
      </div>
    </section>
  )
}
