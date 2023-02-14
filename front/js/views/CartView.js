class CartView {
  //Affichage des produits du panier
  displayCart(basket, dataFromApi) {
    for (let i = 0; i < basket.length; i++) {
      const selectedProduct = dataFromApi.find(
        (product) => product._id == basket[i].id
      )
      document.getElementById("cart__items").innerHTML += `
        <article class="cart__item" data-id="${basket[i].id}" data-color="${basket[i].color}">
          <div class="cart__item__img">
            <img src="${selectedProduct.imageUrl}" alt="${selectedProduct.altTxt}">
          </div>
          <div class="cart__item__content">
            <div class="cart__item__content__description">
              <h2>${selectedProduct.name}</h2>
              <p>${basket[i].color}</p>
              <p>${selectedProduct.price} €</p>
            </div>
            <div class="cart__item__content__settings">
              <div class="cart__item__content__settings__quantity">
                <p>Qté : </p>
                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${basket[i].quantity}">
              </div>
              <div class="cart__item__content__settings__delete">
                <p class="deleteItem">Supprimer</p>
              </div>
            </div>
          </div>
        </article>
        `
    }
  }
  // Calcul et Affichage de la quantité et du prix
  displayQuantityPrice(basket, dataFromApi) {
    let totalQuantity = 0
    let totalPrice = 0
    //Calcul total quantité et prix
    for (let i = 0; i < basket.length; i++) {
      const selectedProduct = dataFromApi.find(
        (product) => product._id == basket[i].id
      )
      totalQuantity += basket[i].quantity
      totalPrice += basket[i].quantity * selectedProduct.price
    }
    //Affichage total quantité et prix
    const totalQuantityContainer = document.getElementById("totalQuantity")
    const totalPriceContainer = document.getElementById("totalPrice")
    totalQuantityContainer.textContent = totalQuantity
    totalPriceContainer.textContent = totalPrice
  }

  //Controle du formulaire
  checker(value, regex) {
    if (value.match(regex)) {
      return true
    } else {
      return false
    }
  }

  errorDisplay(tag, value, regex, message) {
    const errorContainer = document.getElementById(`${tag}ErrorMsg`)
    if (this.checker(value, regex) == false) {
      errorContainer.textContent = message
      return false
    } else {
      errorContainer.textContent = ""
      return true
    }
  }
}
