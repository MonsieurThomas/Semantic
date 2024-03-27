import React, { useEffect } from 'react'


function Zoomlogic(canvasRef:any, zoomHandle:any, zoomSlider:any ) {

    useEffect(() => {

        if (canvasRef.current) {

            const ctx = canvasRef.current.getContext("2d");
        }
    })
  return (
    <div>
      
    </div>
  )
}

export default Zoomlogic;
