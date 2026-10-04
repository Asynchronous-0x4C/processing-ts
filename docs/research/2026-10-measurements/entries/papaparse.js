import Papa from 'papaparse';
console.log(Papa.parse('a,b\n1,2', { header: true }).data);
