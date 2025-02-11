"use client";

import { useState } from "react";

interface HomeProps {
   favorited: boolean;
}

export default function FavButton({ favorited }: HomeProps) {
   const [isFav, setIsFav] = useState(favorited);

   return <div>{isFav && <button>teste</button>}</div>;
}
