import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../src/context/UserContext";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { RxCross1 } from "react-icons/rx";
import { useRouter } from "next/router";
import axios from "axios";
import { parseCookies } from "nookies";

interface Document {
  id: number;
  date: string;
  name: string;
  color: string;
  title: string;
  url: string;
  theme: string[];
  themeSize: number[];
  page: number;
  mimeType: string;
  path: string;
  size: number;
  createdAt: string;
  openaiResponse: any;
  rawText: any;
}

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const isJSON = (str: any) => {
  if (!str) return false;
  try {
    const cleanJsonString = str
      .replace(/```json\n/g, "")
      .replace(/```/g, "")
      .trim();
    console.log("cleanJsonString = ", cleanJsonString);

    JSON.parse(cleanJsonString);
    JSON.parse(str);
  } catch (e) {
    // console.log("str in isJSON = ", str);
    // console.log("str in isJSON = ", typeof(str));
    return false;
  }
  return true;
};

const cleanJson = (str: any) => {
  if (!str) return;
  const cleanJsonString = str
    .replace(/```json\n/g, "")
    .replace(/```/g, "")
    .trim();

  return cleanJsonString;
};

const formatSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} bytes`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
  return `${Math.round(bytes / (1024 * 1024))} Mo`;
};

function MapChoice() {
  const { username, id, setUsername, setId } = useContext(UserContext);
  const [documents, setDocuments] = useState<Document[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchProfileAndDocuments = async () => {
      try {
        const cookies = parseCookies();
        const token = cookies.token;

        console.log("cookies in mapchoice = ", cookies);
        console.log("token in mapchoice = ", token);

        if (token) {
          const profileResponse = await axios.get("/api/profile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (profileResponse.data) {
            setId(profileResponse.data.id);
            setUsername(profileResponse.data.username);

            const documentsResponse = await axios.get("/api/getUserDocuments", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            setDocuments(documentsResponse.data);
            console.log("documentsResponse.data =", documentsResponse.data);
            const openaiResponse = documentsResponse.data[0].openaiResponse;
            // console.log("openaiResponse =", openaiResponse);
          }
        }
      } catch (error) {
        console.error("Error fetching profile and documents:", error);
      }
    };

    fetchProfileAndDocuments();
  }, [setId, setUsername]);

  const sortedDocuments = documents.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let dateTmp = "";

  const handleDocumentClick = (document: Document) => {
    router.push({
      pathname: "/CanvasDrawing",
      query: {
        id: document.id,
        openaiResponse: JSON.stringify(document.openaiResponse),
      },
    });
  };

  const handleDocumentDelete = async (documentId: number) => {
    try {
      const cookies = parseCookies();
      const token = cookies.token;

      if (token) {
        await axios.delete(`/api/deleteDocument`, {
          params: { documentId },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Remove the document from the state
        setDocuments((prevDocuments) =>
          prevDocuments.filter((doc) => doc.id !== documentId)
        );
      }
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  return (
    <div className="flex w-[100%] gap-4 mt-10 overflow-x-hidden">
      <div
        className="bg-[#F2F2F2] flex flex-col h-[400px] rounded-xl overflow-x-hidden"
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
        <div className="pl-12 pt-10 overflow-auto no-scrollbar">
          {sortedDocuments.map((obj, key) => {
            const currentDate = new Date(obj.date).toLocaleDateString("fr-FR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            });

            const displayDate = currentDate !== dateTmp;
            dateTmp = currentDate;
            return (
              <ul key={key}>
                {displayDate && (
                  <li className="text-xs pt-3 pl-2">{currentDate}</li>
                )}
                <li className="mt-[8px] flex items-center justify-between">
                  <span
                    className="p-3 py-[6px] text-white rounded-xl text-sm font-semibold cursor-pointer whitespace-nowrap"
                    style={{ backgroundColor: obj.color }}
                    onClick={() => handleDocumentClick(obj)}
                  >
                    {isJSON(obj.openaiResponse)
                      ? Object.keys(JSON.parse(obj.openaiResponse))[0]
                      : Object.keys(
                          JSON.parse(cleanJson(obj.openaiResponse))
                        )[0]}
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
        <div className="flex items-center rounded-xl bg-[#E5E5E5] w-[1080px] py-3">
          <SearchOutlinedIcon className="cursor-pointer ml-2" />
          <input
            type="text"
            placeholder="Rechercher par nom, par date.."
            className="w-[400px] bg-[#E5E5E5] pl-2 outline-none"
          />
        </div>
        <div className="w-[75vw] mt-2 rounded-xl overflow-auto no-scrollbar h-[500px] pt-1 cursor-pointer">
          {documents.map((obj, key) => {
            const dateStr = new Date(obj.date).toLocaleDateString("fr-FR", {
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
                onClick={() => handleDocumentClick(obj)}
              >
                <div className="flex justify-between">
                  <p className="pb-4 p-4 font-bold">
                    {capitalizedDateStr}
                    <span
                      className="mx-2 px-[12px] py-[5px] text-white rounded-xl font-medium"
                      style={{ backgroundColor: obj.color }}
                    >
                      {isJSON(cleanJson(obj.openaiResponse)) &&
                        Object.keys(
                          JSON.parse(cleanJson(obj.openaiResponse))
                        )[0]}
                    </span>
                  </p>
                  <div className="flex items-center pr-10 gap-1">
                    <RemoveRedEyeIcon className="my-2 w-8" />
                    <RxCross1
                      className="cursor-pointer text-gray-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDocumentDelete(obj.id);
                      }}
                    />
                  </div>
                </div>
                <ul className="pl-[50px]">
                  {obj.theme.map((name, themeKey) => (
                    <li key={themeKey} className="flex items-center">
                      <span
                        className="inline-block w-2 h-2 border border-black rounded-full mr-2"
                        style={{ backgroundColor: "transparent" }}
                      ></span>
                      <div className="flex flex-grow items-center justify-between">
                        <span>{name}</span>
                        <span className="mr-[65px]">
                          {formatSize(obj.themeSize[themeKey])}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default MapChoice;
