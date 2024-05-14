import Layout from "../src/app/layouts/layout";
import { ComponentType } from "react";
import "../src/app/styles/globals.css";
import Header from "../src/app/components/Header";
import Head from 'next/head';
import { UserProvider } from '../src/context/UserContext';



function MyApp({
  Component,
  pageProps,
}: {
  Component: ComponentType;
  pageProps: any;
}) {
  return (
    <>
     <UserProvider>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        </Head>
        <Header />
        <Component {...pageProps} />
     </UserProvider>
    </>
  );
}

export default MyApp;
