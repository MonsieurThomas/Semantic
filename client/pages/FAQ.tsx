import Link from 'next/link';
import React, { useState } from 'react';

function Questions() {
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);

  const handleToggle = (question: number) => {
    setOpenQuestion(openQuestion === question ? null : question);
  };

  return (
    <div className="flex flex-col md:flex-row p-4 h-[90vh] bg-[#fffcf4]" style={{ fontFamily: "Lexend" }}>
      <div className="text-5xl font-bold md:w-1/2 text-left pl-[200px] pt-10">
        <h1>Foire </h1>
        <h1>Aux</h1>
        <h1 className="text-[#F56600]">Questions</h1>
      </div>
      <div className="md:w-1/2 md:ml-4 pt-6">
        <div className="mb-4 py-6 pl-3 bg-white shadow-lg rounded-lg">
          <h2
            className="text-xl font-semibold cursor-pointer"
            onClick={() => handleToggle(1)}
          >
            Quels types de documents Semantic prend-il en charge?
          </h2>
          <div className={`transition-all overflow-hidden ${openQuestion === 1 ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <p className="mt-2 pl-4">Semantic prend en charge les fichiers Word, PDF et les pages web (en nous donnant leur URL).</p>
          </div>
        </div>
        <div className="mb-4 py-6 pl-3 bg-white shadow-lg rounded-lg">
          <h2
            className="text-xl font-semibold cursor-pointer"
            onClick={() => handleToggle(2)}
          >
            Quelle est la sécurité des données avec Semantic?
          </h2>
          <div className={`transition-all overflow-hidden ${openQuestion === 2 ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <p className="mt-2 pl-4">TBD</p>
          </div>
        </div>
        <div className="mb-4 py-6 pl-3 bg-white shadow-lg rounded-lg">
          <h2
            className="text-xl font-semibold cursor-pointer"
            onClick={() => handleToggle(3)}
          >
            Comment puis-je obtenir de l&apos;aide en cas de problème avec Semantic?
          </h2>
          <div className={`transition-all overflow-hidden ${openQuestion === 3 ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <p className="mt-2 pl-4">
              Vous pouvez avoir l’aide de l’équipe Semantic dans les plus brefs délais <Link className='text-orange-400' href="/Contact">ici</Link>.
            </p>
          </div>
        </div>
        <div className="mb-4 py-6 pl-3 bg-white shadow-lg rounded-lg">
          <h2
            className="text-xl font-semibold cursor-pointer"
            onClick={() => handleToggle(4)}
          >
            Y a-t-il des limites sur la taille ou le nombre de mind maps que je peux créer avec Semantic?
          </h2>
          <div className={`transition-all overflow-hidden ${openQuestion === 4 ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <p className="mt-2 pl-4">
              Semantic est conçu pour offrir une flexibilité maximale donc actuellement, il n&apos;y a pas de limites sur la taille ou le nombre de vos mind maps.
            </p>
          </div>
        </div>
        <div className="mb-4 py-6 pl-3 bg-white shadow-lg rounded-lg">
          <h2
            className="text-xl font-semibold cursor-pointer"
            onClick={() => handleToggle(5)}
          >
            Comment puis-je suggérer des fonctionnalités ou des améliorations pour Semantic?
          </h2>
          <div className={`transition-all overflow-hidden ${openQuestion === 5 ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <p className="mt-2 pl-4">
              Nous encourageons les suggestions : vous pouvez proposer des fonctionnalités directement depuis cette page!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Questions;
