import { AppProps } from "next/app";
import "../src/app/styles/globals.css";
import Header from "../src/app/components/Header";
import Head from "next/head";
import { UserContextProvider } from "../src/context/UserContext";
import { WebSocketProvider } from "../src/context/WebSocketContext";
import { PromptProvider } from "../src/context/PromptContext";
import Footer from "@/app/components/Footer";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <UserContextProvider>
        <WebSocketProvider>
          <PromptProvider>
            <Head>
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
              />
            </Head>
            <Header />
            <Component {...pageProps} />
            <Footer />
          </PromptProvider>
        </WebSocketProvider>
      </UserContextProvider>
    </>
  );
}

export default MyApp;
