import React, { useEffect, useState } from "react";
import { fetchUserData, User } from "./api/auth/fetchUserData";
import MapObject from "../src/app/utils/MapObject";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import "../src/app/styles/style.css";

function MapChoice() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUserData = async () => {
      const userData = await fetchUserData();
      setUser(userData);
      console.log("ca a recuperer dans mapChoice = ", {userData})
    };

    getUserData();
  }, []);

  const sortedMapObject = MapObject.sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );

  let dateTmp = "";

  return (
    <div className="flex w-screen gap-2 mt-10">
      <div className="bg-[#F2F2F2] flex flex-col h-[400px] rounded-xl" style={{ flex: 3 }}>
        <div className="flex gap-2 ml-auto pr-10 pt-5">
          <h1>{user ? user.username.charAt(0) : 'N'}</h1>
          <h1>{user ? user.username : 'No User'}</h1>
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
                    className="px-3 py-[2px] text-white rounded-2xl text-sm font-semibold"
                    style={{ backgroundColor: obj.color }}
                  >
                    {obj.title}
                  </span>
                </li>
              </ul>
            );
          })}
        </div>
      </div>
      <div className="flex-5 h-[80vh] flex flex-col overflow-auto" style={{ flex: 10 }}>
        <div className="flex items-center rounded-xl bg-[#F2F2F2] w-[420px] py-2">
          <SearchOutlinedIcon className="cursor-pointer" />
          <input
            type="text"
            placeholder="Rechercher par nom, par date.."
            className="w-[400px] bg-[#F2F2F2] pl-2"
          />
          <CloseOutlinedIcon className="cursor-pointer" />
        </div>
        <div className="w-[75vw] mt-10 rounded-xl overflow-auto h-[500px] pt-1 cursor-pointer">
          {MapObject.map((obj, key) => (
            <div key={key} className="bg-[#F2F2F2] mb-3 pb-3 rounded-2xl">
              <div className="flex justify-between">
                <p className="pb-10 p-4">
                  {`${obj.date.toLocaleDateString("fr-FR", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}, ${obj.date.toLocaleTimeString("fr-FR", {
                    hour: "numeric",
                    minute: "numeric",
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
      </div>
    </div>
  );
}

export default MapChoice;
