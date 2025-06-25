import DOMPurify from 'isomorphic-dompurify';
import { Suspense } from 'react';
import { ProductCard } from "@/components";
import type { IProductsResponse } from "@/shared/types/products";
import { ProductsLoader } from '@/components/productsLoader/ProductsLoader';
import styles from "./page.module.scss"
import { Basket } from '@/components/basket/Basket';

interface IReview {
  id: number;
  text: string;
}

async function getProducts(): Promise<IProductsResponse> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?page=1&page_size=${process.env.NEXT_PUBLIC_ITEM_PER_PAGE}`, {
    next: { revalidate: 60 }
  })
  
  if (!res.ok) {
    throw new Error('Failed to fetch products')
  }
  
  return res.json()
}

async function getReviews(): Promise<IReview[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews`, {
    next: { revalidate: 60 }
  })
  
  if (!res.ok) {
    throw new Error('Failed to fetch reviews')
  }
  
  return res.json()
}

export default async function Home() {
  const initialProducts = await getProducts()
  const reviews = await getReviews()

  return (
    <>
      <div className={styles.reviewContainer}>
        {reviews.map(({id, text}) => {
          return <div key={id} className={styles.reviewCard} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(text) }} />
        })}
      </div>
      <Basket/>
      <div className={styles.cardContainer}>
        {initialProducts.items.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
        <Suspense fallback={<div className={styles.loading}>Загрузка...</div>}>
          <ProductsLoader initialPage={2} hasMore={initialProducts.total > Number(process.env.NEXT_PUBLIC_ITEM_PER_PAGE)} />
        </Suspense>
      </div>
    </>
  );
}
