import {readFileSync} from 'node:fs';
import {validPhone} from '../src/core.js';
const c=JSON.parse(readFileSync(new URL('../src/content.json',import.meta.url),'utf8'));
if(!validPhone(c.whatsapp)){console.error('Publicação bloqueada: configure whatsapp em src/content.json (55 + DDD + número, sem espaços).');process.exit(1);}
console.log('WhatsApp configurado. Confirme manualmente que pertence à Haro antes de divulgar.');
