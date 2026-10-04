import p5 from 'p5';
new p5((p) => { p.setup = () => p.createCanvas(100, 100); p.draw = () => p.rect(0, 0, 10, 10); });
