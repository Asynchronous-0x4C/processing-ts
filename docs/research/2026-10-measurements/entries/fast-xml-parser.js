import { XMLParser } from 'fast-xml-parser';
console.log(new XMLParser({ ignoreAttributes: false }).parse('<a x="1"><b>t</b></a>'));
