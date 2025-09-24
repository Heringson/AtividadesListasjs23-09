import { Entrada } from './DeclaracaoDeVariaveis';

const entrada: Entrada = {
  placa: 'ABC1234',
  modelo: 'Fusca',
  cor: 'Azul',
  horaEntrada: new Date().toISOString(),
  valorHora: 5.0
};

console.log(entrada);
