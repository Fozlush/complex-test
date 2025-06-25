"use client";

import { useCartStore } from "@/store/cartStore";
import { useEffect, useState } from "react";
import styles from "./basket.module.scss";
import { Modal } from "../popup/Modal";

const formatPhoneNumber = (phoneNumber: string) => {
    const cleaned = phoneNumber.replace(/\D/g, "");
    
    // Применяем маску: +7 (XXX) XXX-XX-XX
    let formatted = "+7 ";
    if (cleaned.length > 1) {
      const rest = cleaned.slice(1);
      if (rest.length > 0) {
        formatted += `(${rest.substring(0, 3)}`;
      }
      if (rest.length > 3) {
        formatted += `) ${rest.substring(3, 6)}`;
      }
      if (rest.length > 6) {
        formatted += `-${rest.substring(6, 8)}`;
      }
      if (rest.length > 8) {
        formatted += `-${rest.substring(8, 10)}`;
      }
    }
    
    return formatted;
  };

export const Basket = () => {
  const { cart, clearCart } = useCartStore();
  const [phone, setPhone] = useState("");
  const [displayPhone, setDisplayPhone] = useState("");
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    const savedPhone = localStorage.getItem("basket_phone");
    if (savedPhone) {
      setPhone(savedPhone);
      setDisplayPhone(formatPhoneNumber(savedPhone));
    }
  }, []);

  const checkPhoneValidity = (number: string) => {
    const cleaned = number.replace(/\D/g, "");
    return cleaned.length === 11;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const cleaned = input.replace(/[^\d+]/g, "");
    
    let phoneValue = cleaned;
    if (/^[789]/.test(cleaned)) {
      phoneValue = "+7" + cleaned.substring(1);
    }
    
    phoneValue = phoneValue.substring(0, 12);
    
    const digitsOnly = phoneValue.replace(/\D/g, "");
    setPhone(digitsOnly);
    localStorage.setItem("basket_phone", digitsOnly);
    
    setDisplayPhone(formatPhoneNumber(digitsOnly));
    setIsPhoneValid(true);
  };

  const handleSubmit = async () => {
    if (cart.length === 0) {
      setError("Корзина пуста");
      return;
    }

    const isValid = checkPhoneValidity(phone);
    setIsPhoneValid(isValid);

    if (!isValid) {
      setError("Введите корректный номер телефона (11 цифр)");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: phone,
          cart: cart.map(item => ({
            id: item.id,
            quantity: item.quantity
          }))
        }),
      });

      if (!response.ok) {
        throw new Error("Ошибка при оформлении заказа");
      }

      setModalMessage("Заказ успешно оформлен");
      setIsModalOpen(true);
      clearCart();
      localStorage.removeItem("basket_phone");
      setPhone("");
      setDisplayPhone("");
    } catch (err) {
      setModalMessage(err instanceof Error ? err.message : "Произошла ошибка при оформлении заказа");
      setIsModalOpen(true);
      setError(err instanceof Error ? err.message : "Произошла ошибка");
    } finally {
      setIsLoading(false);
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
          value={displayPhone}
          onChange={handlePhoneChange}
          placeholder="+7 (999) 123-45-67"
          className={`${styles.input} ${!isPhoneValid ? styles.invalid : ""}`}
        />
        <button
          onClick={handleSubmit}
          className={styles.orderButton}
          disabled={isLoading}
        >
          {isLoading ? "Отправка..." : "Заказать"}
        </button>
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <p className={styles.modalText}>{modalMessage}</p>
        <button className={styles.closeModal} onClick={() => setIsModalOpen(false)}>
          Прикольно, понятно
        </button>
      </Modal>
    </div>
  );
};