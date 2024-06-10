import React, { useContext } from "react";
import { UserContext } from "../src/context/UserContext";
import MapObject from "../src/app/utils/MapObject";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import "../src/app/styles/style.css";
import { useRouter } from "next/router";

function MapChoice() {
  const { username, id } = useContext(UserContext);

  const sortedMapObject = MapObject.sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );

  let dateTmp = "";
  const router = useRouter();
  const colors = ["#EB473D", "#1C49A7", "#507543", "#E6A763", "#755591"];

  const handleButtonClick = () => {
    router.push("/testApi");
  };

  return (
    <div
      className="flex w-screen gap-2 mt-10"
      style={{ fontFamily: "Lexend", fontSize: "17px" }}
    >
      <div
        className="bg-[#F2F2F2] flex flex-col h-[400px] rounded-xl"
        style={{ flex: 3 }}
      >
        <div className="flex gap-2 m-2 rounded-xl pr-10 items-center bg-gray-200">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-300"
            style={{
              // fontWeight: "bold",
              fontSize: "22px",
            }}
          >
            <h1>{username ? username.charAt(0).toUpperCase() : "N"}</h1>
          </div>
          <div className="flex-1 flex justify-center">
            <h1 className="px-[60px]">{username ? username : "No User"}</h1>
          </div>
        </div>
        <div className="pl-12 pt-10 overflow-auto">
          {sortedMapObject.map((obj, key) => {
            const currentDate = obj.date.toLocaleDateString("fr-FR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            });

            const displayDate = currentDate !== dateTmp;
            dateTmp = currentDate;
            return (
              <ul key={key}>
                {displayDate && (
                  <li className="text-xs pt-3 font-e">{currentDate}</li>
                )}
                <li>
                  <span
                    className="px-3 py-[2px] text-white rounded-2xl text-sm font-semibold cursor-pointer"
                    style={{ backgroundColor: obj.color }}
                    onClick={() => {
                      const element = document.getElementById(`scroll-${key}`);
                      if (element) {
                        element.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                  >
                    {obj.title}
                  </span>
                </li>
              </ul>
            );
          })}
        </div>
      </div>
      <div
        className="flex-5 h-[80vh] flex flex-col overflow-auto"
        style={{ flex: 10 }}
      >
        <div className="flex items-center rounded-xl bg-[#F2F2F2] w-[420px] py-2">
          <SearchOutlinedIcon className="cursor-pointer" />
          <input
            type="text"
            placeholder="Rechercher par nom, par date.."
            className="w-[400px] bg-[#F2F2F2] pl-2"
          />
          <CloseOutlinedIcon className="cursor-pointer" />
        </div>
        <div className="w-[75vw] mt-2 rounded-xl overflow-auto h-[500px] pt-1 cursor-pointer">
          {MapObject.map((obj, key) => (
            <div
              key={key}
              id={`scroll-${key}`}
              className="bg-[#F2F2F2] mb-3 pb-3 rounded-2xl"
            >
              <div className="flex justify-between">
                <p className="pb-10 p-4 font-bold">
                  {`${obj.date.toLocaleDateString("fr-FR", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}`}
                  <span
                    className="mx-2 px-2 py-1 text-white rounded-2xl"
                    style={{ backgroundColor: obj.color }}
                  >
                    {obj.title}
                  </span>
                </p>
                <RemoveRedEyeIcon className="mx-7 my-2" />
              </div>
              <ul className="pl-[50px]">
                {obj.theme.map((item, themeKey) => (
                  <li key={themeKey}> ◯ {item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {/* <button className="bg-blue-500" onClick={handleButtonClick}>Get to testApi</button> */}
      </div>
    </div>
  );
}

export default MapChoice;
