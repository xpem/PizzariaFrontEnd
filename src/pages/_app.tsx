import type { AppProps } from "next/app";
import "../../styles/globals.scss";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "../contexts/AuthContext";
import { ToastContainer } from "react-toastify";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />;
      <ToastContainer autoClose={3000}></ToastContainer>
    </AuthProvider>
  );
}

export default MyApp;
