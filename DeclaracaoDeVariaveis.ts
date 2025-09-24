export interface Entrada {
  placa: string;
  modelo: string;
  cor: string;
  horaEntrada: string;
  valorHora: number;
}

export interface Saida {
  placa: string;
  horaEntrada: string;
  horaSaida: string;
  tempoEstacionado: number;
  valorTotal: number;
}

export interface ResumoDiario {
  data: string;
  totalEntradas: number;
  totalSaidas: number;
  totalArrecadado: number;
}
