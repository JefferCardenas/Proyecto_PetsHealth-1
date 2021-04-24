var primeraFila;
var idProducto;

$(function(){
    /**se obtiene toda la etiqueta del primer tr de la tabla */
    primeraFila = $('#primeraFila');
    /**funcion que lista todos los productos */
    listarProductos();

    /**evento que ejecuta unja funcion para agregar un producto */
    $('#btn_modalAgregar').click(function(){

        abrirModalAgregar();

    });

});

function listarProductos(){

    $('.otraFila').remove();
    $('#tbl_productos').append(primeraFila);

    var parametros = {
        accion: 'listarProductos'
    };

    $.ajax({
        url: '../../../controlador/productoControl.php',
        data: parametros,
        dataType: 'json',
        type: 'post',
        cache: false,

        success: function(resultado){

            console.log(resultado);

            $.each(resultado.datos, function(j, dato){
                
                $('#nombre').html(dato.proNombre);
                $('#precio').html(dato.proPrecio);
                $('#unidad').html(dato.proUnidadMedida);
                $('#btn_actualizar').attr('onclick', 'modalActualizar('+dato.idProducto+')');
                $('#btn_eliminar').attr('onclick', 'modalEliminar('+dato.idProducto+')');

                $('#tbl_productos tbody').append(primeraFila.clone(true).attr('class','otraFila'));

            }); 

            $('#tbl_productos tbody tr').first().remove();

            $('#tbl_productos').DataTable({

                responsive: true,

                language: {
                    processing:     "Traitement en cours...",
                    search:         "Buscar",
                    lengthMenu:    "Mostrar _MENU_ Elementos",
                    info:           "Mostrando de _START_ a _END_ de _TOTAL_ elementos",
                    infoEmpty:      "Mostrando de 0 a 0 de 0 elementos",
                    infoFiltered:   "(filtro de _MAX_ elementos en total)",
                    infoPostFix:    "",
                    loadingRecords: "Chargement en cours...",
                    zeroRecords:    "No existe registro con ese nombre",
                    emptyTable:     "Aucune donnée disponible dans le tableau",
                    paginate: {
                        first:      "Premier",
                        previous:   "Anterior",
                        next:       "Siguiente",
                        last:       "Ultimo"
                    },
                    aria: {
                        sortAscending:  ": activer pour trier la colonne par ordre croissant",
                        sortDescending: ": activer pour trier la colonne par ordre décroissant"
                    }
                }
            });
            
        },
        error: function(e){

        }
    });

}

function abrirModalAgregar(){

    $('#mdl_agregar').modal();
    
    $('#btn_agregar').click(function(){
        
        agregarProducto();
    });

}

function agregarProducto(){

    if($('#txt_nombre').val() == '' || $('#txt_precio').val() == '' || $('#cb_unidad').val() == 0){

        Swal.fire({
            icon: 'error',
            title: 'Oops..',
            text: 'Debe validar todos los campos.',
            confirmButtonText: 'ok' 
        });

    }else{

        var parametros = {
            accion: 'agregarProducto',
    
            nombre: $('#txt_nombre').val(),
            precio: $('#txt_precio').val(),
            unidad: $('#cb_unidad').val()
        };
    
        $.ajax({
    
            url: '../../../controlador/productoControl.php',
            data: parametros,
            dataType: 'json',
            type: 'post',
            cache: false,
    
            success: function(resultado){
    
                console.log(resultado.mensaje);

                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: resultado.mensaje,
                    confirmButtonText: 'ok' 
                });

                limpiar();
                window.location.reload();
                
            },
            error: function(e){

                console.log(e);
            }
        });
    }
}

function limpiar(){

    $('#txt_nombre').val('');
    $('#txt_precio').val('');
    $('#cb_unidad').val(0);
}

function modalActualizar(id){

    idProducto = id;  
    listarDatosProducto();
    $('#mdl_actualizar').modal();
}

function listarDatosProducto(){

    var parametros = {
        accion: 'listarDatosProducto',
        idProducto: idProducto
    };

    $.ajax({
        url:'../../../controlador/productoControl.php',
        data:parametros,
        dataType:'json',
        type:'post',
        cache:'false',

        success:function(resultado){
            console.log(resultado);

            $.each(resultado.datos, function(j, dato){
                
                $('#txt_nombreA').val(dato.proNombre);
                $('#txt_precioA').val(dato.proPrecio);
                $('#cb_unidadA').val(dato.proUnidadMedida);
            });

            $('#btn_actualizarM').click(function(){
            
                actualizarDatosProducto(idProducto);

            });
        },
        error:function(e){
            console.log('ERROR');
        }
    });
}

function actualizarDatosProducto(id){

    var parametros = {

        nombre: $('#txt_nombreA').val(),
        precio: $('#txt_precioA').val(),
        unidad: $('#cb_unidadA').val(),
        accion: 'actualizarDatosProducto',
        idProducto: id
    };

    $.ajax({

        url: '../../../controlador/productoControl.php',
        data:parametros,
        dataType:'json',
        type: 'post',
        cache: false,

        success: function(resultado){

            console.log(resultado);

            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Se actualizaron los datos correctamente',
                confirmButtonText: 'ok' 
            });

            window.location.reload();

        },
        error:function(e){

            Swal.fire({
                icon: 'error',
                title: 'Oops..',
                text: 'No se pudo actualizar los datos.',
                confirmButtonText: 'ok' 
            });
            console.log(e.responseText);
            
        }
    });
}

function modalEliminar(id){

    idProducto = id;   
    
    Swal.fire({
        title:'Estas Seguro?',
        text:'Estas a un pazo de eliminar un producto de la base de datos..!',
        icon:'warning',
        showCancelButton: true,
        confirmButtonColor: '#5105E0',
        cancelButtonColor: '#F24613',
        confirmButtonText:'Si, Eliminar producto'

    }).then((result) => {

        if(result.isConfirmed){
    
            eliminarProducto();

            Swal.fire(
                'Eliminado!',
                'Acabas de eliminar un producto de la base de datos',
                'success'
            )

            window.location.reload();
        }
    });

}

function eliminarProducto(){

    var parametros = {

        accion: 'eliminarProducto',
        idProducto: idProducto
    };

    $.ajax({

        url:'../../../controlador/productoControl.php',
        data:parametros,
        dataType: 'json',
        type:'post',
        cache:'false',

        success: function(resultado){

            console.log(resultado);
        },
        error:function(e){

            console.log(e.responseText);
        }
    });

}

