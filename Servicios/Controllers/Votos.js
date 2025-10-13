import express from 'express';
import Votos from '../Schemas/Votos.js';
import mongoose from 'mongoose';

const router = express.Router();

router.post('/Registrar', async (req, res) => {
    try {
        const { Identificacion, EleccionId, CandidatoId } = req.body;
        
        // Verifica si ya votó en esa elección
        const yaVoto = await Votos.findOne({ Identificacion, EleccionId });
        if (yaVoto) {
            return res.status(400).json({ 
                mensaje: 'Esta persona ya ha emitido su voto en esta elección.' 
            });
        }

        const voto = new Votos({ Identificacion, EleccionId, CandidatoId });
        await voto.save();
        
        res.status(200).json({ 
            mensaje: 'Voto registrado exitosamente.',
            voto 
        });
    } catch (error) {
        res.status(500).json({ 
            mensaje: 'Error al registrar el voto.', 
            error: error.message 
        });
    }
});

router.get('/PorEleccion/:EleccionId', async (req, res) => {
    try {
        const resultados = await Votos.aggregate([
            { 
                $match: { 
                    EleccionId: new mongoose.Types.ObjectId(req.params.EleccionId) 
                } 
            },
            {
                $group: {
                    _id: '$CandidatoId',
                    totalVotos: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'candidatos',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'candidato'
                }
            },
            {
                $unwind: '$candidato'
            },
            {
                $project: {
                    _id: 0,
                    candidato: {
                        nombre: '$candidato.Nombre',
                        partido: '$candidato.Partido'
                    },
                    totalVotos: 1
                }
            }
        ]);

        res.status(200).json({
            mensaje: 'Resultados de la elección',
            resultados
        });
    } catch (error) {
        res.status(500).json({ 
            mensaje: 'Error al consultar los resultados.', 
            error: error.message 
        });
    }
});

router.get('/PorPersona/:Identificacion', async (req, res) => {
    try {
        const votos = await Votos.find({ Identificacion: req.params.Identificacion })
            .populate('EleccionId', 'Nombre')
            .populate('CandidatoId', 'Nombre');
        res.status(200).json(votos);
    } catch (error) {
        res.status(500).json({ 
            mensaje: 'Error al consultar los votos.', 
            error: error.message 
        });
    }
});

export default router;