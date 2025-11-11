"use client"

import { addToCart } from "@lib/data/cart"
import { useIntersection } from "@lib/hooks/use-in-view"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import { isEqual } from "lodash"
import { useParams, usePathname, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import ProductPrice from "../product-price"
import MobileActions from "./mobile-actions"
import { useRouter } from "next/navigation"
import { ShoppingCart, Plus, Minus } from "lucide-react"

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
}

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value
    return acc
  }, {})
}

export default function ProductActions({
  product,
  disabled,
}: ProductActionsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [isAdding, setIsAdding] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [isInitialized, setIsInitialized] = useState(false)
  const countryCode = useParams().countryCode as string

  // If there is only 1 variant, preselect the options
  // Also preselect the first value for each option (like color)
  useEffect(() => {
    if (product.variants?.length === 1) {
      const variantOptions = optionsAsKeymap(product.variants[0].options)
      setOptions(variantOptions ?? {})
      setIsInitialized(true)
    } else if (product.options && product.options.length > 0) {
      // Preselect first value for each option
      const defaultOptions: Record<string, string> = {}
      product.options.forEach((option) => {
        if (option.values && option.values.length > 0) {
          defaultOptions[option.id] = option.values[0].value
        }
      })
      setOptions(defaultOptions)
      setIsInitialized(true)
    }
  }, [product.id]) // Only depend on product.id to avoid reference changes

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return
    }

    return product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  // update the options when a variant is selected
  const setOptionValue = (optionId: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }))
  }

  //check if the selected options produce a valid variant
  const isValidVariant = useMemo(() => {
    return product.variants?.some((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    const value = isValidVariant ? selectedVariant?.id : null

    if (params.get("v_id") === value) {
      return
    }

    if (value) {
      params.set("v_id", value)
    } else {
      params.delete("v_id")
    }

    router.replace(pathname + "?" + params.toString())
  }, [selectedVariant, isValidVariant])

  // check if the selected variant is in stock
  const inStock = useMemo(() => {
    // If we don't manage inventory, we can always add to cart
    if (selectedVariant && !selectedVariant.manage_inventory) {
      return true
    }

    // If we allow back orders on the variant, we can add to cart
    if (selectedVariant?.allow_backorder) {
      return true
    }

    // If there is inventory available, we can add to cart
    if (
      selectedVariant?.manage_inventory &&
      (selectedVariant?.inventory_quantity || 0) > 0
    ) {
      return true
    }

    // Otherwise, we can't add to cart
    return false
  }, [selectedVariant])

  const actionsRef = useRef<HTMLDivElement>(null)

  const inView = useIntersection(actionsRef, "0px")

  // Check if color option is selected
  const hasColorOption = useMemo(() => {
    const colorOption = product.options?.find(
      (opt) => opt.title?.toLowerCase() === "color"
    )
    return colorOption ? options[colorOption.id] : true // if no color option exists, return true
  }, [product.options, options])

  // add the selected variant to the cart
  const handleAddToCart = async () => {
    // Check if color is selected
    if (!hasColorOption) {
      alert("Please select a color before adding to cart")
      return
    }

    if (!selectedVariant?.id) return null

    setIsAdding(true)

    await addToCart({
      variantId: selectedVariant.id,
      quantity: quantity,
      countryCode,
    })

    setIsAdding(false)
  }

  // Quantity handlers
  const incrementQuantity = () => {
    setQuantity((prev) => Math.min(prev + 1, 99))
  }

  const decrementQuantity = () => {
    setQuantity((prev) => Math.max(prev - 1, 1))
  }

  return (
    <>
      <div className="flex flex-col gap-y-8" ref={actionsRef}>
        {/* 1. Product Price First */}
        <ProductPrice product={product} variant={selectedVariant} />

        {/* 2. Options Second */}
        {(product.variants?.length ?? 0) > 1 && (
          <div className="flex flex-col gap-y-4">
            {(product.options || []).map((option) => {
              const isColorOption = option.title?.toLowerCase() === "color"

              return (
                <div key={option.id}>
                  <label className="block text-sm font-medium text-ui-fg-base mb-2">
                    {option.title}
                  </label>

                  {isColorOption ? (
                    // Dropdown for Color
                    <select
                      value={options[option.id] || ""}
                      onChange={(e) =>
                        setOptionValue(option.id, e.target.value)
                      }
                      disabled={!!disabled || isAdding}
                      className="w-full px-4 py-3 border border-ui-border-base rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#0066CC] focus:border-transparent disabled:bg-ui-bg-disabled disabled:cursor-not-allowed transition-all text-ui-fg-base appearance-none cursor-pointer"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23666'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 0.75rem center",
                        backgroundSize: "1.25rem",
                        paddingRight: "2.5rem",
                      }}
                    >
                      <option value="">Select {option.title}</option>
                      {option.values?.map((value) => (
                        <option key={value.id} value={value.value}>
                          {value.value}
                        </option>
                      ))}
                    </select>
                  ) : (
                    // Regular option select for other options
                    <OptionSelect
                      option={option}
                      current={options[option.id]}
                      updateOption={setOptionValue}
                      title={option.title ?? ""}
                      data-testid="product-options"
                      disabled={!!disabled || isAdding}
                    />
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* 3. Quantity Selector */}
        <div>
          <label className="block text-sm font-medium text-ui-fg-base mb-2">
            Quantity
          </label>
          <div className="flex items-center border border-ui-border-base rounded-lg overflow-hidden bg-white">
            {/* Decrement Button */}
            <button
              onClick={decrementQuantity}
              disabled={quantity <= 1 || !!disabled || isAdding}
              className="px-4 py-3 hover:bg-ui-bg-subtle disabled:opacity-40 disabled:cursor-not-allowed transition-colors border-r border-ui-border-base"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4 text-ui-fg-base" />
            </button>

            {/* Quantity Display */}
            <div className="flex-1 text-center py-3 font-medium text-ui-fg-base min-w-[60px]">
              {quantity}
            </div>

            {/* Increment Button */}
            <button
              onClick={incrementQuantity}
              disabled={quantity >= 99 || !!disabled || isAdding}
              className="px-4 py-3 hover:bg-ui-bg-subtle disabled:opacity-40 disabled:cursor-not-allowed transition-colors border-l border-ui-border-base"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4 text-ui-fg-base" />
            </button>
          </div>
        </div>

        {/* 4. Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={!inStock || !!disabled || isAdding || !isInitialized}
          variant="primary"
          className="w-full h-12 flex items-center justify-center gap-2 font-medium rounded-lg transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#0066CC] focus:ring-offset-2"
          isLoading={isAdding}
          data-testid="add-product-button"
          style={{ backgroundColor: "#0066CC", border: "none" }}
        >
          {!isAdding && <ShoppingCart className="w-5 h-5" />}
          {!isInitialized
            ? "Loading..."
            : !inStock
            ? "Out of stock"
            : "Add to cart"}
        </Button>

        <MobileActions
          product={product}
          variant={selectedVariant}
          options={options}
          updateOptions={setOptionValue}
          inStock={inStock}
          handleAddToCart={handleAddToCart}
          isAdding={isAdding}
          show={!inView}
          optionsDisabled={!!disabled || isAdding}
        />
      </div>
    </>
  )
}
