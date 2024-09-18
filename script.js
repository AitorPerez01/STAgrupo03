function mostrarAlerta(){
    alert("Pues no era tan inutil...");
}

const apiUrl = 'http://www.omdbapi.com/';
const apiKey = '3b0045db'; // Coloca aquí tu clave API

// Seleccionamos el formulario y el div donde mostraremos los detalles
const form = document.getElementById('formId');
const movieDetails = document.getElementById('muestrario');

// Función asíncrona para buscar la película
async function fetchMovie(title) {
    try {
        // Construimos la URL de la solicitud
        const url = `${apiUrl}?apikey=${apiKey}&t=${encodeURIComponent(title)}`;

        // Esperamos a que se haga la solicitud y obtener la respuesta
        const response = await fetch(url);

        // Convertimos la respuesta a JSON
        const data = await response.json();

        // Si la respuesta es exitosa
        if (data.Response === "True") {
            // Mostramos los datos de la película
            movieDetails.innerHTML = `
                <h2>${data.Title} (${data.Year})</h2>
                <p><strong>Género:</strong> ${data.Genre}</p>
                <p><strong>Director:</strong> ${data.Director}</p>
                <p><strong>Actores:</strong> ${data.Actors}</p>
                <p><strong>Trama:</strong> ${data.Plot}</p>
                <img src="${data.Poster}" alt="Poster de ${data.Title}">
            `;
        } else {
            // Mostramos un mensaje de error si no se encuentra la película
            movieDetails.innerHTML = `<p>Película no encontrada</p>`;
        }
    } catch (error) {
        // Capturamos y mostramos cualquier error
        console.error('Error al obtener los datos de la película:', error);
        movieDetails.innerHTML = `<p>Error al buscar la película</p>`;
    }
}

// Evento al enviar el formulario
form.addEventListener('submit', function(event) {
    event.preventDefault(); // Evitamos que se recargue la página
    
    // Obtenemos el título de la película ingresado
    const movieTitle = document.getElementById('inTitulo').value;

    // Llamamos a la función fetchMovie y pasamos el título de la película
    fetchMovie(movieTitle);
});