import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import io from "socket.io-client";
import { AnimatePresence } from "framer-motion";
import AnimatedWord from "./AnimateWord";

interface LoadingTimeProps {
  randomPhrase: string;
}

interface WordType {
  word: string;
  top: string;
  left: string;
  progressThreshold: number;
}

const LoadingTime: React.FC<LoadingTimeProps> = ({ randomPhrase }) => {
  const router = useRouter();
  const { taskId } = router.query;
  const [progress, setProgress] = useState(0);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [wordsToDisplay, setWordsToDisplay] = useState<WordType[]>([]);
  const [useWords, setUsedWords] = useState<string[]>([]);
  const [documentInfo, setDocumentInfo] = useState<{
    id: string;
    openaiResponse: string;
  } | null>(null);

  useEffect(() => {
    console.log("Establishing socket connection...");
    const socket = io({
      path: "/api/socket",
    });

    socket.on(
      "loadingComplete",
      (docInfo: { id: string; openaiResponse: string; taskId: string }) => {
        console.log("Received loadingComplete event:", docInfo);

        // Check if the taskId matches the current taskId
        if (docInfo.taskId === taskId) {
          console.log("Task IDs match. Updating state.");
          setDocumentInfo(docInfo);
          setLoadingComplete(true);
        } else {
          console.log(
            "Task ID mismatch. Expected:",
            taskId,
            "but got:",
            docInfo.taskId
          );
        }
      }
    );

    return () => {
      console.log("Disconnecting socket...");
      socket.disconnect();
    };
  }, [taskId]);

  useEffect(() => {
    console.log(
      "Checking if loading is complete and document info is available..."
    );
    console.log("loadingComplete:", loadingComplete);
    console.log("documentInfo:", documentInfo);
    if (loadingComplete && documentInfo) {
      console.log("Loading complete. Redirecting to /CanvasDrawing...");
      router.push({
        pathname: "/CanvasDrawing",
        query: {
          id: documentInfo.id,
          openaiResponse: JSON.stringify(documentInfo.openaiResponse),
        },
      });
    }
  }, [loadingComplete, documentInfo, router]);

  useEffect(() => {
    const intervals = [
      { duration: 0, progress: 5 },
      { duration: 2000, progress: 10 },
      { duration: 3000, progress: 35 },
      { duration: 1600, progress: 50 },
      { duration: 4000, progress: 65 },
      { duration: 2400, progress: 85 },
      { duration: 2000, progress: 98 },
      { duration: 1000, progress: 99 },
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

  const groupedWords = {
    3: [
      { word: "Diagnostic", top: "80px", left: "300px" },
      { word: "Optimisation", top: "150px", left: "600px" },
      { word: "Gestion du changement", top: "200px", left: "900px" },
      { word: "Gestion des risques", top: "330px", left: "320px" },
      { word: "Conclusion", top: "350px", left: "840px" },
      { word: "Sources", top: "370px", left: "160px" },
      { word: "Taille de marché", top: "220px", left: "540px" },
    ],
    10: [
      { word: "Innovation", top: "380px", left: "600px" },
      { word: "Transformation digitale", top: "300px", left: "100px" },
      { word: "Audit", top: "50px", left: "850px" },
    ],
    35: [
      { word: "Contrat", top: "460px", left: "140px" },
      { word: "Conformité", top: "180px", left: "750px" },
      { word: "Réglementation", top: "400px", left: "1150px" },
    ],
    50: [
      { word: "Litige", top: "50px", left: "1260px" },
      { word: "Responsabilité", top: "100px", left: "670px" },
      { word: "Propriété", top: "130px", left: "360px" },
    ],
    65: [
      { word: "Risque", top: "140px", left: "1180px" },
      { word: "Arbitrage", top: "260px", left: "830px" },
      { word: "Exemples", top: "110px", left: "140px" },
    ],
    85: [
      { word: "Initiatives", top: "310px", left: "940px" },
      { word: "Applications", top: "280px", left: "1210px" },
      { word: "Solutions", top: "280px", left: "710px" },
    ],
    98: [
      { word: "Millions", top: "200px", left: "160px" },
      { word: "Milliards", top: "40px", left: "1050px" },
      { word: "Investissement", top: "70px", left: "510px" },
    ],
  };

  // Sélection aléatoire d'un mot pour chaque progressThreshold
  const selectedWords = Object.entries(groupedWords).reduce(
    (accumulatedWords, [threshold, words]) => {
      let selectedWordsForThreshold = [];

      if (words.length === 7 && progress == 5) {
        console.log("ok");
        const usedIndices = new Set<number>();
        while (usedIndices.size < 3) {
          const randomIndex = Math.floor(Math.random() * words.length);
          if (!usedIndices.has(randomIndex)) {
            usedIndices.add(randomIndex);
            selectedWordsForThreshold.push({
              ...words[randomIndex],
              progressThreshold: Number(threshold),
            });
          }
        }
      } else {
        const randomIndex = Math.floor(Math.random() * words.length);
        selectedWordsForThreshold.push({
          ...words[randomIndex],
          progressThreshold: Number(threshold),
        });
      }

      // console.log("selectedWordsForThreshold = ", selectedWordsForThreshold[0].progressThreshold);
      return [...accumulatedWords, ...selectedWordsForThreshold];
    },
    [] as Array<{
      word: string;
      top: string;
      left: string;
      progressThreshold: number;
    }>
  );

  useEffect(() => {
    // console.log("progress = ", progress)
    if (progress == 99) return;
    const wordsToAdd = selectedWords.filter(
      (word) => progress == word.progressThreshold
    );
    // console.log("Mots ajoutés pour progress:", progress);
    // console.log("Mots ajoutés pour wordsToAdd:", wordsToAdd, "\n");
    setWordsToDisplay((prevWords) => [...prevWords, ...wordsToAdd]);
    console.log("wordsToDisplay = ", wordsToDisplay);
  }, [progress]);

  useEffect(() => {
    if (progress === 99 && wordsToDisplay.length < 15) {
      const intervalId = setInterval(() => {
        const newWord = getNewUniqueWord(); // Fonction pour obtenir un mot unique qui n'est pas encore affiché
        if (newWord) {
          setWordsToDisplay((prevWords) => [...prevWords, newWord]);
        }
      }, 3000); // Ajoute un mot toutes les 3 secondes

      return () => clearInterval(intervalId); // Nettoyage de l'intervalle quand le composant est démonté
    }
  }, [progress, wordsToDisplay]);

  // Fonction pour obtenir un mot aléatoire unique qui n'est pas déjà dans wordsToDisplay
  const getNewUniqueWord = () => {
    const allWords = Object.entries(groupedWords).flatMap(
      ([threshold, words]) =>
        words.map((word) => ({
          ...word,
          progressThreshold: Number(threshold),
        }))
    ); // Tous les mots disponibles avec progressThreshold

    // Filtrer les mots qui ont déjà été affichés
    const availableWords = allWords.filter(
      (word) =>
        !wordsToDisplay.some(
          (displayedWord) => displayedWord.word === word.word
        )
    );

    if (availableWords.length === 0) return null; // Aucun mot disponible

    const randomIndex = Math.floor(Math.random() * availableWords.length);
    return availableWords[randomIndex]; // Renvoie un mot aléatoire
  };

  return (
    <div className="relative h-[85vh] w-screen">
      <AnimatePresence>
        {wordsToDisplay.map((wordData, index) => (
          <AnimatedWord
            key={index}
            word={wordData.word}
            top={wordData.top}
            left={wordData.left}
            progressThreshold={wordData.progressThreshold}
            currentProgress={progress}
          />
        ))}
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
    "Une recherche menée par l’université de Nouvelle-Galles du Sud a montré que l’utilisation de mind maps est associée à une amélioration de la mémoire à long terme.",
    "Une méta-analyse publiée dans \"Educational Psychology Review\" a souligné que l'utilisation de mind maps était associée à des performances d'apprentissage améliorées.",
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
