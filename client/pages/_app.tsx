import Layout from "../src/app/layouts/layout";
import { ComponentType } from "react";
import "../src/app/styles/globals.css";
import Header from "../src/app/components/Header";

function MyApp({
  Component,
  pageProps,
}: {
  Component: ComponentType;
  pageProps: any;
}) {
  return (
    <>
      <Header />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
