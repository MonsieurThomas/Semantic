import OrgChartTree from "./CanvasDrawing";
import Header from "../src/app/components/Header";
import Auth from "./Auth";

export default function Home() {
  return (
    <div className="h-screen w-full">
      {/* <Header /> */}
      <Auth />
    </div>
  );
}
