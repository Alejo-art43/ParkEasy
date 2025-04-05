let inicio = ['juan.pizo.ueb@gmail.com']; //hacemos el arreglo unidimensional guardamos los datos asignados
let password = ['123456789'];

function cargar(){
    let usuario=document.getElementById("correo").value; //creamos variables y los llamamos desde el id del html para que tomen la funcion de esa variable
    let contra=document.getElementById("contraseña").value;
//utilizamos la setencia para confirmar si se cumple o no 
    if(usuario == inicio && contra == password)
    {
        window.location="mapeo.html";//lo redirige a la pagina cuando hay usuario creado
    }
    else
    {
        alert("DATOS ERRONEOS")//mensaje de alerta cuando el usuario o persona no ingresa los datos correctos
    }
}