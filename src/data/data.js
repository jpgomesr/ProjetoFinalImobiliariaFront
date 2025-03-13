export const estados = [
    { id: 1, nome: 'Paraná' },
    { id: 2, nome: 'Rio Grande do Sul' },
    { id: 3, nome: 'Santa Catarina' },
  ];
  
  export const cidades = [
    { id: 1, idEstado: 1, nome: 'Curitiba' },
    { id: 2, idEstado: 1, nome: 'Londrina' },
    { id: 3, idEstado: 2, nome: 'Porto Alegre' },
    { id: 4, idEstado: 2, nome: 'Caxias do Sul' },
    { id: 5, idEstado: 3, nome: 'Jaraguá do Sul' },
    { id: 6, idEstado: 3, nome: 'Guaramirim' },
  ];
  
  export const bairros = [
    // Bairros de Curitiba (idCidade: 1)
    { id: 1, idCidade: 1, nome: 'Batel' },
    { id: 2, idCidade: 1, nome: 'Centro' },
    { id: 3, idCidade: 1, nome: 'Bigorrilho' },
    { id: 4, idCidade: 1, nome: 'Água Verde' },
    { id: 5, idCidade: 1, nome: 'Mercês' },
  
    // Bairros de Londrina (idCidade: 2)
    { id: 6, idCidade: 2, nome: 'Centro' },
    { id: 7, idCidade: 2, nome: 'Jardim Igapó' },
    { id: 8, idCidade: 2, nome: 'Jardim Leonor' },
    { id: 9, idCidade: 2, nome: 'Parque Ouro Verde' },
    { id: 10, idCidade: 2, nome: 'Vila Brasil' },
  
    // Bairros de Porto Alegre (idCidade: 3)
    { id: 11, idCidade: 3, nome: 'Centro Histórico' },
    { id: 12, idCidade: 3, nome: 'Moinhos de Vento' },
    { id: 13, idCidade: 3, nome: 'Bela Vista' },
    { id: 14, idCidade: 3, nome: 'Petrópolis' },
    { id: 15, idCidade: 3, nome: 'Jardim Botânico' },
  
    // Bairros de Caxias do Sul (idCidade: 4)
    { id: 16, idCidade: 4, nome: 'Centro' },
    { id: 17, idCidade: 4, nome: 'São Pelegrino' },
    { id: 18, idCidade: 4, nome: 'Exposição' },
    { id: 19, idCidade: 4, nome: 'Kayser' },
    { id: 20, idCidade: 4, nome: 'Cristo Redentor' },
  
    // Bairros de Jaraguá do Sul (idCidade: 5)
    { id: 21, idCidade: 5, nome: 'Centro' },
    { id: 22, idCidade: 5, nome: 'Vila Lalau' },
    { id: 23, idCidade: 5, nome: 'Nova Brasília' },
    { id: 24, idCidade: 5, nome: 'Chico de Paulo' },
    { id: 25, idCidade: 5, nome: 'Ilha da Figueira' },
  
    // Bairros de Guaramirim (idCidade: 6)
    { id: 26, idCidade: 6, nome: 'Centro' },
    { id: 27, idCidade: 6, nome: 'Vila Nova' },
    { id: 28, idCidade: 6, nome: 'Braço do Ribeirão' },
    { id: 29, idCidade: 6, nome: 'Bananal' },
    { id: 30, idCidade: 6, nome: 'Estrada Jaraguá' },
  ];