import { HttpTypes } from "@medusajs/types"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

type BreadcrumbsProps = {
  product: HttpTypes.StoreProduct
  categoryPath?: Array<{ name: string; handle: string }>
}

const Breadcrumbs = ({ product, categoryPath }: BreadcrumbsProps) => {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center gap-2 text-sm text-ui-fg-subtle">
        {/* Home */}
        <li>
          <Link href="/" className="hover:text-ui-fg-base transition-colors">
            Home
          </Link>
        </li>

        <li>
          <ChevronRight className="w-4 h-4" />
        </li>

        {/* Category Path */}
        {categoryPath && categoryPath.length > 0 ? (
          <>
            {categoryPath.map((category, index) => (
              <li key={category.handle} className="flex items-center gap-2">
                <Link
                  href={`/categories/${category.handle}`}
                  className="hover:text-ui-fg-base transition-colors"
                >
                  {category.name}
                </Link>
                {index < categoryPath.length - 1 && (
                  <ChevronRight className="w-4 h-4" />
                )}
              </li>
            ))}
            <li>
              <ChevronRight className="w-4 h-4" />
            </li>
          </>
        ) : (
          <>
            {/* Fallback to "Products" if no category */}
            <li>
              <Link
                href="/store"
                className="hover:text-ui-fg-base transition-colors"
              >
                Products
              </Link>
            </li>
            <li>
              <ChevronRight className="w-4 h-4" />
            </li>
          </>
        )}

        {/* Current Product */}
        <li className="text-ui-fg-base font-medium truncate max-w-xs">
          {product.title}
        </li>
      </ol>
    </nav>
  )
}

export default Breadcrumbs
