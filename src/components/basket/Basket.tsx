"use client";

import { useCartStore } from "@/store/cartStore";
import { useEffect, useState } from "react";
import styles from "./basket.module.scss";

export const Basket = () => {
  const { cart, totalPrice, clearCart } = useCartStore();
  const [phone, setPhone] = useState("");
  const [isPhoneValid, setIsPhoneValid] = useState(true);

  useEffect(() => {
    const savedPhone = localStorage.getItem("basket_phone");
    if (savedPhone) {
      setPhone(savedPhone);
    }
  }, []);

  const checkPhoneValidity = (number: string) => {
    const cleaned = number.replace(/\D/g, "");
    return cleaned.length === 11;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhone(value);
    localStorage.setItem("basket_phone", value);
    setIsPhoneValid(true);
  };

  const handleSubmit = () => {
    if (cart.length === 0) return;

    const isValid = checkPhoneValidity(phone);
    setIsPhoneValid(isValid);

    if (isValid) {
      alert(`Заказ оформлен! Номер: ${phone}\nСумма: ${totalPrice()}₽`);
      clearCart();
      localStorage.removeItem("basket_phone");
      setPhone("");
    }
  };

  return (
    <div className={styles.basket}>
      <p className={styles.title}>Добавленные товары</p>
      <div className={styles.products}>
        {cart.length ? <>
          {cart.map(({id, price, quantity, title}) => {
            return <div key={id} className={styles.productInfo}>
              <span>{title}</span>
              <span className={styles.quantity}>x{quantity}</span>
              <span className={styles.price}>{price * quantity}₽</span>
            </div>
          })}
        </> : "Корзина пуста"}
      </div>
      <div className={styles.buttonsBlock}>
        <input
          type="tel"
          id="phone"
          value={phone}
          onChange={handlePhoneChange}
          placeholder="79991234567"
          className={`${styles.input} ${!isPhoneValid ? styles.invalid : ""}`}
        />
        <button
          onClick={handleSubmit}
          className={styles.orderButton}
        >
          Заказать
        </button>
      </div>
    </div>
  );
};