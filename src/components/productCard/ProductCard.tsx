"use client";

import { useState, useEffect } from "react";
import type { IProduct } from "@/shared/types/products"
import { useCartStore } from "@/store/cartStore"
import styles from "./productCard.module.scss"

const ProductCard = ({id, image_url, title, description, price}: IProduct) => {
  const { addToCart, cart, updateQuantity } = useCartStore();
  const cartItem = cart.find(item => item.id === id);
  const [quantity, setQuantity] = useState(cartItem?.quantity || 0);

  useEffect(() => {
    if (cartItem) {
      setQuantity(cartItem.quantity);
    }
  }, [cartItem]);

  const handleIncrement = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    updateQuantity(id, newQuantity);
  };

  const handleDecrement = () => {
    const newQuantity = quantity - 1;
    setQuantity(newQuantity);
    updateQuantity(id, newQuantity);
    if(quantity < 1)updateQuantity(id, 0);
  };

  return <div className={styles.card}>
    <img src={image_url} alt="А нету картиночки(" className={styles.image}/>
    <h6 className={styles.title}>{title}</h6>
    <p className={styles.description}>{description}</p>
    <p className={styles.price}>Цена: {price}₽</p>
    <div className={styles.blockButtons}>
      {!cartItem ? <button
        className={styles.addToCart}
        onClick={() => {addToCart({id, title, price})}}
      >
        купить
      </button> : <>
        <button className={styles.quantityButton} onClick={handleDecrement}>-</button>
        <input
          type="number"
          value={quantity}
          min="1"
          onChange={(e) => {
            const newValue = Math.max(1, parseInt(e.target.value)) || 1;
            setQuantity(newValue);
            updateQuantity(id, newValue);
          }}
          className={styles.quantityInput}
        />
        <button className={styles.quantityButton} onClick={handleIncrement}>+</button>
      </>}
    </div>
  </div>
}

export { ProductCard }