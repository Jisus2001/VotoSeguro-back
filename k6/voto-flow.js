import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    vus: 20,
    duration: '30s',
    thresholds: {
        http_req_failed: ['rate<0.02'],    // Máximo 2% errores
        http_req_duration: ['p(95)<1200'], // 95% < 1.2s
    }
};

export default function () {

    // LOGIN
    let login = http.post(
        "http://localhost:3000/Personas/ValidarSesion",
        JSON.stringify({
            Identificacion: "101",
            Contrasena: "123"
        }),
        { headers: { "Content-Type": "application/json" }}
    );

    check(login, { "login OK": r => r.status === 200 });

    const token = login.json().token;

    // CONSULTA DE CANDIDATOS (HU5)
    let candidatos = http.get(
        "http://localhost:3000/Candidatos/Listar",
        { headers: { 
            Authorization: Bearer ${token},
            authorization: Bearer ${token}
        }}
    );

    const lista = candidatos.json();

    check(candidatos, {
        "lista OK": r => r.status === 200,
        "devuelve datos": r => Array.isArray(lista) && lista.length > 0
    });

    const candidato = lista[0];

    // EMITIR VOTO (HU6)
    let voto = http.post(
        "http://localhost:3000/Votos/Registrar",
        JSON.stringify({
            Identificacion: "101",
            EleccionId: "67398533c4f44edce3521fba", 
            CandidatoId: candidato._id
        }),
        {
            headers: {
                Authorization: Bearer ${token},
                authorization: Bearer ${token},
                "Content-Type": "application/json"
            }
        }
    );

    check(voto, {
        "voto OK": r => r.status === 200 || r.status === 400
    });

    sleep(1);
}