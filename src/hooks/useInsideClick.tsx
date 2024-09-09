import { useEffect } from 'react';

const useInsideClick = (ref: any, handler: any) => {
  // console.log("Dans le hook spécial pour les clics à l'intérieur");
  useEffect(() => {
    const clickListener = (event: any) => {
      // Vérifie si le clic est à l'intérieur de l'élément référencé
      if (ref.current && ref.current.contains(event.target)) {
        handler();
      }
    };

    document.addEventListener('mousedown', clickListener);
    document.addEventListener('touchstart', clickListener);

    return () => {
      document.removeEventListener('mousedown', clickListener);
      document.removeEventListener('touchstart', clickListener);
    };
  }, [ref, handler]); // Re-call effect if ref or handler changes
}

export default useInsideClick;
