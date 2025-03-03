
import { Plus } from "lucide-react";
import { useState,useEffect } from "react";

interface UploadImagemProps {
   onChange: (foto: File) => void;
   preview?: string;
}

export default function uploadImagem(props: UploadImagemProps) {
   const [preview, setPreview] = useState<string | undefined>(undefined);

   useEffect(() => {
      setPreview(props.preview);
   }, [props.preview]);



   const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
         props.onChange(file);
         const reader = new FileReader();
         reader.onload = (e: ProgressEvent<FileReader>) => {
            if (e.target && typeof e.target.result === "string") {
               setPreview(e.target.result);
            }
         };
         reader.readAsDataURL(file);
      }
   };

   return (
      <div className="flex flex-col gap-2">
         <label
            className="opacity-90 text-xs
                     font-montserrat
                     md:text-sm
                     lg:text-base lg:rounded-lg
                     2xl:text-xl 2xl:rounded-xl"
         >
            Imagem de perfil
         </label>
         <label
            htmlFor="imagem-usuario"
            className="w-32 h-32 flex items-center justify-center rounded-full bg-gray-100 border-2 border-dashed border-gray-400 cursor-pointer relative"
         >
            {preview ? (
               <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-full"
               />
            ) : (
               <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-300">
                  <Plus className="text-gray-500" />
               </div>
            )}
            <input
               type="file"
               id="imagem-usuario"
               name="image"
               accept="image/*"
               className="hidden"
               onChange={handleImageChange}
            />
         </label>
      </div>
   );
}
