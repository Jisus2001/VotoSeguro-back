import http from 'k6/http';
import { check } from 'k6';

export let options = {
    vus: 3,
    duration: '10s',
    thresholds: {
        http_req_failed: ['rate<0.01'],
        http_req_duration: ['p(95)<1000']
    }
};

export default function () {
    const url = "http://localhost:80/Personas/ValidarSesion";

    const payload = JSON.stringify({
        Identificacion: "101010101",       // Usuario real de tu base
        Contrasenna: "123456789"            // Ajusta a tus datos
    });

    const headers = { 'Content-Type': 'application/json' };

    let res = http.post(url, payload, { headers });

    check(res, {
        "status es 200": r => r.status === 200,
        "responde token": r => r.json("token") !== undefined
    });
}
