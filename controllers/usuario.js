const conexion = require('../database/db');
//MOSTRAR USUARIOS
exports.index = (req, res) => {

    const sql = `SELECT users.id,users.nombre,users.apellido,users.domicilio,users.telefono,COUNT(rentas.id) AS cantidad_rentas
        FROM users LEFT JOIN rentas ON users.id = rentas.usuario_id GROUP BY users.id`;

    conexion.query(sql, (error, results) => {
        if (error) {
            console.log('Error al obtener usuarios:', error);
            return res.status(500).send('Error al obtener los usuarios');
        }
        res.render('index.ejs', {
            results: results
        });
    });
};

// MOSTRAR FORMULARIO PARA CREAR USUARIO
exports.create = (req, res) => {
    res.render('create.ejs');
};

// GUARDAR USUARIO

exports.save = (req, res) => {

    console.log('BODY:', req.body);

    const usuario = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        domicilio: req.body.domicilio,
        telefono: req.body.telefono
    };

    console.log('USUARIO:', usuario);

    conexion.query(
        'INSERT INTO users SET ?',
        usuario,
        (error, results) => {

            if (error) {
                console.error('=================================');
                console.error('ERROR MYSQL:', error);
                console.error('=================================');

                return res.status(500).send(error.sqlMessage || 'Error al guardar el usuario');
            }

            console.log('Usuario guardado:', results);

            res.redirect('/');
        }
    );
};


// =====================================================
// MOSTRAR FORMULARIO PARA EDITAR USUARIO
// =====================================================

exports.edit = (req, res) => {

    const id = req.params.id;

    conexion.query(
        'SELECT * FROM users WHERE id = ?',
        [id],
        (error, results) => {

            if (error) {
                console.log('Error al obtener usuario:', error);
                return res.status(500).send('Error al obtener el usuario');
            }

            if (results.length === 0) {
                return res.status(404).send('Usuario no encontrado');
            }

            res.render('edit.ejs', {
                user: results[0]
            });

        }
    );

};


// =====================================================
// ACTUALIZAR USUARIO
// =====================================================

exports.update = (req, res) => {

    const id = req.body.id;

    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const domicilio = req.body.domicilio;
    const telefono = req.body.telefono;

    const usuario = {
        nombre: nombre,
        apellido: apellido,
        domicilio: domicilio,
        telefono: telefono
    };

    conexion.query(
        'UPDATE users SET ? WHERE id = ?',
        [usuario, id],
        (error, results) => {

            if (error) {
                console.log('Error al actualizar usuario:', error);
                return res.status(500).send('Error al actualizar el usuario');
            }

            res.redirect('/');

        }
    );

};


// ELIMINAR USUARIO
exports.deleteUser = (req, res) => {

    const id = req.params.id;

    conexion.query(
        'DELETE FROM users WHERE id = ?',
        [id],
        (error, results) => {

            if (error) {
                console.log('Error al eliminar usuario:', error);
                return res.status(500).send('Error al eliminar el usuario');
            }

            res.redirect('/');

        }
    );

};
