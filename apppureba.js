const express = require('express');
const fs = require('fs');
const app = express();

// Middleware para manejar JSON
app.use(express.json());

// Función para leer el archivo JSON de las películas
const getMovies = () => {
    const data = fs.readFileSync('./database.json', 'utf-8');
    return JSON.parse(data);
};

// Función para escribir el archivo JSON de las películas
const saveMovies = (movies) => {
    fs.writeFileSync('./database.json', JSON.stringify(movies, null, 2), 'utf-8');
};

// Ruta para obtener todas las películas
app.get('/database', (req, res) => {
    const movies = getMovies();
    res.json(movies);
});

// Ruta para obtener una película por su ID o nombre
app.get('/database/:id', (req, res) => {
    const movies = getMovies();
    const id = req.params.id;

    if (!isNaN(id)) {
        const movie = movies.find(m => m.id === parseInt(id));
        if (!movie) {
            return res.status(404).json({ message: 'Película no encontrada' });
        }
        return res.json(movie);
    }

    const movie = movies.find(m => m.nombre.toLowerCase() === req.params.id.toLowerCase());
    if (!movie) {
        return res.status(404).json({ message: 'Película no encontrada' });
    }

    res.json(movie);
});

// Ruta para agregar una nueva película con ID autogenerada
app.post('/database', (req, res) => {
    const movies = getMovies();
    const { nombre, año, actores } = req.body;

    // Validar que todos los campos están presentes
    if (!nombre || !año || !actores) {
        return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    // Verificar si la película ya existe (comparando el nombre)
    const existingMovie = movies.find(m => m.nombre.toLowerCase() === nombre.toLowerCase());
    if (existingMovie) {
        return res.status(400).json({ message: 'La película ya existe' });
    }

    // Generar un nuevo ID autoincremental basado en la longitud del array
    const newId = movies.length > 0 ? movies[movies.length - 1].id + 1 : 1;

    // Agregar la nueva película
    const newMovie = {
        id: newId,
        nombre,
        año,
        actores
    };
    movies.push(newMovie);

    // Guardar en el archivo JSON
    saveMovies(movies);

    // Responder con la nueva película agregada
    res.status(201).json(newMovie);
});

// Ruta para actualizar una película por su ID, incluyendo la gestión de actores
app.put('/database/:id', (req, res) => {
    const movies = getMovies();
    const id = parseInt(req.params.id);
    const { nombre, año, agregarActores, quitarActores } = req.body;

    // Buscar la película por su ID
    const movieIndex = movies.findIndex(m => m.id === id);

    if (movieIndex === -1) {
        return res.status(404).json({ message: 'Película no encontrada' });
    }

    // Actualizar los campos si están presentes en el body de la solicitud
    if (nombre) movies[movieIndex].nombre = nombre;
    if (año) movies[movieIndex].año = año;

    // Gestión de actores
    if (agregarActores && Array.isArray(agregarActores)) {
        // Añadir actores (evitar duplicados)
        agregarActores.forEach(actor => {
            if (!movies[movieIndex].actores.includes(actor)) {
                movies[movieIndex].actores.push(actor);
            }
        });
    }

    if (quitarActores && Array.isArray(quitarActores)) {
        // Quitar actores
        movies[movieIndex].actores = movies[movieIndex].actores.filter(actor => !quitarActores.includes(actor));
    }

    // Guardar la lista actualizada de películas
    saveMovies(movies);

    // Responder con la película actualizada
    res.json({ message: 'Película actualizada', pelicula: movies[movieIndex] });
});

// Ruta para eliminar una película por su nombre
app.delete('/database/:nombre', (req, res) => {
    let movies = getMovies();
    const nombre = req.params.nombre.toLowerCase();

    // Buscar la película por nombre
    const movieIndex = movies.findIndex(m => m.nombre.toLowerCase() === nombre);

    if (movieIndex === -1) {
        return res.status(404).json({ message: 'Película no encontrada' });
    }

    // Eliminar la película de la lista
    const deletedMovie = movies.splice(movieIndex, 1);

    // Guardar la nueva lista de películas
    saveMovies(movies);

    // Responder con la película eliminada
    res.status(200).json({ message: 'Película eliminada', pelicula: deletedMovie });
});

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});