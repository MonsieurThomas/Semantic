import React from "react";
import { MapObject } from "../src/app/utils/MapObject";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

function MapChoice() {
  return (
    <div className="flex w-screen gap-2 mt-10">
      <div
        className="bg-[#F2F2F2] p-10 flex h-[400px] rounded-xl"
        style={{ flex: 2 }}
      ></div>
      <div className=" flex-5 h-screen flex flex-col " style={{ flex: 10 }}>
        <div className="flex items-center rounded-xl bg-[#F2F2F2] w-[420px] ">
          <SearchOutlinedIcon />
          <input
            type="text"
            placeholder="Rechercher par nom, par date.."
            className="w-[400px] bg-[#F2F2F2] pl-2"
          />
          <CloseOutlinedIcon />
        </div>
        <div className=" w-[75vw]  mt-10 rounded-xl">
          {MapObject.map((obj, key) => (
            <div key={key} className="bg-[#F2F2F2] mb-3 pb-3 rounded-2xl">
              <p className="pb-10 p-4">
                {obj.date} <span className="pl-2">{obj.title}</span>
              </p>
              <ul className="pl-[50px]">
                {obj.theme.map((item, themeKey) => (
                  <li key={themeKey}> ◯ {item}</li>
                ))}{" "}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MapChoice;
