export const UseErros = (data : any) => {


        const errosFormatados = data.erros.reduce(
           (acc: any, erro: any) => {
              acc[erro.campo] = erro.erro || "Erro desconhecido";
              return acc;
           },
           {}
        );

        return errosFormatados;
     

}