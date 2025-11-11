import React, { Suspense } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import Breadcrumbs from "@modules/products/components/breadcrumbs"
import FadeInView from "@modules/common/components/fade-in-view"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

import ProductActionsWrapper from "./product-actions-wrapper"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  images: HttpTypes.StoreProductImage[]
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
  images,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  const getCategoryPath = () => {
    if (!product.categories || product.categories.length === 0) {
      return undefined
    }

    const category = product.categories[0]
    const path: Array<{ name: string; handle: string }> = []

    if (category.parent_category) {
      path.push({
        name: category.parent_category.name,
        handle: category.parent_category.handle,
      })
    }

    path.push({
      name: category.name,
      handle: category.handle,
    })

    return path
  }

  const categoryPath = getCategoryPath()

  return (
    <>
      {/* Main Product Section */}
      <div
        className="content-container flex flex-col lg:flex-row py-6 relative"
        data-testid="product-container"
      >
        {/* Images with Breadcrumbs */}
        <div className="w-full lg:w-1/2 lg:sticky lg:top-0 lg:h-full flex flex-col p-4 overflow-hidden animate-fadeIn">
          <Breadcrumbs product={product} categoryPath={categoryPath} />
          <ImageGallery images={images} />
        </div>

        {/*Content */}
        <div className="w-full lg:w-1/2 flex flex-col gap-y-8 p-6 lg:p-8 overflow-y-auto lg:h-full animate-fadeInDelay">
          <ProductInfo product={product} />

          <ProductOnboardingCta />

          <Suspense
            fallback={
              <ProductActions
                disabled={true}
                product={product}
                region={region}
              />
            }
          >
            <ProductActionsWrapper id={product.id} region={region} />
          </Suspense>
        </div>
      </div>

      {/* Product Tabs */}
      <div className="content-container my-6">
        <FadeInView>
          <ProductTabs product={product} />
        </FadeInView>
      </div>

      {/* Related Products */}
      <div
        className="content-container my-16 small:my-32"
        data-testid="related-products-container"
      >
        <FadeInView>
          <Suspense fallback={<SkeletonRelatedProducts />}>
            <RelatedProducts product={product} countryCode={countryCode} />
          </Suspense>
        </FadeInView>
      </div>
    </>
  )
}

export default ProductTemplate
