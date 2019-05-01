window.onload = function () {
    console.log('Se Cargó el sitio usando templates!')
}




const crearListaDeProductos = (productos) => {
    const lista = document.createElement('ul')
    const contenedor = document.querySelector('#productos')

    productos.forEach((producto) => {
        const elemento = document.createElement('li')
        elemento.textContent = producto.name
        lista.appendChild(elemento)
    })

    contenedor.appendChild(lista)
}

xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        const respuesta = JSON.parse(xmlhttp.responseText);
        ocultarLoader()
        crearListaDeProductos(respuesta)
    }
};