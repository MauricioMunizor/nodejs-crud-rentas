const express = require('express');
const router = express.Router();

const usuario = require('./controllers/usuario');
const rentas = require('./controllers/rentas');


// Mostrar usuarios
router.get('/', usuario.index);

// Mostrar formulario para crear usuario
router.get('/create', usuario.create);

// Mostrar formulario para editar usuario
router.get('/edit/:id', usuario.edit);

// Eliminar usuario
router.get('/delete/:id', usuario.deleteUser);

// RENTAS---

// Mostrar rentas de un usuario
router.get('/rentas/:id', rentas.rentas);

// Mostrar formulario para crear renta
router.get('/createRenta/:id', rentas.createRenta);

//mostrar formulario para editar renta
router.get('/editRenta/:id', rentas.editRenta);

// Eliminar renta
router.get('/deleteRenta/:id', rentas.deleteRenta);


// POST

// Guardar usuario
router.post('/save', usuario.save);

// Guardar renta
router.post('/saveRenta', rentas.saveRenta);

// Actualizar usuario
router.post('/update', usuario.update);
// Actualizar renta
router.post('/updateRenta', rentas.updateRenta);



module.exports = router;