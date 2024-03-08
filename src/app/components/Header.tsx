import React from 'react'
import "../style.css";

function Header() {
  return (
        <div className="flex justify-between mx-10 items-center py-4">
            <h1 className="text-3xl" >
                Semantic
            </h1>
            <div className="flex justify-center text-center gap-12 mx-5 px h-full">
                <h2 className= 'navButton '>Ma Collection</h2>
                <h2 className= 'navButton '>Lorem Ipsum</h2>
                <h2 className= 'navButton '>Importer un fichier</h2>
                <h2 className= 'navButton'>Contact</h2>
            </div>
        </div>
  )
}

export default Header
