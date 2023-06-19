const { Router } = require('express');
const { check } = require('express-validator');

const {
    getTicket,
    putTicket,
    postTicket,
    getTicketLong
} = require('../controllers/ticket');

const {
    postNote,
    getNote
} = require('../controllers/notes');

const { existeTicket, validarBodyPutTicket, validarBodyPostTicket, validarBodyPostNote } = require('../helpers/serDeskValidator');
const { validarCampos } = require('../middlewares/validarCampos');
// const { validarJWT } = require('../middlewares/validarJWT');

const { validarAuth } = require('../middlewares/validarAuth');

const router = Router();

router.get('/:id', [
    // validarJWT,
    validarAuth,
    validarCampos
] , 
getTicket );

router.get('/longid/:id',[

    validarAuth,
    check('id','El id es un campo obligatorio').not().isEmpty(),
    check('id','El id debe de ser numérico').isNumeric(),
    validarCampos,
],

getTicketLong);

router.get( '/' , 
[
    // validarJWT,
    validarAuth,
    validarCampos
], 
getTicket);

router.put('/:id', 
[
    // validarJWT,
    validarAuth,
    check( 'id' , 'No es un id válido' ).isLength( {min : 15} ),
    validarBodyPutTicket,
    validarCampos
],
putTicket );

router.post('/',
[
    // validarJWT,
    validarAuth,
    validarBodyPostTicket,
    validarCampos
],
postTicket );




//NOTES
router.post('/:id/notes',
[
    // validarJWT,
    validarAuth,
    validarBodyPostNote,
    validarCampos
],
postNote);
//NOTES
router.get('/:id/notes',
[
    // validarJWT,
    validarAuth,
    check( 'id' , 'El id es obligatorio' ).not().isEmpty(),
    validarCampos
],
getNote);


router.all('*',(req,res) =>{
    res.send('404 | Page Not Found');
});



module.exports = router;

