import type { IProduct } from "@/shared/types/products"
import styles from "./productCard.module.scss"

const ProductCard = ({id, image_url, title, description, price}: IProduct) => {
  return <div className={styles.card}>
    <img src={image_url} alt="А нету картиночки(" className={styles.image}/>
    <h6>{title}</h6>
    <p>{description}</p>
    <p>Цена: {price}₽</p>
    <div></div>
  </div>
}

export { ProductCard }