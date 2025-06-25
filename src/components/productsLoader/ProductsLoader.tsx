'use client'

import { useState, useEffect, useRef } from 'react'
import { ProductCard } from "@/components";
import type { IProduct } from "@/shared/types/products";
import styles from './productsLoader.module.scss'

export function ProductsLoader({ initialPage, hasMore: initialHasMore }: { 
  initialPage: number, 
  hasMore: boolean 
}) {
  const [page, setPage] = useState(initialPage)
  const [products, setProducts] = useState<IProduct[]>([])
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [isLoading, setIsLoading] = useState(false)
  const observerTarget = useRef(null)

  const loadMoreProducts = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?page=${page}&page_size=${process.env.NEXT_PUBLIC_ITEM_PER_PAGE}`)
      const data = await response.json()
      console.log(data)
      setProducts(prev => [...prev, ...data.items])
      setPage(prev => prev + 1)
      setHasMore(Number(process.env.NEXT_PUBLIC_ITEM_PER_PAGE) * page < data.total)
    } catch (error) {
      console.error('Error loading more products:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && hasMore) {
          loadMoreProducts()
        }
      },
      { threshold: 0.1 }
    )

    const currentTarget = observerTarget.current
    if (currentTarget) {
      observer.observe(currentTarget)
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
    }
  }, [loadMoreProducts, isLoading, hasMore])

  return (
    <>
      {products.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
      <div ref={observerTarget} className={styles.observer} />
      {isLoading && <div className={styles.loading}>Загрузка...</div>}
    </>
  )
}