"use client"

import Back from "@modules/common/icons/back"
import FastDelivery from "@modules/common/icons/fast-delivery"
import Refresh from "@modules/common/icons/refresh"
import { HttpTypes } from "@medusajs/types"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  return (
    <div className="w-full flex flex-col gap-y-8">
      {/* Product Information Section */}
      <div>
        <h2 className="text-2xl font-semibold text-ui-fg-base mb-4">
          Product Information
        </h2>
        <div className="bg-white border border-ui-border-base rounded-lg p-6">
          <ProductInfoTab product={product} />
        </div>
      </div>

      {/* Shipping & Returns Section */}
      <div>
        <h2 className="text-2xl font-semibold text-ui-fg-base mb-4">
          Shipping & Returns
        </h2>
        <div className="bg-white border border-ui-border-base rounded-lg p-6">
          <ShippingInfoTab />
        </div>
      </div>
    </div>
  )
}

const ProductInfoTab = ({ product }: ProductTabsProps) => {
  return (
    <div className="text-small-regular">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <div className="flex flex-col gap-y-4">
          <div>
            <span className="font-semibold text-ui-fg-base">Material</span>
            <p className="text-ui-fg-subtle mt-1">
              {product.material ? product.material : "-"}
            </p>
          </div>
          <div>
            <span className="font-semibold text-ui-fg-base">
              Country of origin
            </span>
            <p className="text-ui-fg-subtle mt-1">
              {product.origin_country ? product.origin_country : "-"}
            </p>
          </div>
          <div>
            <span className="font-semibold text-ui-fg-base">Type</span>
            <p className="text-ui-fg-subtle mt-1">
              {product.type ? product.type.value : "-"}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-y-4">
          <div>
            <span className="font-semibold text-ui-fg-base">Weight</span>
            <p className="text-ui-fg-subtle mt-1">
              {product.weight ? `${product.weight} g` : "-"}
            </p>
          </div>
          <div>
            <span className="font-semibold text-ui-fg-base">Dimensions</span>
            <p className="text-ui-fg-subtle mt-1">
              {product.length && product.width && product.height
                ? `${product.length}L x ${product.width}W x ${product.height}H`
                : "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const ShippingInfoTab = () => {
  return (
    <div className="text-small-regular w-full">
      <div className="grid grid-cols-1 gap-y-6 w-full">
        <div className="flex items-start gap-x-4 w-full">
          <div className="flex-shrink-0 mt-1">
            <FastDelivery />
          </div>
          <div className="flex-1">
            <span className="font-semibold text-ui-fg-base block mb-2">
              Fast delivery
            </span>
            <p className="text-ui-fg-subtle">
              Your package will arrive in 3-5 business days at your pick up
              location or in the comfort of your home.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-4 w-full">
          <div className="flex-shrink-0 mt-1">
            <Refresh />
          </div>
          <div className="flex-1">
            <span className="font-semibold text-ui-fg-base block mb-2">
              Simple exchanges
            </span>
            <p className="text-ui-fg-subtle">
              Is the fit not quite right? No worries - we&apos;ll exchange your
              product for a new one.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-4 w-full">
          <div className="flex-shrink-0 mt-1">
            <Back />
          </div>
          <div className="flex-1">
            <span className="font-semibold text-ui-fg-base block mb-2">
              Easy returns
            </span>
            <p className="text-ui-fg-subtle">
              Just return your product and we&apos;ll refund your money. No
              questions asked – we&apos;ll do our best to make sure your return
              is hassle-free.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductTabs
