
import MapCreate from "./MapCreate";
// import { GetServerSideProps } from "next";
// import { getSession } from "next-auth/react";


export default function Home() {
  return (
    <div className="h-screen w-full">
      <MapCreate />
    </div>
  );
}
