export interface ModelAgendamento {
    id: number;
    horario: string;
    endereco: {
        cidade: string;
        bairro: string;
        rua: string;
        numeroCasaPredio: string;
    }
    corretor : {
        id: number;
        nome: string;
    };
    usuario : {
        id: number;
        nome: string;
    };
    idImovel: number;
    referenciaImagemPrincipal: string;
    status : "PENDENTE" | "CONFIRMADO" | "CANCELADO";
}
