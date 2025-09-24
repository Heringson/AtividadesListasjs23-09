import { Entrada, Saida, ResumoDiario } from './DeclaracaoDeVariaveis';
import * as fs from 'fs';
import * as readlineSync from 'readline-sync';

const caminhoEntradas = './csv/entradas.csv';
const caminhoAtivos = './csv/ativos.csv';
const caminhoSaidas = './csv/saidas.csv';
const caminhoResumo = './csv/resumo_diario.txt';

function registrarEntrada(): void {
  const placa = readlineSync.question('Placa do veículo: ').toUpperCase();
  const modelo = readlineSync.question('Modelo do veículo: ');
  const cor = readlineSync.question('Cor do veículo: ');
  const horaEntrada = new Date().toISOString();
  const valorHora = readlineSync.questionFloat('Valor da hora (R$): ');

  const entrada: Entrada = { placa, modelo, cor, horaEntrada, valorHora };
  fs.appendFileSync(caminhoEntradas, `${JSON.stringify(entrada)}\n`);
  fs.appendFileSync(caminhoAtivos, `${placa}\n`);
  console.log('Entrada registrada com sucesso!');
}

function registrarSaida(): void {
  const placa = readlineSync.question('Placa do veículo: ').toUpperCase();
  const ativo = fs.readFileSync(caminhoAtivos, 'utf-8').split('\n').includes(placa);

  if (!ativo) {
    console.log('Veículo não encontrado no estacionamento.');
    return;
  }

  const horaSaida = new Date().toISOString();
  const entradas = fs.readFileSync(caminhoEntradas, 'utf-8').split('\n').map(line => JSON.parse(line));
  const entrada = entradas.find((e: Entrada) => e.placa === placa);

  if (!entrada) {
    console.log('Entrada não encontrada.');
    return;
  }

  const tempoEstacionado = (new Date(horaSaida).getTime() - new Date(entrada.horaEntrada).getTime()) / 1000 / 60 / 60;
  const valorTotal = tempoEstacionado * entrada.valorHora;

  const saida: Saida = { placa, horaEntrada: entrada.horaEntrada, horaSaida, tempoEstacionado, valorTotal };
  fs.appendFileSync(caminhoSaidas, `${JSON.stringify(saida)}\n`);
  fs.writeFileSync(caminhoAtivos, fs.readFileSync(caminhoAtivos, 'utf-8').split('\n').filter(p => p !== placa).join('\n'));
  console.log(`Saída registrada. Valor a pagar: R$ ${valorTotal.toFixed(2)}`);
}

function consultarResumo(): void {
  const resumo = fs.readFileSync(caminhoResumo, 'utf-8');
  console.log('Resumo Diário:\n', resumo);
}

function menu(): void {
  const opcao = readlineSync.keyInSelect(['Registrar Entrada', 'Registrar Saída', 'Consultar Resumo', 'Sair'], 'Escolha uma opção: ');

  switch (opcao) {
    case 0:
      registrarEntrada();
      break;
    case 1:
      registrarSaida();
      break;
    case 2:
      consultarResumo();
      break;
    case 3:
      console.log('Saindo...');
      return;
    default:
      console.log('Opção inválida.');
  }

  menu();
}

menu();
