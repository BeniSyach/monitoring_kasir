import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Monitoring Kasir | BAPENDA DELI SERDANG",
  description: "Ini Adalah halaman login untuk masuk ke dashboard monitoring kasir BAPENDA DELI SERDANG",
};

export default function SignIn() {
  return <SignInForm />;
}
