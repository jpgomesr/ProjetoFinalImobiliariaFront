"use client"

import FundoBrancoPadrao from '@/components/ComponentesCrud/FundoBrancoPadrao'
import InputPadrao from '@/components/InputPadrao'
import  Layout  from '@/components/layout/LayoutPadrao'
import SubLayoutPaginasCRUD from '@/components/layout/SubLayoutPaginasCRUD'
import SelectPadrao from '@/components/SelectPadrao'
import React, {useState} from 'react'

const page = () => {

  const [nomeCompleto, setNomeCompleto] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const [telefone, setTelefone] = useState("");
  const [imagemPerfil, setImagemPerfil] = useState<File | null>(null);
  const [tipoUsuario, setTipoUsuario] = useState("USUARIO")

  const tiposDeUsuarios = ["USUARIO","ADMINISTRADOR","EDITOR","CORRETOR",];

  return (
    <Layout className='py-0'>
      <SubLayoutPaginasCRUD>
        <FundoBrancoPadrao titulo='Cadastro de usuário' className='w-11/12'> 
            <form className='flex flex-col gap-2
            md:gap-3
            lg:gap-4
            xl:gap-5
            2xl:gap-6'>
                <InputPadrao htmlFor='nome' label='Nome completo' required={true} tipoInput='text' placeholder='Ex:Carlos' onChange={setNomeCompleto} />
                <InputPadrao htmlFor='email' label='E-mail' required={true} tipoInput='text' placeholder='Ex:Carlos@gmail.com' onChange={setEmail} />
                <InputPadrao htmlFor='senha' label='Senha' required={true} tipoInput='password' placeholder='Ex:123C@31s$' onChange={setSenha} />
                <InputPadrao htmlFor='senha' label='Confirmar senha ' required={true} tipoInput='password' placeholder='Digite a senha novamente' onChange={setConfirmaSenha} />
                <InputPadrao htmlFor='telefone' label='Telefone' required={true} tipoInput='text' placeholder='Ex:47912312121' onChange={setTelefone} />
                <InputPadrao htmlFor='nome' label='Nome completo' required={true} tipoInput='text' placeholder='Ex:Carlos' onChange={setNomeCompleto}/>
                <SelectPadrao opcoes={tiposDeUsuarios} onChange={setTipoUsuario} placeholder='Tipo usuario' selecionado={tipoUsuario}/> 
            </form>
            
        </FundoBrancoPadrao>
        </SubLayoutPaginasCRUD>

    </Layout>
  )
}

export default page