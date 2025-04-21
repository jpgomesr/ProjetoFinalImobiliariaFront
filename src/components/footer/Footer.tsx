import React from "react";
import FooterClient from "./FooterClient";



   const navItems = [
      {
         group: "Grupo 1",
         items: [
            { label: "Termos de serviço", route: "/" },
            { label: "Corretores", route: "/" },
            { label: "Política de privacidade", route: "/politica-privacidade" },
         ],
      },
      {
         group: "Grupo 2",
         items: [
            { label: "HAV na sociedade", route: "/" },
            { label: "Suporte", route: "/suporte" },
            { label: "Conheça a HAV", route: "/" },
         ],
      },
      {
         group: "Grupo 3",
         items: [
            { label: "Feedbacks", route: "/" },
            { label: "Cadastre-se", route: "/" },
            { label: "Casas", route: "/" },
         ],
      },
      {
         group: "Grupo 4",
         items: [
            { label: "Apartamentos", route: "/" },
            { label: "Dúvidas frequentes", route: "/" },
            { label: "Chat Bot", route: "/" },
         ],
      },
   ];
const Footer = () => {


   return <FooterClient />;
};

export default Footer;