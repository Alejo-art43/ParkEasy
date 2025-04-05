document.getElementById('buscar').addEventListener('click', function() {
    const ubicacion = document.getElementById('ubicacion').value;
 
    // Verificar si hay una ubicación ingresada
    if (!ubicacion) {
        alert('Por favor ingresa una dirección o coordenadas.');
        return;
    }
 
    // Geocodificar la ubicación ingresada por el usuario
    const geocoder = new google.maps.Geocoder();
    
    console.log("Buscando ubicación:", ubicacion); // Mensaje de depuración
 
    geocoder.geocode({ 'address': ubicacion }, function(results, status) {
        if (status === 'OK') {
            const location = results[0].geometry.location;
            console.log("Ubicación encontrada:", location); // Mensaje de depuración
 
            // Inicializa el mapa en la ubicación proporcionada
            const map = new google.maps.Map(document.getElementById('map'), {
                center: location,
                zoom: 15
            });
 
            // Consulta a Overpass API para buscar parqueaderos cercanos
            const query = `
                [out:json];
                (
                  node["amenity"="parking"](around:1000, ${location.lat()}, ${location.lng()});
                  way["amenity"="parking"](around:1000, ${location.lat()}, ${location.lng()});
                  relation["amenity"="parking"](around:1000, ${location.lat()}, ${location.lng()});
                );
                out body;
            `;
 
            console.log("Consulta a Overpass API:", query); // Mensaje de depuración
 
            fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`)
                .then(response => response.json())
                .then(data => {
                    console.log("Datos recibidos de Overpass API:", data); // Mensaje de depuración
                    mostrarResultados(data);
                })
                .catch(error => console.error('Error:', error));
        } else {
            alert('No se pudo encontrar la ubicación. Intenta con otra dirección.');
            console.error('Error en geocodificación:', status); // Mensaje de depuración
        }
    });
 });
 
 function mostrarResultados(data) {
    const resultadosDiv = document.getElementById('resultados');
    resultadosDiv.innerHTML = ""; // Limpiar resultados anteriores
 
    // Verifica si hay elementos en los resultados
    if (!data.elements || data.elements.length === 0) {
        resultadosDiv.innerHTML = "<p>No se encontraron parqueaderos cercanos.</p>";
        return;
    }
 
    // Mostrar los parqueaderos encontrados
    data.elements.forEach(element => {
        if (element.tags && element.tags.name) {
            const div = document.createElement('div');
            div.className = 'parqueadero';
            div.innerHTML = `<strong>${element.tags.name}</strong><br>Ubicación (Lat, Lng): (${element.lat}, ${element.lon})`;
 
            // Agregar información adicional si está disponible
            if (element.tags.opening_hours) {
                div.innerHTML += `<br><strong>Horario:</strong> ${element.tags.opening_hours}`;
            }
            if (element.tags.price) {
                div.innerHTML += `<br><strong>Precio:</strong> ${element.tags.price}`;
            }
            if (element.tags.transport) {
                div.innerHTML += `<br><strong>Medios de Transporte Aceptados:</strong> ${element.tags.transport}`;
            }
 
            resultadosDiv.appendChild(div);
        }
    });
 }