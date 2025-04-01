export type TipoPerguntaEnum =
   | "LOGIN_OU_CADASTRO"
   | "PAGAMENTOS"
   | "PROMOCOES"
   | "OUTROS";

export default class ModelPergunta {
   id?: number;
   tipoPergunta: TipoPerguntaEnum;
   email: string;
   telefone: string;
   nome: string;
   mensagem: string;

   constructor() {
      this.tipoPergunta = "OUTROS";
      this.email = "";
      this.telefone = "";
      this.nome = "";
      this.mensagem = "";
   }
}
