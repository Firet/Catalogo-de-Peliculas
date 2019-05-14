function doLogin() {

    let req = new XMLHttpRequest();

    req.onload = function () {

        const errorMessageDiv = document.getElementById("error-message");

        if (req.status == 200) {
            window.location.href = req.responseText;
        } else if (req.status == 403) {
            // 403: No autorizado
            errorMessageDiv.textContent = "Usuario o contraseña incorrectos";
            errorMessageDiv.style.display = "block";
        } else {
            // Otro código HTTP
            errorMessageDiv.textContent = `Error inesperado (código ${request.status})`;
            errorMessageDiv.style.display = "block";
        }
    }

    req.open("POST", "/login");

    let data = {
        user: document.getElementById("user-id").value,
        password: document.getElementById("password").value
    };

    req.setRequestHeader('Content-type', 'application/json');
    req.send(JSON.stringify(data));

}