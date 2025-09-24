"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var entradas = JSON.parse(fs.readFileSync('./csv/entradas.csv', 'utf-8'));
console.log(entradas);
