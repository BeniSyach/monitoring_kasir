"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import {EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";

export default function SignInForm() {
  const router = useRouter();
  const errorModal = useModal();
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
         `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Login gagal"
        );
      }

      // redirect
      router.replace("/");
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
       setError(err.message);
      errorModal.openModal();
      } else {
        setError("Terjadi kesalahan");
        errorModal.openModal();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Login
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Masukkan Username dan password untuk Masuk Ke dashboard
            </p>
          </div>
          <div>
            <form onSubmit={handleLogin}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Username <span className="text-error-500">*</span>
                  </Label>
                 <Input
                    placeholder="Masukkan Username Anda"
                    type="text"
                    value={username}
                    onChange={(e) =>
                      setUsername(e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      placeholder="Masukkan Password Anda"
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Ingat Login Anda
                    </span>
                  </div>
                  <Link
                    href="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Lupa password?
                  </Link>
                </div>
                <div>
                <Button
                  className="w-full flex items-center justify-center gap-2"
                  size="sm"
                  disabled={loading}
                >
              {loading ? (
                <>
                  <svg
                    className="w-5 h-5 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>

                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>

                  Loading...
                </>
              ) : (
                "Login"
              )}
            </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Modal
          isOpen={errorModal.isOpen}
          onClose={errorModal.closeModal}
          className="max-w-[450px] p-6 lg:p-8"
        >
          <div className="text-center">

            {/* Icon */}
            <div className="relative flex items-center justify-center z-1 mb-7">

              <svg
                className="fill-error-50 dark:fill-error-500/15"
                width="90"
                height="90"
                viewBox="0 0 90 90"
                fill="none"
              >
                <path
                  d="M34.364 6.85053C38.6205 -2.28351 51.3795 -2.28351 55.636 6.85053C58.0129 11.951 63.5594 14.6722 68.9556 13.3853C78.6192 11.0807 86.5743 21.2433 82.2185 30.3287C79.7862 35.402 81.1561 41.5165 85.5082 45.0122C93.3019 51.2725 90.4628 63.9451 80.7747 66.1403C75.3648 67.3661 71.5265 72.2695 71.5572 77.9156C71.6123 88.0265 60.1169 93.6664 52.3918 87.3184C48.0781 83.7737 41.9219 83.7737 37.6082 87.3184C29.8831 93.6664 18.3877 88.0266 18.4428 77.9156C18.4735 72.2695 14.6352 67.3661 9.22531 66.1403C-0.462787 63.9451 -3.30193 51.2725 4.49185 45.0122C8.84391 41.5165 10.2138 35.402 7.78151 30.3287C3.42572 21.2433 11.3808 11.0807 21.0444 13.3853C26.4406 14.6722 31.9871 11.951 34.364 6.85053Z"
                  fill=""
                />
              </svg>

              <span className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">

                <svg
                  className="fill-error-600 dark:fill-error-500"
                  width="38"
                  height="38"
                  viewBox="0 0 38 38"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9.62684 11.7496C9.04105 11.1638 9.04105 10.2141 9.62684 9.6283C10.2126 9.04252 11.1624 9.04252 11.7482 9.6283L18.9985 16.8786L26.2485 9.62851C26.8343 9.04273 27.7841 9.04273 28.3699 9.62851C28.9556 10.2143 28.9556 11.164 28.3699 11.7498L21.1198 18.9999L28.3699 26.25C28.9556 26.8358 28.9556 27.7855 28.3699 28.3713C27.7841 28.9571 26.8343 28.9571 26.2485 28.3713L18.9985 21.1212L11.7482 28.3715C11.1624 28.9573 10.2126 28.9573 9.62684 28.3715C9.04105 27.7857 9.04105 26.836 9.62684 26.2502L16.8771 18.9999L9.62684 11.7496Z"
                    fill=""
                  />
                </svg>

              </span>

            </div>

            {/* Title */}
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Login Gagal
            </h4>

            {/* Message */}
            <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">
              {error}
            </p>

            {/* Button */}
            <div className="flex items-center justify-center w-full gap-3 mt-7">

              <button
                type="button"
                onClick={errorModal.closeModal}
                className="flex justify-center w-full px-4 py-3 text-sm font-medium text-white rounded-xl bg-error-500 shadow-theme-xs hover:bg-error-600 sm:w-auto transition"
              >
                Tutup
              </button>

            </div>

          </div>
      </Modal>
    </div>
    
  );
}
