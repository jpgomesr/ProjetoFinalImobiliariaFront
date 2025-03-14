import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Plus, Trash } from "lucide-react";

interface UploadGaleriaImagensProps {
   onImageChange?: (image: File | string | null, index?: number) => void;
   mensagemErroPrincipal?: string;
   mensagemErroGaleria?: string;
   clearErrors?: () => void;
   coverImage?: string | null;
   galleryImages?: (string | null)[];
   refImagensDeletadas?: (ref: string) => void;
}

const UploadGaleriaImagens = ({
   onImageChange,
   mensagemErroPrincipal,
   mensagemErroGaleria,
   clearErrors,
   coverImage,
   galleryImages = [null, null, null],
   refImagensDeletadas,
}: UploadGaleriaImagensProps) => {
   const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
      coverImage || null
   );
   const [galleryImagesPreview, setGalleryImagesPreview] = useState<
      (string | null)[]
   >(galleryImages || [null, null, null]);
   const coverInputRef = useRef<HTMLInputElement>(null);
   const galleryInputRefs = useRef<(HTMLInputElement | null)[]>([]);

   useEffect(() => {
      setCoverImagePreview(coverImage || null);
   }, [coverImage]);

   useEffect(() => {
      const newGalleryImages = [...(galleryImages || [null, null, null])];
      while (newGalleryImages.length < 3) {
         newGalleryImages.push(null);
      }
      setGalleryImagesPreview(newGalleryImages.slice(0, 3));
   }, []);

   useEffect(() => {
      galleryInputRefs.current = galleryInputRefs.current.slice(
         0,
         galleryImagesPreview.length
      );
   }, [galleryImagesPreview]);

   const handleImageChange =
      (index?: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
         if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const imageUrl = URL.createObjectURL(file);

            if (index === undefined) {
               setCoverImagePreview(imageUrl);
               if (onImageChange) {
                  onImageChange(file);
               }
            } else {
               const newGalleryImages = [...galleryImagesPreview];
               newGalleryImages[index] = imageUrl;
               setGalleryImagesPreview(newGalleryImages);

               if (onImageChange) {
                  onImageChange(file, index);
               }
            }
         }
      };

   const handleRemoveImage = (index?: number) => (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (index === undefined) {
         if (coverImagePreview && refImagensDeletadas) {
            refImagensDeletadas(coverImagePreview);
         }
         setCoverImagePreview(null);
         if (coverInputRef.current) {
            coverInputRef.current.value = "";
         }
         if (onImageChange) {
            onImageChange(null);
         }
      } else {
         const newGalleryImages = [...galleryImagesPreview];
         const removedImage = newGalleryImages[index];
         if (removedImage && refImagensDeletadas) {
            refImagensDeletadas(removedImage);
         }
         newGalleryImages[index] = null;
         setGalleryImagesPreview(newGalleryImages);
         if (galleryInputRefs.current[index]) {
            galleryInputRefs.current[index]!.value = "";
         }
         if (onImageChange) {
            onImageChange(null, index);
         }
      }
   };

   return (
      <div className="space-y-6">
         {/* Imagem de Capa */}
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
                  {coverImagePreview ? (
                     <>
                        <Image
                           src={coverImagePreview}
                           alt="Cover image preview"
                           fill
                           className="object-cover object-center rounded-md"
                        />
                        <button
                           onClick={handleRemoveImage()}
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
                     onChange={handleImageChange()}
                  />
               </label>
            </div>
            {mensagemErroPrincipal && (
               <span className="text-red-500 text-xs mt-1 md:text-sm xl:text-base">
                  {mensagemErroPrincipal}
               </span>
            )}
         </div>

         {/* Galeria de Imagens */}
         <div className="space-y-2">
            <label className="block text-sm font-medium">
               Galeria de imagens <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-4 justify-items-center mx-auto">
               {galleryImagesPreview.map((image, index) => (
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
                                 src={image}
                                 alt={`Gallery image ${index + 1}`}
                                 fill
                                 className="object-cover object-center rounded-md"
                              />
                              <button
                                 onClick={handleRemoveImage(index)}
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
                           ref={(el) => {
                              if (el) galleryInputRefs.current[index] = el;
                           }}
                           id={`gallery-image-upload-${index}`}
                           type="file"
                           accept="image/*"
                           className="hidden"
                           onChange={handleImageChange(index)}
                        />
                     </label>
                  </div>
               ))}
            </div>
         </div>
         {mensagemErroGaleria && (
            <span className="text-red-500 text-xs mt-1 md:text-sm xl:text-base">
               {mensagemErroGaleria}
            </span>
         )}
      </div>
   );
};

export default UploadGaleriaImagens;
