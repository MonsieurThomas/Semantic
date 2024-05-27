
import Login from "./Login";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";


export default function Home() {
  return (
    <div className="h-screen w-full">
      <Login />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  return {
    props: {
      session,
    },
  };
};
