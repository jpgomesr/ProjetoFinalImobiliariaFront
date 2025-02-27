"use client";

import type React from "react";

import { useState, useRef } from "react";
import Image from "next/image";
import { Plus, Trash } from "lucide-react";

interface UploadGaleriaImagensProps {
   onCoverImageChange?: (file: File | null) => void;
   onGalleryImageChange?: (files: File[]) => void;
}

export default function UploadGaleriaImagens({
   onCoverImageChange,
   onGalleryImageChange,
}: UploadGaleriaImagensProps) {
   const [coverImage, setCoverImage] = useState<string | null>(null);
   const [galleryImages, setGalleryImages] = useState<string[]>(["", "", ""]);
   const coverInputRef = useRef<HTMLInputElement>(null);
   const galleryInputRefs = useRef<(HTMLInputElement | null)[]>([]);

   const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
         const file = e.target.files[0];
         const imageUrl = URL.createObjectURL(file);
         setCoverImage(imageUrl);
         if (onCoverImageChange) {
            onCoverImageChange(file);
         }
      }
   };

   const handleRemoveCoverImage = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setCoverImage(null);
      if (coverInputRef.current) {
         coverInputRef.current.value = "";
      }
      if (onCoverImageChange) {
         onCoverImageChange(null);
      }
   };

   const handleGalleryImageChange =
      (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
         if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const imageUrl = URL.createObjectURL(file);

            const newGalleryImages = [...galleryImages];
            newGalleryImages[index] = imageUrl;
            setGalleryImages(newGalleryImages);

            if (onGalleryImageChange) {
               const validFiles = newGalleryImages
                  .filter((img) => img !== "")
                  .map((_, i) => galleryInputRefs.current[i]?.files?.[0])
                  .filter(Boolean) as File[];

               onGalleryImageChange(validFiles);
            }
         }
      };

   const handleRemoveGalleryImage =
      (index: number) => (e: React.MouseEvent) => {
         e.preventDefault();
         e.stopPropagation();

         const newGalleryImages = [...galleryImages];
         newGalleryImages[index] = "";
         setGalleryImages(newGalleryImages);

         if (galleryInputRefs.current[index]) {
            galleryInputRefs.current[index]!.value = "";
         }

         if (onGalleryImageChange) {
            const validFiles = newGalleryImages
               .filter((img) => img !== "")
               .map((_, i) => galleryInputRefs.current[i]?.files?.[0])
               .filter(Boolean) as File[];

            onGalleryImageChange(validFiles);
         }
      };

   return (
      <div className="space-y-6">
         <div className="space-y-2">
            <label className="block text-sm font-medium">
               Imagem de capa <span className="text-red-500">*</span>
            </label>
            <div className="relative">
               <label
                  htmlFor="cover-image-upload"
                  className="cursor-pointer flex items-center justify-center w-40 h-40 border-2 border-dashed border-gray-300 rounded-md bg-gray-50
                            relative
                            sm:w-80 sm:h-80
                            xl:w-96 xl:h-96"
               >
                  {coverImage ? (
                     <>
                        <Image
                           src={coverImage || "/placeholder.svg"}
                           alt="Cover image preview"
                           fill
                           className="object-cover object-center rounded-md"
                        />
                        <button
                           onClick={handleRemoveCoverImage}
                           className="absolute top-[-10px] right-[-10px] bg-havprincipal bg-opacity-90 p-1.5 rounded-full text-white hover:bg-opacity-100 transition-colors"
                        >
                           <Trash className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                        </button>
                     </>
                  ) : (
                     <div className="absolute flex items-center justify-center w-6 h-6 rounded-full bg-white shadow-sm">
                        <Plus className="w-5 h-5 text-gray-500" />
                     </div>
                  )}

                  <input
                     ref={coverInputRef}
                     id="cover-image-upload"
                     type="file"
                     accept="image/*"
                     className="hidden"
                     onChange={handleCoverImageChange}
                  />
               </label>
            </div>
         </div>

         <div className="space-y-2">
            <label className="block text-sm font-medium">
               Galeria de imagens <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-4 justify-items-center mx-auto">
               {galleryImages.map((image, index) => (
                  <div
                     key={index}
                     className="relative aspect-square w-full max-w-xs flex items-center justify-center"
                  >
                     <label
                        htmlFor={`gallery-image-upload-${index}`}
                        className="cursor-pointer flex items-center justify-center w-full h-full border-2 border-dashed border-gray-300 rounded-md bg-gray-50 relative"
                     >
                        {image ? (
                           <>
                              <Image
                                 src={image || "/placeholder.svg"}
                                 alt={`Gallery image ${index + 1}`}
                                 fill
                                 className="object-cover object-center rounded-md"
                              />
                              <button
                                 onClick={handleRemoveGalleryImage(index)}
                                 className="absolute top-[-10px] right-[-10px] bg-havprincipal bg-opacity-90 p-1.5 rounded-full text-white hover:bg-opacity-100 transition-colors"
                              >
                                 <Trash className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                              </button>
                           </>
                        ) : (
                           <div className="absolute flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-sm">
                              <Plus className="w-4 h-4 text-gray-500" />
                           </div>
                        )}
                        <input
                           ref={(el) => (galleryInputRefs.current[index] = el)}
                           id={`gallery-image-upload-${index}`}
                           type="file"
                           accept="image/*"
                           className="hidden"
                           onChange={handleGalleryImageChange(index)}
                        />
                     </label>
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
}
