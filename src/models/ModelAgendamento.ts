export interface ModelAgendamento {
    horario: string;
    endereco: {
        cidade: string;
        bairro: string;
        rua: string;
        numeroCasaPredio: string;
    }
    nomeUsuario: string;
    idImovel: number;
    referenciaImagemPrincipal: string;
}
