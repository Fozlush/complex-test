"use client";

import { useCartStore } from "@/store/cartStore";
import { useEffect, useState } from "react";
import styles from "./basket.module.scss";
import { Modal } from "../popup/Modal";

export const Basket = () => {
  const { cart, clearCart } = useCartStore();
  const [phone, setPhone] = useState("");
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    const value = e.target.value.replace(/[^0-9]/g, '');
    setPhone(value);
    localStorage.setItem("basket_phone", value);
    setIsPhoneValid(true);
  };

  const handleSubmit = () => {
    if (cart.length === 0) return;

    const isValid = checkPhoneValidity(phone);
    setIsPhoneValid(isValid);

    if (isValid) {
      setIsModalOpen(true);
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
              <span className={styles.title}>{title}</span>
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
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <p className={styles.modalText}>Заказик оформлен</p>
        <button className={styles.closeModal} onClick={() => setIsModalOpen(false)}>Прикольно, понятно</button>
      </Modal>
    </div>
  );
};