export interface ModelAgendamento {
    idCorretor: number;
    idUsuario: number;
    id: number;
    horario: string;
    endereco: {
        cidade: string;
        bairro: string;
        rua: string;
        numeroCasaPredio: string;
    }
    nomeCorretor: string;
    nomeUsuario: string;
    idImovel: number;
    referenciaImagemPrincipal: string;
    status : "PENDENTE" | "CONFIRMADO" | "CANCELADO";
}
