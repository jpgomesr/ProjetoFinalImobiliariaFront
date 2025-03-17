"use client";

import { useRouter } from "next/navigation";
import List from "@/components/List";
import InputPadrao from "@/components/InputPadrao";
import Link from "next/link";
import { PlusIcon, SearchIcon } from "lucide-react"; // Importe o ícone de lupa
import { TipoUsuarioEnum } from "@/models/Enum/TipoUsuarioEnum";
import { useState } from "react"; // Adicione o useState para gerenciar o estado temporário

interface FiltrosProps {
   status: string;
   tipoUsuario: string;
   nomePesquisa: string;
}

const opcoesStatus = [
   { id: "Ativo", label: "Ativo" },
   { id: "Desativado", label: "Desativado" },
];

const tiposDeUsuarios = [
   { id: TipoUsuarioEnum.USUARIO, label: "Usuário" },
   { id: TipoUsuarioEnum.CORRETOR, label: "Corretor" },
   { id: TipoUsuarioEnum.ADMINISTRADOR, label: "Administrador" },
   { id: TipoUsuarioEnum.EDITOR, label: "Editor" },
];

export default function Filtros({ status, tipoUsuario, nomePesquisa }: FiltrosProps) {
   const router = useRouter();
   const [pesquisaTemporaria, setPesquisaTemporaria] = useState(nomePesquisa); // Estado temporário para o campo de pesquisa

   const atualizarURL = (novosFiltros: Record<string, string>) => {
      const params = new URLSearchParams({
         status,
         tipoUsuario,
         nomePesquisa: pesquisaTemporaria, // Usa o valor temporário da pesquisa
         ...novosFiltros,
      });
      router.push(`/gerenciamento/usuarios?${params.toString()}`);
   };

   const handlePesquisa = () => {
      atualizarURL({ nomePesquisa: pesquisaTemporaria }); // Atualiza a URL com o valor temporário
   };

   return (
      <div className="grid grid-cols-1 gap-3 w-full md:grid-cols-[1fr_5fr_1fr_1fr] xl:grid-cols-[1fr_6fr_1fr_1fr]">
         <List
            mudandoValor={(value) => atualizarURL({ status: value })}
            opcoes={opcoesStatus}
            bordaPreta
            placeholder="Ativo"
            value={status}
         />
            <InputPadrao
               type="text"
               search
               handlePesquisa={handlePesquisa}
               htmlFor="input-busca-nome"
               onChange={(e) => setPesquisaTemporaria(e.target.value)} // Atualiza o estado temporário
               placeholder="Digite o nome que deseja pesquisar"
               required={false}
               value={pesquisaTemporaria} // Usa o estado temporário
            />

         <div className="flex h-full">
            <List
               opcoes={tiposDeUsuarios}
               mudandoValor={(value) => atualizarURL({ tipoUsuario: value })}
               placeholder="USUARIO"
               bordaPreta
               value={tipoUsuario}
            />
         </div>
         <Link href="/gerenciamento/usuarios/cadastro">
            <button className="flex items-center justify-center bg-havprincipal rounded-md text-white h-full text-sm py-1 px-2 lg:text-base lg:py-2 lg:px-3 2xl:py-3 2xl:px-4">
               Adicionar <PlusIcon className="w-4" />
            </button>
         </Link>
      </div>
   );
}