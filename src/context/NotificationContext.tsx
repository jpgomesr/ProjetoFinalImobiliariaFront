"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import SuccessNotification from "@/components/pop-up/Pop-up"; // Import the component

interface NotificationContextType {
   showNotification: (message: string) => void;
   hideNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
   undefined
);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
   const [message, setMessage] = useState<string>("");
   const [isVisible, setIsVisible] = useState<boolean>(false);
   const [shouldRender, setShouldRender] = useState<boolean>(false);

   const showNotification = (newMessage: string) => {
      setMessage(newMessage);
      setShouldRender(true);

      setTimeout(() => {
         setIsVisible(true);
      }, 10);

      setTimeout(() => {
         hideNotification();
      }, 5000);
   };

   const hideNotification = () => {
      setIsVisible(false);

      setTimeout(() => {
         setShouldRender(false);
      }, 500);
   };

   return (
      <NotificationContext.Provider
         value={{ showNotification, hideNotification }}
      >
         {children}
         {shouldRender && (
            <SuccessNotification message={message} isVisible={isVisible} />
         )}
      </NotificationContext.Provider>
   );
};

export const useNotification = () => {
   const context = useContext(NotificationContext);
   if (!context) {
      throw new Error(
         "useNotification must be used within a NotificationProvider"
      );
   }
   return context;
};
