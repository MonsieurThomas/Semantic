// src/hooks/useOutsideClick.js
import { useEffect } from 'react';

const useOutsideClick = (ref:any, handler:any) => {
    
    useEffect(() => {
        const listener = (event:any) => {
            // console.log("Clicked element: ", event.target); 
            if (!ref.current || ref.current.contains(event.target)) {
                // console.log("ref.current.", {ref});
                if (event.target.nodeName === 'CANVAS') {
                    // If clicking on canvas, decide based on your app's logic
                    // console.log("Click on canvas, decide action based on app's logic.");
                    return; // return here if you do not want to close the modal when canvas is clicked
                }
                // console.log("Click inside, ignore modal close.");
                return;
            }
            // console.log("Click outside, handle modal close.");
            handler();
        };

        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);

        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, handler]); // Only re-call effect if ref or handler changes
}

export default useOutsideClick;