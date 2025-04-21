"use client";

interface ModalProps {
   isOpen: boolean;
   onClose: () => void;
   children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
   if (!isOpen) return null;

   return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
         <div className="bg-white rounded-lg p-4 max-w-4xl w-full mx-4">
            <div className="flex justify-end">
               <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700"
               >
                  ✕
               </button>
            </div>
            {children}
         </div>
      </div>
   );
}
