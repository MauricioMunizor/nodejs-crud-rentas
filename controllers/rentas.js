// Importamos la conexión con nuestra base de datos
const conexion = require('../database/db');



// MOSTRAR RENTAS DE UN USUARIO
exports.rentas = (req, res) => {

    const id = req.params.id;

    const sql = `
        SELECT 
            rentas.id,
            rentas.usuario_id,
            rentas.fecha_renta,
            rentas.fecha_evento,
            rentas.hora_entrega,
            rentas.hora_recogida,
            rentas.direccion_evento,
            rentas.total,
            rentas.anticipo,
            rentas.saldo,
            rentas.estado
        FROM rentas
        INNER JOIN users 
            ON rentas.usuario_id = users.id
        WHERE users.id = ?
    `;

    conexion.query(
        sql,
        [id],
        (error, results) => {

            if (error) {
                console.log('Error al obtener las rentas:', error);
                return res.status(500).send('Error al obtener las rentas');
            }

            res.render('rentas.ejs', {
                results: results,
                usuario_id: id
            });

        }
    );

};


// MOSTRAR FORMULARIO PARA CREAR RENTA
exports.createRenta = (req, res) => {
    const id = req.params.id;

    res.render('createRenta.ejs', {
        usuario_id: id
    });
};

// ACTUALIZAR RENTA
exports.updateRenta = (req, res) => {

    const id = req.body.id;
    const usuario_id = req.body.usuario_id;

    const renta = {
        fecha_renta: req.body.fecha_renta,
        fecha_evento: req.body.fecha_evento,
        hora_entrega: req.body.hora_entrega,
        hora_recogida: req.body.hora_recogida,
        direccion_evento: req.body.direccion_evento,
        total: req.body.total,
        anticipo: req.body.anticipo,
        saldo: req.body.saldo,
        estado: req.body.estado
    };

    conexion.query(
        'UPDATE rentas SET ? WHERE id = ?',
        [renta, id],
        (error, results) => {

            if (error) {
                console.log('Error al actualizar renta:', error);
                return res.status(500).send('Error al actualizar la renta');
            }

            res.redirect('/rentas/' + usuario_id);
        }
    );
};

// MOSTRAR FORMULARIO PARA EDITAR RENTA
// MOSTRAR FORMULARIO PARA EDITAR RENTA
exports.editRenta = (req, res) => {

    const id = req.params.id;

    conexion.query(
        'SELECT * FROM rentas WHERE id = ?',
        [id],
        (error, results) => {

            if (error) {
                console.log('Error al obtener renta:', error);
                return res.status(500).send('Error al obtener la renta');
            }

            if (results.length === 0) {
                return res.status(404).send('Renta no encontrada');
            }

            const renta = results[0];

            // Convertir fechas al formato YYYY-MM-DD
            if (renta.fecha_renta) {
                renta.fecha_renta = new Date(renta.fecha_renta)
                    .toISOString()
                    .split('T')[0];
            }

            if (renta.fecha_evento) {
                renta.fecha_evento = new Date(renta.fecha_evento)
                    .toISOString()
                    .split('T')[0];
            }

            res.render('editRenta.ejs', {
                renta: renta
            });

        }
    );
};




// GUARDAR RENTA
exports.saveRenta = (req, res) => {

    const usuario_id = req.body.usuario_id;
    const fecha_renta = req.body.fecha_renta;
    const fecha_evento = req.body.fecha_evento;
    const hora_entrega = req.body.hora_entrega;
    const hora_recogida = req.body.hora_recogida;
    const direccion_evento = req.body.direccion_evento;
    const total = req.body.total;
    const anticipo = req.body.anticipo;
    const saldo = req.body.saldo;
    const estado = req.body.estado;

    const renta = {
        usuario_id: usuario_id,
        fecha_renta: fecha_renta,
        fecha_evento: fecha_evento,
        hora_entrega: hora_entrega,
        hora_recogida: hora_recogida,
        direccion_evento: direccion_evento,
        total: total,
        anticipo: anticipo,
        saldo: saldo,
        estado: estado
    };

    conexion.query(
        'INSERT INTO rentas SET ?',
        renta,
        (error, results) => {

            if (error) {
                console.log('Error al guardar renta:', error);
                return res.status(500).send('Error al guardar la renta');
            }

            res.redirect(`/rentas/${usuario_id}`);

        }
    );

};

//EDITAR RENTA


// ELIMINAR RENTA
// ELIMINAR RENTA
exports.deleteRenta = (req, res) => {
    const id = req.params.id;

    conexion.query(
        'SELECT usuario_id FROM rentas WHERE id = ?',
        [id],
        (error, results) => {

            if (error) {
                console.log('Error al buscar la renta:', error);
                return res.status(500).send('Error al buscar la renta');
            }

            if (results.length === 0) {
                return res.status(404).send('Renta no encontrada');
            }

            const usuario_id = results[0].usuario_id;

            conexion.query(
                'DELETE FROM rentas WHERE id = ?',
                [id],
                (error) => {

                    if (error) {
                        console.log('Error al eliminar renta:', error);
                        return res.status(500).send('Error al eliminar la renta');
                    }

                    res.redirect(`/rentas/${usuario_id}`);
                }
            );
        }
    );
};
