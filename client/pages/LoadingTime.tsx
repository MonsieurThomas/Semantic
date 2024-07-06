import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import io from "socket.io-client";
import { AnimatePresence, motion } from "framer-motion";

const LoadingTime = () => {
  const router = useRouter();
  const { taskId } = router.query;
  const [progress, setProgress] = useState(0);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [documentInfo, setDocumentInfo] = useState<{
    id: string;
    openaiResponse: string;
  } | null>(null);

  useEffect(() => {
    const socket = io();

    socket.on(
      "loadingComplete",
      (docInfo: { id: string; openaiResponse: string }) => {
        setDocumentInfo(docInfo);
        setLoadingComplete(true);
      }
    );

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const intervals = [
      { duration: 0, progress: 5 },
      { duration: 1000, progress: 10 },
      { duration: 1500, progress: 35 },
      { duration: 800, progress: 50 },
      { duration: 2000, progress: 65 },
      { duration: 1200, progress: 85 },
      { duration: 1000, progress: 98 },
    ];

    let currentInterval = 0;

    const updateProgress = () => {
      if (currentInterval < intervals.length) {
        setTimeout(() => {
          setProgress(intervals[currentInterval].progress);
          currentInterval++;
          updateProgress();
        }, intervals[currentInterval].duration);
      }
    };

    updateProgress();
  }, []);

  useEffect(() => {
    if (loadingComplete && documentInfo) {
      router.push({
        pathname: "/CanvasDrawing",
        query: {
          id: documentInfo.id,
          openaiResponse: JSON.stringify(documentInfo.openaiResponse),
        },
      });
    }
  }, [loadingComplete, documentInfo, router]);

  return (
    <div className="relative h-[85vh] w-screen">
      <AnimatePresence>
        {progress >= 10 && (
          <>
            <motion.h1
              className="font-bold text-2xl absolute top-[40px] left-[300px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              Exemple
            </motion.h1>
            <motion.h1
              className="font-bold text-2xl absolute top-[350px] left-[1100px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              Initiatives
            </motion.h1>
          </>
        )}

        {progress >= 35 && (
          <>
            <motion.h1
              className="font-bold text-2xl absolute top-[220px] left-[700px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              Application
            </motion.h1>
            <motion.h1
              className="font-bold text-2xl absolute top-[300px] left-[200px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              Milliard
            </motion.h1>
          </>
        )}

        {progress >= 65 && (
          <>
            <motion.h1
              className="font-bold text-2xl absolute top-[150px] left-[1150px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              Million
            </motion.h1>
            <motion.h1
              className="font-bold text-2xl absolute top-[280px] left-[500px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              Solution
            </motion.h1>
          </>
        )}
      </AnimatePresence>

      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-1/3">
        <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden">
          <div
            className="bg-[#FCA310] h-full"
            style={{ width: `${progress}%`, transition: "width 0.9s" }}
          ></div>
        </div>
      </div>

      <h3 className="font-bold text-lg absolute bottom-10 left-1/2 transform -translate-x-1/2 text-[#BBBBBB]">
        Perdu dans votre mindmap ?
      </h3>
      <h3 className="font-bold text-lg absolute bottom-4 left-1/2 transform -translate-x-1/2 text-[#BBBBBB]">
        Prenez du recul en dézoomant ou tapez &quot;Espace&quot; pour revenir au
        centre.
      </h3>
    </div>
  );
};

export default LoadingTime;
