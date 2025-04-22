import React from "react";
import FooterClient from "./FooterClient";



   const navItems = [
      {
         group: "Grupo 1",
         items: [
            { label: "Termos de serviço", route: "/politica-privacidade" },
            { label: "Corretores", route: "/sobre-nos" },
            { label: "Política de privacidade", route: "/politica-privacidade" },
         ],
      },
      {
         group: "Grupo 2",
         items: [
            { label: "HAV na sociedade", route: "/sobre-nos" },
            { label: "Suporte", route: "/suporte" },
            { label: "Conheça a HAV", route: "/sobre-nos" },
         ],
      },
      {
         group: "Grupo 3",
         items: [
            { label: "Feedbacks", route: "" },
            { label: "Cadastre-se", route: "/autenticacao/cadastro" },
            { label: "Casas", route: "/imoveis?tipoImovel=CASA" },
         ],
      },
      {
         group: "Grupo 4",
         items: [
            { label: "Apartamentos", route: "/imoveis?tipoImovel=APARTAMENTO" },
            { label: "Dúvidas frequentes", route: "/perguntas-frequentes" },
            { label: "Chat Bot", route: "/" },
         ],
      },
   ];
const Footer = () => {


   return <FooterClient />;
};

export default Footer;