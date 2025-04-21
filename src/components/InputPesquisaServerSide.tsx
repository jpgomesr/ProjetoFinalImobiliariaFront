"use client";

import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react'
import InputPadrao from './InputPadrao';


interface InputPesquisaServerSideProps {
    url: string;
    nomeAributo: string;
    placeholder: string;
    bordaPreta?: boolean;
    value: string;

}

const InputPesquisaServerSide = (props: InputPesquisaServerSideProps) => {

    const router = useRouter();
    const searchParams = useSearchParams();
    const [valorMomento, setValorMomento] = useState<string>(   
       props.value || ""
    );
 
    const atualizarURL = (valor: string) => {
       const params = new URLSearchParams(searchParams.toString());
 
       if (valor) {
          params.set(`${props.nomeAributo}`, valor);
       } else {
          params.delete(`${props.nomeAributo}`);
       }
 
       router.push(`${props.url}?${params.toString()}`);
    };
 


  return (
    <InputPadrao
    type="text"
    placeholder={props.placeholder}
    search={true}
    className="w-full"
    value={valorMomento}
    onChange={(e) => {
        setValorMomento(e.target.value);
    }}
    handlePesquisa={() => {
        atualizarURL(valorMomento);
    }}
    />
  )
}

export default InputPesquisaServerSide