import { calculateAverageDeliveryDistance } from "../impactCalculations.js";

const RUNS = Number(process.argv[2] || 30);
const REPEAT = Number(process.argv[3] || 10);

function now(){ return process.hrtime.bigint(); }

let times = [];
for (let i = 0; i < RUNS; i++) {
    const t0 = now();
    for (let r = 0; r < REPEAT; r++) { /* eslint-disable no-await-in-loop */
        await calculateAverageDeliveryDistance();
    }
    const t1 = now();
    times.push(Number(t1 - t0) / 1e6); // ms
}

const avg = times.reduce((a,b)=>a+b,0)/times.length;
const p95 = [...times].sort((a,b)=>a-b)[Math.floor(times.length*0.95)-1];
console.log(JSON.stringify({ runs: RUNS, repeat: REPEAT, avg_ms:+avg.toFixed(2), p95_ms:+p95.toFixed(2) }));
