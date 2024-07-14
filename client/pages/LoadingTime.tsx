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

      <div
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full flex justify-center items-start leading-tight"
        style={{ height: "60px" }}
      >
        <h3 className="font-bold text-lg text-center text-[#BBBBBB] w-[800px]">
          {randomPhrase.split("\n").map((line, index) => (
            <React.Fragment key={index}>
              {line}
              {index !== randomPhrase.split("\n").length - 1 && <br />}
            </React.Fragment>
          ))}
        </h3>
      </div>
    </div>
  );
};

export const getServerSideProps = async () => {
  const phrases = [
    'Perdu dans votre mindmap ?\nPrenez du recul en dézoomant ou tapez "Espace" pour revenir au centre.',
    'Revenez au centre en appuyant sur "Espace" ou dézoomez pour voir tout le contenu.',
    "Pour accéder à votre banque de marqueurs sur une map, tapez “ctrl+m”",
    "Le saviez-vous ? 8h, c’est le temps passé en moyenne chaque semaine au travail à chercher de l’information sans la trouver. Mais ça, c’est sans Semantic.",
    "Le saviez-vous ? 3h, c’est le temps passé en moyenne par jour au travail à chercher et gérer des informations. Avant Semantic en tout cas.",
    "Pensez à sauvegarder votre mindmap : vous retrouverez dans Ma Bibliothèque la date, les documents utilisés et la mindmap.",
    "Une fois au bout de votre mindmap, vous pouvez afficher le texte concerné et basculer dans le document associé.",
    "Si vous travaillez tard, n’oubliez pas d’activer le night-shift !",
    "Pensez à utiliser les marqueurs en passant la souris sur un bloc pour personnalisez vos maps et les parcourir avec plus d’aisance.",
    "Un clic sur 👁️ et vous pourrez faire disparaître puis réapparaitre une partie de la map. De quoi mieux se concentrer sur le reste !",
    // "Les mind maps peuvent aider à organiser visuellement les concepts et leurs relations, ce qui  facilite la recherche d'informations. Une étude publiée dans \"The Journal of Educational Psychology\" a montré que les participants retrouvaient plus rapidement l'information dans un mind map que dans une liste linéaire… et s’en souvenaient mieux !",
    "Une recherche menée par l’université de Nouvelle-Galles du Sud a montré que l’utilisation de mind maps est associée à une amélioration de la mémoire à long terme.",
    "\nUne méta-analyse publiée dans \"Educational Psychology Review\" a souligné que l'utilisation de mind maps était associée à des performances d'apprentissage améliorées.",
    "L'université de Radboud aux Pays-Bas a montré que les étudiants qui utilisaient des mind maps obtenaient de meilleurs résultats aux tests de connaissances que ceux qui utilisaient des méthodes d'étude plus traditionnelles.",
  ];

  const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];

  return {
    props: {
      randomPhrase,
    },
  };
};

export default LoadingTime;
