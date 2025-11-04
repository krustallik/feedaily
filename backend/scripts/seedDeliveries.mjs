import db from "../database.js";

const N = Number(process.argv[2] || 10000);
// Bratislava centrum
const BASE_LAT = 48.1486, BASE_LNG = 17.1077;

function jitter(km) {
    // ~1° lat ~ 111km, lng škálujeme cos(lat)
    const dlat = (Math.random() - 0.5) * (km / 111);
    const dlng = (Math.random() - 0.5) * (km / (111 * Math.cos(BASE_LAT * Math.PI/180)));
    return [dlat, dlng];
}

db.serialize(() => {
    db.run("DELETE FROM donations"); // čistý štart
    const stmt = db.prepare(`INSERT INTO donations
    (userId, donorName, status, locationLat, locationLng, requesterLat, requesterLng, deliveredAt)
    VALUES (1,'seed','Delivered', ?, ?, ?, ?, datetime('now'))`);
    for (let i = 0; i < N; i++) {
        const [j1a, j1b] = jitter(20); // donor ±20 km
        const [j2a, j2b] = jitter(20); // receiver ±20 km
        stmt.run(BASE_LAT + j1a, BASE_LNG + j1b, BASE_LAT + j2a, BASE_LNG + j2b);
    }
    stmt.finalize(() => { console.log(`Seeded ${N} delivered donations`); process.exit(0); });
});
