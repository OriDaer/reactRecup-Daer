import { useState, useRef } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [productos, setProductos] = useState([]);
  const urlApi = 'https://fakestoreapi.com/products/category/jewelery';
  const urlLocal = 'http://localhost:3000/products';
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const fetchLocalProductos = function () {
    axios.get(urlLocal)
    .then(function (response) {
      setProductos(response.data);
    })
    .catch(function () {
      setError('Error al cargar productos guardados.');
    });
  };

  const handleObtenerProductos = function () { // obtiene productos de la api y los guarda
    const n = parseInt(inputRef.current.value, 10);
    if (isNaN(n) || n <= 0) {
      setError('Error, ingrese un número mayor a 0.');
      return;
    }

    axios.get(urlApi)
    .then(function (response) {
      const nuevosProductos = [];
      let contador = 0;
      while (contador < n && contador < response.data.length) {
        nuevosProductos.push(response.data[contador]);
        contador++;
      }

      verificarYGuardar(nuevosProductos);
    })
    .catch(function () {
      setError('No se pudieron obtener los productos.');
    });
  };

  const verificarYGuardar = function (productos) {  // verifica y guarda productos en db.json
    axios.get(urlLocal)
    .then(function (response) {
      const productosExistentes = response.data;
      const productosFiltrados = [];
      for (let i = 0; i < productos.length; i++) {
        let duplicado = false;
        for (let j = 0; j < productosExistentes.length; j++) {
          if (productos[i].id === productosExistentes[j].id) {
            duplicado = true;
            break;
          }
        }
        if (!duplicado) {
          productosFiltrados.push(productos[i]);
        }
      }
      if (productosFiltrados.length === 0) {
        setError('No hay productos nuevos para agregar.');
        return;
      }
      for (let k = 0; k < productosFiltrados.length; k++) {
        axios.post(urlLocal, productosFiltrados[k]).catch(function () {
          setError('Error al guardar producto en la base de datos.');
        });
      }
      fetchLocalProductos();
    }).catch(function () {
      setError('Error al verificar productos en la base de datos.');
    });
  };

  const handleEliminarProducto = function (id) { // eliminamos producto de la db.json
    axios.delete(urlLocal + '/' + id)
    .then(function () {
      fetchLocalProductos();
    }).catch(function () {
      setError('No se pudo eliminar el producto.');
    });
  };

  return (
    <div className="App">
      <h3>Ingrese la cantidad de productos que desea solicitar de la categoría "Jewelry":</h3>
      <input 
      type="text"
      ref={inputRef}
      placeholder="Cantidad de productos" />

      <button onClick={handleObtenerProductos}>Obtener Productos</button>

      {error && <p style={{color: 'blue' }}>{error}</p>}
      <ul>
        {productos.map(function (producto) {
          return (
            <li key={producto.id}>
              <h2>{producto.title}</h2>
              <img src={producto.image} alt={producto.title} style={{ width: '100px' }} />
              <button onClick={function () { handleEliminarProducto(producto.id); }}>Eliminar</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default App; 