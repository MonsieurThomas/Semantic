// pages/_app.tsx
import { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import Layout from "../src/app/layouts/layout";
import "../src/app/styles/globals.css";
import Header from "../src/app/components/Header";
import Head from 'next/head';
import { UserContextProvider } from '../src/context/UserContext';

interface MyAppProps extends AppProps {
  session: Session;
}

function MyApp({ Component, pageProps }: MyAppProps) {
  return (
    <>
      {/* <SessionProvider session={pageProps.session}> */}
        <UserContextProvider>
          <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          </Head>
          <Header />
          <Component {...pageProps} />
        </UserContextProvider>
      {/* </SessionProvider> */}
    </>
  );
}

export default MyApp;
