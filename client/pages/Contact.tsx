import React from 'react';
import Image from 'next/image';
import bg from '../public/bg-contact.png';
import bg2 from '../public/bg-contact2.png';
import bg3 from '../public/bg-contact3.png';

const Contact = () => {
  return (
    <div
      style={{ fontFamily: 'Lexend', height: '85vh' }}
      className="relative flex flex-col justify-between items-center"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bg.src})`, opacity: 0.1, zIndex:-1 }}
      ></div>
      <div className="relative z-10 flex flex-col items-center justify-center h-1/2 text-center p-6 rounded-xl">
        <h1 className="text-5xl font-bold mb-6">Contacte-nous!</h1>
        <p className="text-lg mb-4">
          Une question, un problème, une idée? <span className="px-2"></span>Prends contact avec notre équipe!
        </p>
      </div>
      <div className="relative z-10 flex w-full h-1/2 gap-8 px-12 rounded-xl">
        <div className="flex-1 mb-6 flex flex-col items-center justify-center text-center cursor-pointer relative">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${bg.src})`, opacity: 0.2 }} ></div>
          <h2 className="text-2xl font-semibold mb-4">Sales</h2>
          <p className="text-lg px-4" >
            Prenez contact avec nous pour en savoir plus sur Semantic et son intérêt pour tes équipes.
          </p>
        </div>
        <div className="flex-1 relative mb-6 flex flex-col items-center justify-center text-center cursor-pointer">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${bg.src})`, opacity: 0.2 }} ></div>
          <h2 className="text-2xl font-semibold mb-4">Support</h2>
          <p className="text-lg px-4">
            Nous sommes là pour vous aider - contactez-nous pour toute question relative au logiciel et nous vous trouverons une solution.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
