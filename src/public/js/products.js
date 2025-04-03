const socket = io();

socket.on("newProducts", () => {
  console.log("Se añadió un nuevo producto");
  location.reload();
});

socket.on("deletedProducts", () => {
  console.log("Se eliminó un producto");
  location.reload();
});

async function fetchDeleteProduct(id) {
  fetch(`/api/products/${id}`, {
    method: "DELETE",
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Error al eliminar el producto");
    }
    return response.json();
  });
}

document.querySelectorAll(".btn-delete").forEach((button) => {
  button.addEventListener("click", function () {
    const producto = this.closest(".product");
    const id = producto.querySelector(".productId").textContent;

    fetchDeleteProduct(id);

    location.reload();
  });
});

async function fetchAddProductToCart(cid, pid) {
  fetch(`/api/carts/${cid}/product/${pid}`, {
    method: "POST",
  }).then((response) => {
    if (!response.ok) {
      throw new Error("No se pudo agregar el producto al carrito");
    }
    return response.json();
  });
}

document.querySelectorAll(".btn-add-to-cart").forEach((button) => {
  button.addEventListener("click", function () {
    const producto = this.closest(".product-card");
    const pid = producto.querySelector(".pid").textContent;
    const cid = producto.querySelector(".cid").value;
    
    if (cid == "") {
      alert("Se debe ingresar un CartId");
      return;
    }

    fetchAddProductToCart(cid, pid);

    alert("Se agregó el producto en el carrito");
    
    location.reload();
  });
});
