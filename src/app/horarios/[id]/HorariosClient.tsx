"use client";

import { useLanguage } from "@/context/LanguageContext";
import FundoBrancoPadrao from "@/components/ComponentesCrud/FundoBrancoPadrao";
import FormularioHorarios from "./FormularioHorarios";

interface HorariosClientProps {
   id: string;
   BASE_URL: string;
   token: string;
}

const HorariosClient = ({ id, BASE_URL, token }: HorariosClientProps) => {
   const { t } = useLanguage();

   return (
      <FundoBrancoPadrao titulo={t("Schedules.Schedule registration")}>
         <FormularioHorarios id={id} BASE_URL={BASE_URL} token={token} />
      </FundoBrancoPadrao>
   );
};

export default HorariosClient; 