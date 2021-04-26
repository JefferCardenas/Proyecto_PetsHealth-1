var primeraFilaCitas;
var modalMotivo=null;
var idMascota=null;
var idCita=null;

$(function() {
    primeraFilaCitas= $("#fila");
     listarCitasAgendadasPorMi();
     modalMotivo = new bootstrap.Modal(document.getElementById("modalMotivo"), {
        keyboard: false,
        backdrop: "static",
    });

    $("#btn_cancelarCita").click(function () {
        modalMotivo.hide();
        Swal.fire({
            title: "Esta seguro que desea cancelar la cita?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si",
            cancelButtonText: "No",
            allowOutsideClick: false,
            allowEscapeKey: false,
          }).then((result) => {
            if (result.isConfirmed) {
                cancelarCita();
              const ToastSession = Swal.mixin({
                toast: true,
                position: "center",
                showConfirmButton: false,
                timer: 1000,
                timerProgressBar: true,
              });
              ToastSession.fire({
                icon: "success",
                title: "Cancelando cita...",
              }).then((result) => {
                // si ya se acabo el tiempo
                if (result.dismiss === Swal.DismissReason.timer) {

                }
              });
            }
        });
    });

});


function listarCitasAgendadasPorMi(){


    $(".otraFila").remove();
    $("#tblCitasAgendadasXmi tbody").append(primeraFilaCitas);
    let parametros = {
        accion:"listarCitaAgendadasPorMi"
    };
    $.ajax({
        url: "../../../controlador/citaControl.php",
        data: parametros,
        type: "post",
        dataType: "json",
        cache: false,
        success:function(resultado){
            let citasAgendadas=resultado.datos;
            console.log(citasAgendadas);
            $.each(citasAgendadas, function (i, cita) { 
                $("#ciContador").html(i+1) ;
                $("#ciCliente").html(cita.masNombre);
                $("#ciServicio").html(cita.serTipo);            
                $("#ciFecha").html(cita.ciFecha);
                $("#ciHora").html(cita.hoHora+""+cita.hoTipo);
                $("#ciEstado").html(cita.ciEstado);
                $("#btnCancelar").attr("onclick", "abrirModalCancelarCita(" +cita.idCita +","+cita.idMascota+ ")"); 
                $("#tblCitasAgendadasXmi tbody").append(primeraFilaCitas.clone(true).attr("class","otraFila"));
            });
            $("#tblCitasAgendadasXmi tbody tr").first().remove();        
       },
       error: function(ex){
           console.log(ex.responseText);
       } 
    });
}


function abrirModalCancelarCita(cita,mascota) {
    idCita=cita;
    idMascota=mascota;
    modalMotivo.show();
    
}


function cancelarCita() {
    
    let parametros = {
        accion: "cancelarCitas",
        idCita: idCita,
        idMascota: idMascota
    };

    $.ajax({
        url: "../../../controlador/citaControl.php",
        data: parametros,
        type: "post",
        dataType: "json",
        cache: false,
        success: function (resultado) {
             console.log(resultado);
            if(resultado.estado){
                listarCitasAgendadasPorMi();
                idMascota=null;
                idCita=null;
            }
        },
        error: function (ex) {
            console.log(ex.responseText);
        },
    });
}
