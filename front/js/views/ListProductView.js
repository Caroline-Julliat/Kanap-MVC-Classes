class ListProductsView {

    
    displayListProducts (allProducts) {
        const resultContainer = document.getElementById("items")
        resultContainer.innerHTML = allProducts
        .map((product) => {
          return `
        <a href="./product.html?id=${product._id}">
        <article>
          <img src=${product.imageUrl} alt=${product.altTxt}>
          <h3 class="productName">${product.name}</h3>
          <p class="productDescription">${product.description}</p>
        </article>
      </a>
      `
        })
        .join("")
    }
}