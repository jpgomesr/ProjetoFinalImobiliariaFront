import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Plus, Trash, ChevronLeft, ChevronRight } from "lucide-react";

interface UploadGaleriaImagensProps {
   coverImage?: string | null;
   galleryImages?: (string | null)[];
   refImagensDeletadas?: (ref: string) => void;
   onImageChange?: (image: File | string | null, index?: number) => void;
   mensagemErro?: string;
   clearErrors?: () => void;
}

const UploadGaleriaImagens = ({
   onImageChange,
   mensagemErro,
   coverImage,
   galleryImages,
   refImagensDeletadas,
}: UploadGaleriaImagensProps) => {
   const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
      coverImage || null
   );
   const [galleryImagesPreview, setGalleryImagesPreview] = useState<
      (string | null)[]
   >(galleryImages || []);
   const [showLeftArrow, setShowLeftArrow] = useState(false);
   const [showRightArrow, setShowRightArrow] = useState(false);
   const [currentPage, setCurrentPage] = useState(0);
   const coverInputRef = useRef<HTMLInputElement>(null);
   const galleryInputRefs = useRef<(HTMLInputElement | null)[]>([]);
   const containerRef = useRef<HTMLDivElement>(null);

   const ITEMS_PER_PAGE = {
      sm: 2,
      md: 3,
      lg: 4,
      xl: 5,
   };

   useEffect(() => {
      setCoverImagePreview(coverImage || null);
   }, [coverImage]);

   useEffect(() => {
      setGalleryImagesPreview(galleryImages || []);
   }, [galleryImages]);

   const getItemsPerPage = () => {
      if (typeof window !== "undefined") {
         if (window.innerWidth < 640) return ITEMS_PER_PAGE.sm;
         if (window.innerWidth < 900) return ITEMS_PER_PAGE.md;
         if (window.innerWidth < 1200) return ITEMS_PER_PAGE.lg;
         return ITEMS_PER_PAGE.xl;
      }
      return ITEMS_PER_PAGE.lg;
   };

   const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage());

   useEffect(() => {
      const handleResize = () => {
         setItemsPerPage(getItemsPerPage());
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
   }, []);

   useEffect(() => {
      if (galleryImages && galleryImages.length > 0) {
         setGalleryImagesPreview(galleryImages);
      }
   }, [galleryImages]);

   useEffect(() => {
      setCoverImagePreview(coverImage || null);
   }, [coverImage]);

   useEffect(() => {
      galleryInputRefs.current = galleryInputRefs.current.slice(
         0,
         galleryImagesPreview.length + 1
      );
   }, [galleryImagesPreview.length]);

   useEffect(() => {
      const totalPages = Math.ceil(
         (galleryImagesPreview.length + 1) / itemsPerPage
      );
      setShowLeftArrow(currentPage > 0);
      setShowRightArrow(currentPage < totalPages - 1);
   }, [currentPage, galleryImagesPreview.length, itemsPerPage]);

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
               setGalleryImagesPreview((prev) => {
                  const newGallery = [...prev];
                  newGallery[index] = imageUrl;
                  return newGallery;
               });
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
         newGalleryImages.splice(index, 1);
         setGalleryImagesPreview(newGalleryImages);
         if (galleryInputRefs.current[index]) {
            galleryInputRefs.current[index]!.value = "";
         }
         if (onImageChange) {
            onImageChange(null, index);
         }
      }
   };

   const scroll = (direction: "left" | "right", e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      setCurrentPage((prev) => {
         if (direction === "left") {
            return Math.max(0, prev - 1);
         } else {
            const totalPages = Math.ceil(
               (galleryImagesPreview.length + 1) / itemsPerPage
            );
            return Math.min(totalPages - 1, prev + 1);
         }
      });
   };

   const getCurrentPageItems = () => {
      const start = currentPage * itemsPerPage;
      const end = start + itemsPerPage;
      const items = [...galleryImagesPreview];

      const totalPages = Math.ceil((items.length + 1) / itemsPerPage);
      if (currentPage === totalPages - 1) {
         items.push(null);
      }

      return items.slice(start, end);
   };

   return (
      <div className="space-y-6">
         {/* Imagem de Capa */}
         <div className="space-y-2">
            <label className="block text-sm font-medium">Imagem de capa</label>
            <div className="relative">
               <label
                  htmlFor="cover-image-upload"
                  className="cursor-pointer flex items-center justify-center w-40 h-40 border-2 border-dashed 
                           border-gray-300 rounded-md bg-gray-50
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
                           sizes="(max-width: 640px) 160px, (max-width: 1280px) 320px, 384px"
                           className="object-cover object-center rounded-md"
                        />
                        <button
                           onClick={handleRemoveImage()}
                           className="absolute top-[-10px] right-[-10px] bg-havprincipal bg-opacity-90 
                                       p-1.5 rounded-full text-white hover:bg-opacity-100 transition-colors"
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
            {mensagemErro && (
               <span className="text-red-500 text-xs mt-1 md:text-sm xl:text-base">
                  {mensagemErro}
               </span>
            )}
         </div>

         {/* Galeria de Imagens */}
         <div className="space-y-2">
            <label className="block text-sm font-medium">
               Galeria de imagens
            </label>
            <div className="relative">
               {showLeftArrow && (
                  <button
                     onClick={(e) => scroll("left", e)}
                     className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white 
                                 rounded-full p-1 shadow-md
                                 sm:p-2"
                  >
                     <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  </button>
               )}

               <div
                  ref={containerRef}
                  className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 px-10"
               >
                  {getCurrentPageItems().map((image, index) => (
                     <div
                        key={index + currentPage * itemsPerPage}
                        className="relative aspect-square w-full
                                    sm:p-3 md:p-4"
                     >
                        {image ? (
                           <div
                              className="cursor-pointer flex items-center justify-center w-full h-full 
                                    border-2 border-dashed border-gray-300 rounded-md bg-gray-50 relative"
                           >
                              <Image
                                 src={image}
                                 alt={`Gallery image ${index + 1}`}
                                 fill
                                 sizes="(max-width: 640px) 50vw, (max-width: 900px) 33vw, (max-width: 1200px) 25vw, 20vw"
                                 className="object-cover object-center rounded-md"
                              />
                              <button
                                 onClick={handleRemoveImage(
                                    index + currentPage * itemsPerPage
                                 )}
                                 className="absolute top-[-10px] right-[-10px] bg-havprincipal bg-opacity-90 
                                          p-1.5 rounded-full text-white hover:bg-opacity-100 transition-colors"
                              >
                                 <Trash className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                              </button>
                           </div>
                        ) : (
                           <label
                              htmlFor="gallery-image-upload-new"
                              className="cursor-pointer flex items-center justify-center w-full h-full border-2 
                                    border-dashed border-gray-300 rounded-md bg-gray-50 relative"
                           >
                              <div
                                 className="absolute flex items-center justify-center w-8 h-8 rounded-full 
                                       bg-white shadow-sm"
                              >
                                 <Plus className="w-4 h-4 text-gray-500" />
                              </div>
                              <input
                                 id="gallery-image-upload-new"
                                 type="file"
                                 accept="image/*"
                                 className="hidden"
                                 onChange={handleImageChange(
                                    galleryImagesPreview.length
                                 )}
                              />
                           </label>
                        )}
                     </div>
                  ))}
               </div>

               {showRightArrow && (
                  <button
                     onClick={(e) => scroll("right", e)}
                     className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full 
                                 p-1 shadow-md
                                 sm:p-2"
                  >
                     <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  </button>
               )}
            </div>
         </div>
      </div>
   );
};

export default UploadGaleriaImagens;
