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
