import { Metadata } from "next"

import HeroSlider from "@modules/home/components/hero-slider"
import FeaturedProducts from "@modules/home/components/featured-products-section"
import NewArrivals from "@modules/home/components/new-arrivals"
import TrendingProducts from "@modules/home/components/trending-products"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "SARWA - Wear Your Story",
  description:
    "Discover handcrafted pieces that celebrate your unique journey. Premium essentials designed for the modern wardrobe.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params

  const region = await getRegion(countryCode)

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  if (!collections || !region) {
    return null
  }

  return (
    <>
      <HeroSlider />
      <FeaturedProducts collections={collections} region={region} />
      <NewArrivals region={region} />
      <TrendingProducts region={region} />
    </>
  )
}
