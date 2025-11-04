import db from "../database.js";
import { calculateDistance } from "../geocodeHelper.js";

const RUNS = Number(process.argv[2] || 20);
const REPEAT = Number(process.argv[3] || 5);

function now(){ return process.hrtime.bigint(); }

const rows = await new Promise((resolve, reject)=>{
    db.all("SELECT locationLat, locationLng, requesterLat, requesterLng FROM donations WHERE status='Delivered'",
        (e, r)=> e ? reject(e) : resolve(r));
});

let times=[];
for (let i=0;i<RUNS;i++){
    const t0 = now();
    for (let k=0;k<REPEAT;k++){
        let sum=0;
        for (let j=0;j<rows.length;j++){
            const r = rows[j];
            sum += calculateDistance(r.locationLat, r.locationLng, r.requesterLat, r.requesterLng);
        }
    }
    const t1 = now();
    times.push(Number(t1 - t0)/1e6);
}
const avg = times.reduce((a,b)=>a+b,0)/times.length;
const p95 = [...times].sort((a,b)=>a-b)[Math.floor(times.length*0.95)-1];
console.log(JSON.stringify({ runs: RUNS, repeat: REPEAT, avg_ms:+avg.toFixed(2), p95_ms:+p95.toFixed(2) }));
