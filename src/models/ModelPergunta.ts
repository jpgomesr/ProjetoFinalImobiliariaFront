export default interface ModelPergunta {
   titulo: string;
   tipoPergunta: string;
   email: string;
   telefone: string;
   nome: string;
   mensagem: string;
   data: Date;
   perguntaRespondida: boolean;
   resposta?: string;
   idAdministrador?: string;
   idEditor?: string;
}
