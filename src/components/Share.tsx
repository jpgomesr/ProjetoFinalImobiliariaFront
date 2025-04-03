"use client";

import { Share2 } from 'lucide-react';
import React, { useState } from 'react'

const Share = () => {

    const [showCopiedMessage, setShowCopiedMessage] = useState(false);

    const handleShare = async () => {
        try {
           await navigator.clipboard.writeText(window.location.href);
           setShowCopiedMessage(true);
           setTimeout(() => {
              setShowCopiedMessage(false);
           }, 2000);
        } catch (err) {
           console.error("Erro ao copiar link:", err);
        }
     };


  return (
    <button onClick={handleShare} className="relative">
                        <Share2 />
                        {showCopiedMessage && (
                           <span className="absolute -top-10 left-1/2  transform -translate-x-1/2 bg-havprincipal text-white text-sm py-1 px-2 rounded whitespace-nowrap">
                              Link copiado!
                           </span>
                        )}
                     </button>
  )
}

export default Share