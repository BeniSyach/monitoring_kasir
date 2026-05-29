"use client";
import { useState, useCallback } from "react";

export const useModal = (initialState: boolean = false) => {
  const [isOpen, setIsOpen] = useState(initialState);

  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);
  const toggleModal = useCallback(() => setIsOpen((prev) => !prev), []);

  return { isOpen, openModal, closeModal, toggleModal };
};

export const formatDate = (date: string) => {

  const [year, month, day] =
    date.split("-");

  return `${day}-${month}-${year}`;
};
