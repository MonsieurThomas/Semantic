import React, { useState } from 'react';
import Image from 'next/image';
import mindMappingImage from "../public/mindMappingImage.png";
import MindMap2 from "../public/MindMap2.png";

const tabs = [
  {
    title: "L'information, structurée et clarifiée",
    content: (
      <div className="bg-gray-100 p-8 rounded-xl flex my-6 items-center justify-center gap-10">
        <div className="flex-1 text-center">
          <h2 className="text-2xl font-semibold mb-12">L&apos;information, structurée et clarifiée</h2>
          <p className="text-justify" style={{fontSize:"16px"}}>
            Le mind mapping simplifie la visualisation des idées complexes en les structurant sous forme d&apos;arbre, à partir de mots-clés.
          </p>
          <p className="text-justify" style={{fontSize:"16px"}}>
            Ce faisant, la mind map permet de regrouper des éléments sous forme thématique en facilitant la navigation à travers une large quantité d&apos;informations.
          </p>
          <p className="text-justify" style={{fontSize:"16px"}}>
            Idéal pour professionnels gérant de nombreux documents, il transforme la recherche en une expérience claire et rapide.
          </p>
        </div>
        <div className="flex-1">
          <Image src={mindMappingImage} alt="Mind map example" width={500} height={300} />
        </div>
      </div>
    ),
  },
  {
    title: "Le mind mapping à la sauce Semantic",
    content: (
      <div className="bg-gray-100 px-8 py-8 rounded-xl flex my-6 items-center justify-center gap-10">
        <div className="flex-1">
          <Image src={MindMap2} alt="Semantic mind map example" width={500} height={300} />
        </div>
        <div className="flex-1 text-center">
          <h2 className="text-2xl font-semibold mb-12">Le mind mapping à la sauce Semantic</h2>
          <p className="text-justify " style={{fontSize:"16px"}}>
            Notre intuition a été d&apos;utiliser les mind maps non pas comme outil d&apos;apprentissage mais comme un outil de navigation pour naviguer clairement dans une grande quantité d&apos;informations.
          </p>
          <p className="text-justify" style={{fontSize:"16px"}}>
            Sur Semantic, suivre une branche de la map, c&apos;est trouver le chemin le plus rapide vers les parties de vos documents qui vous intéressent vraiment.
          </p>
          <p className="text-justify" style={{fontSize:"16px"}}>
            Aucun scroll, aucun Ctrl+Tab pour changer de document, laissez vous guider par les mots-clés et trouvez directement toute l&apos;information disponible et pertinente.
          </p>
        </div>
      </div>
    ),
  },
];

const MindMapping = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div style={{ fontFamily: 'Lexend', fontSize: "18px" }} className=" px-[200px]">
      <h1 className="text-5xl font-bold mb-6 text-center pt-10">Le génie du mind mapping</h1>

    <h3 className='p-3 font-bold'>Le mind mapping en chiffres</h3>
    <p>En moyenne, les sondés ont fait état d&apos;une augmentation de 30 % de leur productivité grâce à l’utilisation de mind maps dans leur environnement professionnel.
    Plus de 35% d&apos;entre eux ont déclaré que le mind mapping les aide à gérer “significativement” la surcharge d&apos;informations dans leurs métiers.
    Plus surprenant encore, plus de 59 % des personnes interrogées ont indiqué qu&apos;elles ne seraient pas en mesure de créer la même qualité de travail si elles ne disposaient pas d&apos;un logiciel de cartographie mentale.</p>
    <p className='p-1 '>Source :  Mind Mapping Software Trends Survey, 2021</p>
      
      <div className="flex justify-center">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`px-4 pt-8 font-semibold ${index === activeTab ? 'border-b-2 border-blue-500' : ''}`}
            onClick={() => setActiveTab(index)}
          >
            {tab.title}
          </button>
        ))}
      </div>
      
      <div className="">
        {tabs[activeTab].content}
      </div>
    </div>
  );
};

export default MindMapping;
