"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var readlineSync = require("readline-sync");
var caminhoEntradas = './csv/entradas.csv';
var caminhoAtivos = './csv/ativos.csv';
var caminhoSaidas = './csv/saidas.csv';
var caminhoResumo = './csv/resumo_diario.txt';
function registrarEntrada() {
    var placa = readlineSync.question('Placa do veículo: ').toUpperCase();
    var modelo = readlineSync.question('Modelo do veículo: ');
    var cor = readlineSync.question('Cor do veículo: ');
    var horaEntrada = new Date().toISOString();
    var valorHora = readlineSync.questionFloat('Valor da hora (R$): ');
    var entrada = { placa: placa, modelo: modelo, cor: cor, horaEntrada: horaEntrada, valorHora: valorHora };
    fs.appendFileSync(caminhoEntradas, "".concat(JSON.stringify(entrada), "\n"));
    fs.appendFileSync(caminhoAtivos, "".concat(placa, "\n"));
    console.log('Entrada registrada com sucesso!');
}
function registrarSaida() {
    var placa = readlineSync.question('Placa do veículo: ').toUpperCase();
    var ativo = fs.readFileSync(caminhoAtivos, 'utf-8').split('\n').includes(placa);
    if (!ativo) {
        console.log('Veículo não encontrado no estacionamento.');
        return;
    }
    var horaSaida = new Date().toISOString();
    var entradas = fs.readFileSync(caminhoEntradas, 'utf-8').split('\n').map(function (line) { return JSON.parse(line); });
    var entrada = entradas.find(function (e) { return e.placa === placa; });
    if (!entrada) {
        console.log('Entrada não encontrada.');
        return;
    }
    var tempoEstacionado = (new Date(horaSaida).getTime() - new Date(entrada.horaEntrada).getTime()) / 1000 / 60 / 60;
    var valorTotal = tempoEstacionado * entrada.valorHora;
    var saida = { placa: placa, horaEntrada: entrada.horaEntrada, horaSaida: horaSaida, tempoEstacionado: tempoEstacionado, valorTotal: valorTotal };
    fs.appendFileSync(caminhoSaidas, "".concat(JSON.stringify(saida), "\n"));
    fs.writeFileSync(caminhoAtivos, fs.readFileSync(caminhoAtivos, 'utf-8').split('\n').filter(function (p) { return p !== placa; }).join('\n'));
    console.log("Sa\u00EDda registrada. Valor a pagar: R$ ".concat(valorTotal.toFixed(2)));
}
function consultarResumo() {
    var resumo = fs.readFileSync(caminhoResumo, 'utf-8');
    console.log('Resumo Diário:\n', resumo);
}
function menu() {
    var opcao = readlineSync.keyInSelect(['Registrar Entrada', 'Registrar Saída', 'Consultar Resumo', 'Sair'], 'Escolha uma opção: ');
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
