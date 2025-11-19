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

// Múltiples usuarios válidos (requisito de la consigna)
const usuarios = [
    { Identificacion: "101010101", Contrasenna: "123456789" },
    { Identificacion: "202020202", Contrasenna: "123456789" },
    { Identificacion: "303030303", Contrasenna: "123456789" }
];

export default function () {

    // 1. Seleccionar usuario aleatorio
    const user = usuarios[Math.floor(Math.random() * usuarios.length)];

    // LOGIN
    let login = http.post(
        "http://localhost:80/Personas/ValidarSesion",
        JSON.stringify(user),
        { headers: { "Content-Type": "application/json" }}
    );

    check(login, { 
        "login OK": r => r.status === 200 
    });

    const token = login.json().token;

    // 2. CONSULTA DE CANDIDATOS
    let candidatos = http.get(
        "http://localhost:80/Candidatos/Listar",
        { headers: { Authorization: "Bearer " + token }}
    );

    const lista = candidatos.json();

    check(candidatos, {
        "lista OK": r => r.status === 200,
        "tiene candidatos": r => Array.isArray(lista) && lista.length > 0
    });

    // Seleccionar candidato aleatorio
    const candidato = lista[Math.floor(Math.random() * lista.length)];

    // 3. EMITIR VOTO
    let voto = http.post(
        "http://localhost:80/Votos/Registrar",
        JSON.stringify({
            Identificacion: user.Identificacion,
            EleccionId: "67398533c4f44edce3521fba",
            CandidatoId: candidato._id
        }),
        {
            headers: {
                Authorization: "Bearer " + token,
                "Content-Type": "application/json"
            }
        }
    );

    check(voto, {
        "voto registrado correctamente": r => r.status === 200 ||
            (r.status === 400 && r.body.includes("Esta persona ya ha emitido su voto en esta elección"))
    });

    sleep(1);
}
