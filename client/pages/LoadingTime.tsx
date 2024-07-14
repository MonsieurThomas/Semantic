import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import io from "socket.io-client";
import { AnimatePresence, motion } from "framer-motion";

interface LoadingTimeProps {
  randomPhrase: string;
}

const LoadingTime: React.FC<LoadingTimeProps> = ({ randomPhrase }) => {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [documentInfo, setDocumentInfo] = useState<{
    id: string;
    openaiResponse: string;
  } | null>(null);

  useEffect(() => {
    const socket = io({
      path: "/api/socket",
    });

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
              key="exemple"
              className="font-bold text-2xl absolute top-[40px] left-[300px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              Exemple
            </motion.h1>
            <motion.h1
              key="initiatives"
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
              key="application"
              className="font-bold text-2xl absolute top-[220px] left-[700px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              Application
            </motion.h1>
            <motion.h1
              key="milliard"
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
              key="million"
              className="font-bold text-2xl absolute top-[150px] left-[1150px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              Million
            </motion.h1>
            <motion.h1
              key="solution"
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
        {randomPhrase}
      </h3>
    </div>
  );
};

export const getServerSideProps = async () => {
  const phrases = [
    "Prenez du recul en dézoomant ou tapez \"Espace\" pour revenir au centre.",
    "Utilisez le dézoom pour voir la vue d'ensemble ou appuyez sur \"Espace\" pour centrer.",
    "Dézoomez pour une vue globale ou appuyez sur \"Espace\" pour revenir au centre.",
    "Vous pouvez dézoomer pour une vue plus large ou appuyer sur \"Espace\" pour centrer.",
    "Revenez au centre en appuyant sur \"Espace\" ou dézoomez pour voir tout le contenu."
  ];

  const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];

  return {
    props: {
      randomPhrase,
    },
  };
};

export default LoadingTime;
