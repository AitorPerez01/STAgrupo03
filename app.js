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

// Ruta para obtener todas las películas
app.get('/database', (req, res) => {
    const movies = getMovies();
    res.json(movies);
});

// Ruta para obtener una película por su ID
app.get('/database/:id', (req, res) => {
    const movies = getMovies();
    const movie = movies.find(m => m.id === parseInt(req.params.id));
    if (!movie) {
        return res.status(404).json({ message: 'Película no encontrada' });
    }

    res.json(movie);
});

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
