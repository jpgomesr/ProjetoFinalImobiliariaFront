"use client";

import React, { useState, useEffect } from "react";
import { buscarImovelPorId } from "../../Functions/imovel/buscaImovel";
import { ModelImovelGet } from "../../models/ModelImovelGet";
import Modal from "./Modal";
import Image from "next/image";
interface ModalComparacaoImoveisProps {
   isOpen: boolean;
   onClose: () => void;
   imoveisIds: (string | number)[];
}

const ModalComparacaoImoveis: React.FC<ModalComparacaoImoveisProps> = ({
   isOpen,
   onClose,
   imoveisIds,
}) => {
   const [imoveis, setImoveis] = useState<ModelImovelGet[]>([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const buscarImoveis = async () => {
         try {
            const imoveisPromises = imoveisIds.map((id) =>
               buscarImovelPorId(id)
            );
            const imoveisData = await Promise.all(imoveisPromises);
            setImoveis(imoveisData);
         } catch (error) {
            console.error("Erro ao buscar imóveis:", error);
         } finally {
            setLoading(false);
         }
      };

      if (isOpen && imoveisIds.length > 0) {
         buscarImoveis();
      }
   }, [isOpen, imoveisIds]);

   const getMelhorValor = (propriedade: keyof ModelImovelGet) => {
      if (imoveis.length === 0) return null;

      const valores = imoveis.map((imovel) => imovel[propriedade]);
      if (typeof valores[0] === "number") {
         return Math.max(...(valores as number[]));
      }
      return null;
   };

   const renderLinhaComparacao = (
      titulo: string,
      propriedade: keyof ModelImovelGet
   ) => {
      const melhorValor = getMelhorValor(propriedade);

      return (
         <tr className="bg-hav-principal">
            <td className="p-2 border font-medium">{titulo}</td>
            {imoveis.map((imovel, index) => {
               const valor = imovel[propriedade];
               const valorExibido =
                  typeof valor === "number" || typeof valor === "string"
                     ? valor
                     : "-";

               return (
                  <td
                     key={index}
                     className={`p-2 border text-center ${
                        valor === melhorValor ? "bg-green-100" : ""
                     }`}
                  >
                     {valorExibido}
                  </td>
               );
            })}
         </tr>
      );
   };

   if (!isOpen) return null;

   return (
      <Modal isOpen={isOpen} onClose={onClose}>
         <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Comparação de Imóveis</h2>

            {loading ? (
               <div>Carregando...</div>
            ) : (
               <div className="overflow-x-auto">
                  <table className="w-[800px] bg-white">
                     <thead>
                        <tr className="bg-hav-principal">
                           <th className="p-2 border w-[200px]">
                              Característica
                           </th>
                           {imoveis.map((imovel, index) => (
                              <th key={index} className="p-2 border w-[200px]">
                                 {imovel.imagens &&
                                    imovel.imagens.length > 0 && (
                                       <Image
                                          src={imovel.imagens[0].referencia}
                                          alt={imovel.titulo}
                                          width={180}
                                          height={120}
                                          className="w-[180px] h-[120px] object-cover rounded mb-2 mx-auto"
                                       />
                                    )}
                              </th>
                           ))}
                        </tr>
                     </thead>
                     <tbody>
                        {renderLinhaComparacao("Preço", "preco")}
                        {renderLinhaComparacao("Tamanho (m²)", "tamanho")}
                        {renderLinhaComparacao("Quartos", "qtdQuartos")}
                        {renderLinhaComparacao("Banheiros", "qtdBanheiros")}
                        {renderLinhaComparacao("Garagens", "qtdGaragens")}
                        {renderLinhaComparacao("IPTU", "iptu")}
                        {renderLinhaComparacao(
                           "Valor Condomínio",
                           "valorCondominio"
                        )}
                        {renderLinhaComparacao("Piscinas", "qtdPiscina")}
                        {renderLinhaComparacao(
                           "Churrasqueiras",
                           "qtdChurrasqueira"
                        )}
                     </tbody>
                  </table>
               </div>
            )}
         </div>
      </Modal>
   );
};

export default ModalComparacaoImoveis;
