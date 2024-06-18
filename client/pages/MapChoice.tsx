import React, { useContext } from "react";
import { UserContext } from "../src/context/UserContext";
import MapObject from "../src/app/utils/MapObject";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
// import "../src/app/styles/style.css";
import { useRouter } from "next/router";

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

function MapChoice() {
  const { username } = useContext(UserContext);

  const sortedMapObject = MapObject.sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );

  let dateTmp = "";
  const router = useRouter();

  return (
    <div className="flex w-[110%] gap-4 mt-10">
      <div
        className="bg-[#F2F2F2] flex flex-col h-[400px] rounded-xl"
        style={{ flex: 3 }}
      >
        <div className="flex gap-2 m-2 mx-6 rounded-xl pr-10 items-center bg-gray-200">
          <div
            className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-300"
            style={{ fontSize: "22px" }}
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
                  <li className="text-xs pt-3 pl-2 font-e">{currentDate}</li>
                )}
                <li className="mt-[3px]">
                  <span
                    className="p-3 py-[6px] text-white rounded-xl text-sm font-semibold cursor-pointer"
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
        <div className="flex items-center rounded-xl bg-[#E5E5E5] w-[1420px] py-3">
          <SearchOutlinedIcon className="cursor-pointer ml-2" />
          <input
            type="text"
            placeholder="Rechercher par nom, par date.."
            className="w-[400px] bg-[#E5E5E5] pl-2"
          />
          {/* <CloseOutlinedIcon className="cursor-pointer" /> */}
        </div>
        <div className="w-[75vw] mt-2 rounded-xl overflow-auto h-[500px] pt-1 cursor-pointer">
          {MapObject.map((obj, key) => {
            const dateStr = obj.date.toLocaleDateString("fr-FR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            });

            const capitalizedDateStr = capitalizeFirstLetter(dateStr);

            return (
              <div
                key={key}
                id={`scroll-${key}`}
                className="bg-[#F2F2F2] mb-3 pb-6 rounded-2xl font-light"
              >
                <div className="flex justify-between">
                  <p className="pb-4 p-4 font-bold">
                    {capitalizedDateStr}
                    <span
                      className="mx-2 px-[12px] py-[5px] text-white rounded-xl font-medium"
                      style={{ backgroundColor: obj.color }}
                    >
                      {obj.title}
                    </span>
                  </p>
                  <RemoveRedEyeIcon className="mr-[60px] my-2  w-8" />
                </div>
                <ul className="pl-[50px]">
                  {obj.theme.map((item, themeKey) => (
                    <li key={themeKey} className="flex items-center">
                      <span
                        className="inline-block w-2 h-2 border border-black rounded-full mr-2"
                        style={{ backgroundColor: "transparent" }}
                      ></span>
                      <div className="flex flex-grow items-center justify-between">
                        <span>
                          {typeof item === "string" ? item : item.name}
                        </span>
                        <span className="mr-[65px]">
                          {typeof item !== "string" && item.weight}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
        {/* <button className="bg-blue-500" onClick={handleButtonClick}>Get to testApi</button> */}
      </div>
    </div>
  );
}

export default MapChoice;
