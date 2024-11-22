import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Probando = () => {
    const API_URL = 'http://localhost:3000/posts'; // URL de la API

    const [posts, setPosts] = useState([]); // Estado para las publicaciones
    const [newPost, setNewPost] = useState({ title: '', body: '' }); // Nuevo post
    const [editPost, setEditPost] = useState(null); // Post en edición
    const [error, setError] = useState(null); // Estado para errores

    // **1. Leer los datos (GET)**
    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = () => {
        axios
            .get(API_URL)
            .then((response) => setPosts(response.data))
            .catch((error) => {
                console.error('Error al cargar las publicaciones:', error);
                setError('Error al cargar las publicaciones');
            });
    };

    // **2. Crear una nueva publicación (POST)**
    const addPost = (e) => {
        e.preventDefault();

        if (!newPost.title || !newPost.body) {
            alert('Por favor, completa todos los campos');
            return;
        }

        axios
            .post(API_URL, newPost)
            .then((response) => {
                setPosts([...posts, response.data]); // Agrega el nuevo post a la lista
                setNewPost({ title: '', body: '' }); // Limpia el formulario
            })
            .catch((error) => {
                console.error('Error al agregar la publicación:', error);
                setError('No se pudo agregar la publicación');
            });
    };

    // **3. Editar una publicación (PUT o PATCH)**
    const saveEditPost = (e) => {
        e.preventDefault();

        axios
            .put(`${API_URL}/${editPost.id}`, editPost)
            .then((response) => {
                setPosts(posts.map((post) => (post.id === editPost.id ? response.data : post))); // Actualiza el post editado
                setEditPost(null); // Finaliza la edición
            })
            .catch((error) => {
                console.error('Error al editar la publicación:', error);
                setError('No se pudo actualizar la publicación');
            });
    };

    // **4. Eliminar una publicación (DELETE)**
    const deletePost = (id) => {
        axios
            .delete(`${API_URL}/${id}`)
            .then(() => {
                setPosts(posts.filter((post) => post.id !== id)); // Elimina el post del estado
            })
            .catch((error) => {
                console.error('Error al eliminar la publicación:', error);
                setError('No se pudo eliminar la publicación');
            });
    };

    return (
        <div>
            <h1>Publicaciones</h1>

            {/* Mostrar errores */}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* **Formulario para crear o editar publicaciones** */}
            <form onSubmit={editPost ? saveEditPost : addPost}>
                <div>
                    <label>Título:</label>
                    <input
                        type="text"
                        value={editPost ? editPost.title : newPost.title}
                        onChange={(e) =>
                            editPost
                                ? setEditPost({ ...editPost, title: e.target.value })
                                : setNewPost({ ...newPost, title: e.target.value })
                        }
                    />
                </div>
                <div>
                    <label>Contenido:</label>
                    <textarea
                        value={editPost ? editPost.body : newPost.body}
                        onChange={(e) =>
                            editPost
                                ? setEditPost({ ...editPost, body: e.target.value })
                                : setNewPost({ ...newPost, body: e.target.value })
                        }
                    ></textarea>
                </div>
                <button type="submit">{editPost ? 'Guardar Cambios' : 'Agregar Publicación'}</button>
                {editPost && <button onClick={() => setEditPost(null)}>Cancelar Edición</button>}
            </form>

            {/* **Lista de publicaciones** */}
            <ul>
                {posts.map((post) => (
                    <li key={post.id}>
                        <h2>{post.title}</h2>
                        <p>{post.body}</p>
                        <button onClick={() => setEditPost(post)}>Editar</button>
                        <button onClick={() => deletePost(post.id)}>Eliminar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Probando;
