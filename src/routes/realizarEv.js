const express = require('express');

const router = express.Router();

const pool = require('../database');




router.get('/' ,  async (req,res) => { 

    const productores = await pool.query('SELECT * FROM "Productor"');

    const text = 'SELECT  l.nombre_pais FROM "Pais" as l,  "Pai_Prod" as a, "Productor" as t where a.id_pais=l.id_pais and t.id_productor=a.id_productor and t.id_productor=$1';

    var value = [1];

    const paises = await pool.query(text,value);

    console.log(paises.rows);

    res.render('realizarEv/paso1', {productor : productores.rows, paises: paises.rows});

});

router.post('/2' ,  async (req,res) => { 
   
    const data = req.body.productor;
    
    const data2 = req.body.tipo;

    const pais = req.body.pais;

    const texto = 'SELECT * FROM "Productor" WHERE nombre_productor = $1';
    
    var value1 = [];

    value1.push(data);

    const productores = await pool.query(texto,value1);

    const productor = productores.rows;

    var text = 'SELECT  p.nombre_proveedor FROM "Proveedor" as p, "Pais" as l, "Metodo_Envio" e, "Pai_Prod" as a, "Productor" as t, "Historico_Membresia" as h where p.id_proveedor=e.id_proveedor and l.id_pais=e.id_pais and e.id_pais=a.id_pais and t.id_productor=a.id_productor and t.id_productor= $1 and e.id_pais= $2 and h.id_proveedor=p.id_proveedor and h.fecha_fin is null';

    const results = await pool.query(text,[1,5]);

    console.log(results.rows);

    res.render('realizarEv/paso2', { proveedor : results.rows , productor: productor[0] , pais: pais});

    // Hasta aqui llega la consulta de proveedor 



});

router.post('/3' ,  async (req,res) => { 
   
    const data = req.body.proveedor;
    
    const data2 = req.body.productor;

    const texto = 'SELECT * FROM "Proveedor" WHERE nombre_proveedor = $1';
    
    var value1 = [];

    value1.push(data);

    const proveedor = await pool.query(texto,value1);

    const texto2 = 'SELECT * FROM "Productor" WHERE id_productor = $1';
    
    var value2 = [];

    value2.push(data2);

    const productor = await pool.query(texto2,value2);

    const prove = proveedor.rows;
    
    var text = 'SELECT c.* from "Proveedor" as p, "Condicion_Pago" as c where p.id_proveedor=c.id_proveedor and p.id_proveedor= $1';
    
    var value = [prove[0].id_proveedor];

    const results = await pool.query(text,value);

    res.render('realizarEv/paso3', { pagos : results.rows , proveedor : proveedor.rows , productor: productor.rows});

    // Hasta aqui llega la consulta de proveedor 


});






router.post('/4' ,  async (req,res) => { 
   
    const id_pago  = req.body.pago;

    const id_productor = req.body.productor;

    const id_proveedor = req.body.proveedor;

    const textoMetodo = 'SELECT e.*from "Proveedor" as p, "Metodo_Envio" as e where p.id_proveedor=e.id_proveedor and p.id_proveedor= $1';
 
    var valueMetodo = [];

    valueMetodo.push(id_proveedor);

    const rmetodos = await pool.query(textoMetodo,valueMetodo);

    const metodos = rmetodos.rows;

    console.log(metodos);

    const texto2 = 'SELECT * FROM "Proveedor" WHERE id_proveedor = $1';
    
    var value2 = [];

    value2.push(id_proveedor);

    const proveedor = await pool.query(texto2,value2);

    console.log(proveedor.rows);



    /* 
    const texto = 'SELECT * FROM "Productor" WHERE nombre_productor = $1';
    
    var value1 = [];

    value1.push(data2);

    const productores = await pool.query(texto,value1);

    const productor = productores.rows;
    
    console.log(results.rows);*/

    res.render('realizarEv/paso4', {envios: metodos ,pago: id_pago , productor: id_productor, proveedor: proveedor.rows });

    // Hasta aqui llega la consulta de proveedor 


});


router.post('/5' ,  async (req,res) => { 
   
    const id_pago  = req.body.pago;

    const id_productor = req.body.productor;

    const id_proveedor = req.body.proveedor;

    const id_envio = req.body.envio;

    const textoProductos = 'SELECT m.* from "Proveedor" as p, "Materia_Prima" as m where p.id_proveedor=m.id_proveedor and p.id_proveedor = $1';
 
    var valueProductos = [];

    valueProductos.push(id_proveedor);

    const productos = await pool.query(textoProductos,valueProductos);

    console.log(productos.rows);

    const texto2 = 'SELECT * FROM "Proveedor" WHERE id_proveedor = $1';
    
    var value2 = [];

    value2.push(id_proveedor);

    const proveedor = await pool.query(texto2,value2);

    console.log(proveedor.rows);


    /* 
    const texto = 'SELECT * FROM "Productor" WHERE nombre_productor = $1';
    
    var value1 = [];

    value1.push(data2);

    const productores = await pool.query(texto,value1);

    const productor = productores.rows;
    
    console.log(results.rows);*/

    res.render('realizarEv/paso5',{producto: productos.rows , proveedor: proveedor.rows ,productor: id_productor , envio: id_envio , pago: id_pago})


    // Hasta aqui llega la consulta de proveedor 


});



router.post('/6' ,   (req,res) => { 
   
    const id_pago  = req.body.pago;

    const id_productor = req.body.productor;

    const id_proveedor = req.body.proveedor;

    const id_envio = req.body.envio;

    const id_productos = req.body.productos;

    console.log(id_pago);
    console.log(id_productor);
    console.log(id_proveedor);
    console.log(id_envio);
    console.log(id_productos);



    //INSERCIONES EN LA BASE DE DATOS 

    // INSERT DEL CONTRATO 

    const text = 'INSERT INTO public."Contrato" (id_contrato, fecha_inicio, exclusividad, tipo_oferta, cantidad_oferta, fecha_cancelacion, motivo_cancelacion, id_productor, id_proveedor) VALUES (DEFAULT, $1, false, NULL, NULL, NULL, NULL, $2, $3)';
    var value = [];
    value.push("2020-07-23");
    value.push(id_productor);
    value.push(id_proveedor);

    const contrato =  pool.query(text,value);


    const metodo_pago =  pool.query('INSERT INTO "Cond_Part"  (id_cond_part, descripcion,id_condicion_pago,id_cond_pago_proveedor,id_contrato,id_proveedor_contrato,id_productor_contrato)  values (DEFAULT,NULL,4,4,7,4,1)');

    const tipo_envio =  pool.query ('INSERT INTO "Cond_Part" (id_cond_part, descripcion,id_metodo_envio,id_envio_pais,id_proveedor_envio,id_contrato,id_proveedor_contrato,id_productor_contrato) values (DEFAULT,NULL,9,5,4,7,4,1)');

    const producto1 = pool.query('INSERT INTO public."Catalogo_Contrato" (id_cat_cont, precio, id_contrato, id_productor_cont, id_proveedor_cont, id_ing, id_mat_prim) VALUES (DEFAULT, 50, 7, 1, 4, NULL, 330122)');

    const producto2 = pool.query('INSERT INTO public."Catalogo_Contrato" (id_cat_cont, precio, id_contrato, id_productor_cont, id_proveedor_cont, id_ing, id_mat_prim) VALUES (DEFAULT, 50, 7, 1, 4, NULL, 200875)');


    res.redirect('/')

});




module.exports = router;






