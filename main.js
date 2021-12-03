import fs from 'fs';
import moment from 'moment';
import { all } from './import.js';

const hardCodeDay = null;
const hardCodeYear = null;

const today = moment(Date.now());
const adventOfCodeYear = hardCodeYear || today.format('yyyy');
const adventOfCodeDay = hardCodeDay || today.format('DD')

const prog = all[`code_${adventOfCodeYear}_${adventOfCodeDay}`];
const content = fs.readFileSync(`./input/${adventOfCodeYear}/${adventOfCodeDay}.txt`, 'utf-8');
prog(content);
