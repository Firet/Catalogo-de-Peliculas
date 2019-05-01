function searchProduct() {

    let productId = document.getElementById("productId").value;

    let request = new XMLHttpRequest();

    request.onload = function() {

        if (request.status == 200) {
            let product = JSON.parse(request.responseText);
            if (product !== undefined) {
                if (product.description !== undefined) {
                    document.getElementById("productName").innerText = product.description;
                }
            }
        }
        
    }

    request.open("GET", `http://localhost:3000/products/${productId}`);
    request.send();
}