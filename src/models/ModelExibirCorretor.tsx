export default class ExibirCorretor {
    id: number
    nome: string
    foto: string
    agendamentos: number;
    constructor(
       id: number,
       nome: string,
       foto: string,
       agendamentos: number
    ) {
       this.id = id
       this.nome = nome
       this.foto = foto
       this.agendamentos = agendamentos
    }
 }