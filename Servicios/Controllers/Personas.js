const express = require('express');
const router = express.Router();
const Personas = require('../Schemas/Personas')

router.get('Listar', async(req,res)=>{
const personas = await Personas.find();
res.status(200).json(personas)
})