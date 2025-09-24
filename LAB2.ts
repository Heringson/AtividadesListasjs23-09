import * as fs from 'fs';
import { Entrada } from './DeclaracaoDeVariaveis';

const entradas: Entrada[] = JSON.parse(fs.readFileSync('./csv/entradas.csv', 'utf-8'));
console.log(entradas);
