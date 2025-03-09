import RespostaViaCepModel from "@/models/ResposataViaCepModel"
import { Dispatch, SetStateAction } from "react"

const buscarDadosViaCep = async (cep : string ) : Promise<RespostaViaCepModel> => {

        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
    
          const data = await response.json()
          
          return data as RespostaViaCepModel
}

type CamposDesabilitados = {
    cidadeDesabilitada: boolean;
    bairroDesabilitado: boolean;
    ruaDesabilitada: boolean;
    estadoDesabilitado: boolean;
 };
 
type SetValueFunction<T> = (campo: keyof T, valorCampo: T[keyof T]) => void;

export const restaurarCampos = <T>(setCamposDesabilitados :  Dispatch<SetStateAction<CamposDesabilitados>>,  setValue : SetValueFunction<T>) => {
     
    setCamposDesabilitados((prevItens : CamposDesabilitados) => ({
        ...prevItens, 
        cidadeDesabilitada : true,
        bairroDesabilitado  : true,
        ruaDesabilitada  : true ,
        estadoDesabilitado : true
      
      }))
      setValue("cidade" as keyof T, "" as T[keyof T]);
      setValue("bairro" as keyof T, "" as T[keyof T]);
      setValue("rua" as keyof T, "" as T[keyof T]);
      setValue("estado" as keyof T, "" as T[keyof T]);
}
export const preencherCampos =  async <T>(cep : string, setCamposDesabilitados :  Dispatch<SetStateAction<CamposDesabilitados>>,  setValue : SetValueFunction<T>, editanto? : boolean) => {

    const respostaViaCep = await buscarDadosViaCep(cep); 

    if(respostaViaCep?.bairro){
      setValue("bairro" as keyof T, respostaViaCep.bairro as T[keyof T])
      setCamposDesabilitados((prevItens) => ({
        ...prevItens,
        bairroDesabilitado : true

      }))
    }
    else{
      setCamposDesabilitados((prevItens) => ({
        ...prevItens,
        bairroDesabilitado : false

      }))
      editanto ?? setValue("bairro" as keyof T, "" as T[keyof T]);
    }
    if(respostaViaCep?.localidade){
      setValue("cidade" as keyof T, respostaViaCep.localidade as T[keyof T])
      setCamposDesabilitados((prevItens) => ({
        ...prevItens,
        cidadeDesabilitada : true

      }))
    }
    else{
      setCamposDesabilitados((prevItens) => ({
        ...prevItens,
        cidadeDesabilitada : false

      }))
      editanto ?? setValue("cidade" as keyof T, "" as T[keyof T]);

    }
    if(respostaViaCep?.logradouro){
      setValue("rua" as keyof T, respostaViaCep.logradouro as T[keyof T]);
      setCamposDesabilitados((prevItens) => ({
        ...prevItens,
        ruaDesabilitada : true

      }))
    }
    else {
      setCamposDesabilitados((prevItens) => ({
        ...prevItens,
        ruaDesabilitada : false

      }))
      editanto ?? setValue("rua" as keyof T, "" as T[keyof T]);
    }
    if(respostaViaCep?.estado){
      setValue("estado" as keyof T, respostaViaCep.estado as T[keyof T]);
      setCamposDesabilitados((prevItens) => ({
        ...prevItens,
        estadoDesabilitado : true

      }))
    }
    else{
      setCamposDesabilitados((prevItens) => ({
        ...prevItens,
        estadoDesabilitado : false

      }))
      editanto ?? setValue("estado" as keyof T, "" as T[keyof T]);
    }


}