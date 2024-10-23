import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function Movie({ titulo, director, año, categoria }) {
  const [masInfo, setMasInfo] = useState(false);
  function changeInfo(){
    setMasInfo(!masInfo);
  }

  return (
    <div className="movie">
      <h2>{titulo}</h2>
      
      {masInfo ? (
        <>
          <p>Director: {director}</p>
          <p>Año: {año}</p>
          <button onClick={changeInfo}>MENOS INFORMACIÓN</button>
        </>
      ) : (
        <button onClick={changeInfo} className='detalles'>MÁS INFORMACIÓN</button>
      )}
    </div>
  );
}

function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Función para obtener los datos de la API
  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3000/movies"); // Cambia por la URL de tu API
      if (!response.ok) {
        throw new Error('Error al obtener los datos');
      }

      const result = await response.json();
      setData(result); // Guardamos los datos en el estado
      setLoading(false); // Dejar de mostrar el estado de carga
    } catch (error) {
      setError(error.message);
      setLoading(false); // Dejar de mostrar el estado de carga en caso de error
    }
  };
  // Ejecutar fetchData cada vez que se recarga la página
  useEffect(() => {
    fetchData();
  }, []); // Este efecto se ejecuta una sola vez al cargar la página



  // Mostrar un estado de carga mientras los datos están siendo obtenidos
  if (loading) {
    return <p>Cargando datos...</p>;
  }

  // Mostrar el mensaje de error si ocurre
  if (error) {
    return <p>Error: {error}</p>;
  }

  const moviesArray = [];
  data.forEach(movie => {
    moviesArray.push(<Movie titulo={movie.nombre} director={movie.actores} año={movie.año} categoria={movie.categoria}/>);
  });

  const cienciaFiccion = [];
  const animacion = [];

  moviesArray.forEach((Movie) => {
    if (Movie.props.categoria === "Ciencia ficcion") {
      cienciaFiccion.push(Movie);
    } else if (Movie.props.categoria === "Animacion") {
      animacion.push(Movie);
    }
  });
  
  return (
    <>
      <div className='titulo'>STAFLIX</div>
      <div id='Ciencia Ficcion'>
        <h3>CATEGORIA: Ciencia ficcion </h3>
        <div className='contenedor'>
          {cienciaFiccion}
        </div>
      </div>
      <div id='Animacion'>
        <h3>Categoria: Animacion</h3>
        <div className='contenedor'>
          {animacion}
        </div>
      </div>
    </>
  )
}

export default App
