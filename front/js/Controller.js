class Controller {



  //Page d'accueil
  async homePageController() {
    // Récuppération des données des produits
    let model = new Model()
    let allProducts = await model.fetchData(
      "http://localhost:3000/api/products"
    )
    //Affichage de la liste des produits
    let listProductsView = new ListProductsView()
    listProductsView.displayListProducts(allProducts)
  }

  //Page produit
  async productPageController() {
    //Récuppération des données du produit
    let model = new Model()
    let pageProduct = await model.fetchData(
      "http://localhost:3000/api/products/" + model.getUrlData("id")
    )
    //Affichage du produit
    let productView = new ProductView()
    productView.displayCurrentProduct(pageProduct)

    //Evenement au clic : récupération des paramètres séléctionnées et enregistrement dans le panier
    const addToCartBtn = document.getElementById("addToCart")
    addToCartBtn.addEventListener("click", () => {
      let productData = {
        id: model.getUrlData("id"),
        quantity: parseInt(quantity.value),
        color: colors.value,
      }
      if (productData.color === "") {
        alert("Veuillez séléctionner une couleur")
      } else if (productData.quantity === 0) {
        alert("Veuillez séléctionner une quantité")
      } else {
        model.addBasket(productData)
      }
    })
  }

  //Page Panier
  async cartPageController() {
    let model = new Model()
    let basket = model.getBasket()
    //Récuppération des données
    let dataFromApi = []
    for (let i = 0; i < basket.length; i++) {
      let productFromApi = await model.fetchData(
        "http://localhost:3000/api/products/" + basket[i].id
      )
      dataFromApi.push(productFromApi)
    }
    console.log("data API", dataFromApi)

    let cartView = new CartView()
    //Affichage des données
    cartView.displayCart(basket, dataFromApi)

    //Affchage total quantité et prix
    cartView.displayQuantityPrice(basket, dataFromApi)

    // Changer la quantité
    const itemInputsQuantity = document.querySelectorAll(".itemQuantity")
    itemInputsQuantity.forEach((itemInput) => {
      itemInput.addEventListener("change", (e) => {
        let newValue = parseInt(e.target.value)
        let articleSelected = itemInput.closest("article")
        let getIdForChange = articleSelected.dataset.id
        let getColorForChange = articleSelected.dataset.color
        let foundProductFromBasket = basket.find(
          (p) => (p.id && p.color) === (getIdForChange && getColorForChange)
        )
        if (newValue <= 0 || newValue > 100) {
          alert("Veuillez séléctionner une quantité entre 1 et 100")
          e.target.value = 1
        } else {
          foundProductFromBasket.quantity = newValue
          model.saveBasket(basket)
          cartView.displayQuantityPrice(basket, dataFromApi)
        }
      })
    })
    // Supprimer un produit
    const itemButtonsDelete = document.querySelectorAll(".deleteItem")
    itemButtonsDelete.forEach((itemButton) => {
      itemButton.addEventListener("click", (e) => {
        let articleSelected = itemButton.closest("article")
        let getIdForDelete = articleSelected.dataset.id
        let getColorForDelete = articleSelected.dataset.color
        if (confirm("Souhaitez-vous vraiment supprimer ce produit")) {
          basket = basket.filter(
            (p) => (p.id && p.color) !== (getIdForDelete && getColorForDelete)
          )
          model.saveBasket(basket)
          cartView.displayQuantityPrice(basket, dataFromApi)
          articleSelected.remove()
        }
        return
      })
    })

    //Controle du formulaire
    const formDiv = document.querySelectorAll(".cart__order__form__question")
    const regexText = /^[a-z àâäçéèêëîïôöùûüÿ'-]+$/i
    const regexAddress = /^[0-9a-z àâäçéèêëîïôöùûüÿ'-]+$/i
    const regexEmail = /^[\w_.-]+@[\w-]+\.[a-z]{2,}$/i
    let isFirstName, isLastName, isAdress, isCity, isEmail
    let checkedForm = false
    // Evenement sur les inputs du formulaire
    formDiv.forEach((input) => {
      const test = input.addEventListener("change", (e) => {
        switch (e.target.id) {
          case "firstName":
            isFirstName = cartView.errorDisplay("firstName", e.target.value, regexText, "Veuillez rentrer un prénom valide")
            break

          case "lastName":
            isLastName = cartView.errorDisplay("lastName", e.target.value, regexText, "Veuillez rentrer un nom valide")
            break

          case "address":
            isAdress = cartView.errorDisplay("address", e.target.value, regexAddress, "Veuillez rentrer une adresse valide")
            break

          case "city":
            isCity = cartView.errorDisplay("city", e.target.value, regexText, "Veuillez rentrer une ville valide")
            break

          case "email":
            isEmail = cartView.errorDisplay("email", e.target.value,  regexEmail, "Veuillez rentrer un email valide")
            break
          default:
            null
        }
        if (
          isFirstName &&
          isLastName &&
          isAdress &&
          isCity &&
          isEmail == true
        ) {
          checkedForm = true
        } else {
          checkedForm = false
        }
      })
    })
    // Evenement à la soumission du formulaire
    const form = document.querySelector(".cart__order__form")
    form.addEventListener("submit", async (e) => {
      e.preventDefault()
      if (basket.length === 0) {
        alert("votre panier est vide. Veuillez ajouter des produits")
        window.location.href = "./index.html"
      } else if (checkedForm === true) {
        //Création du tableau de produit
        let arrayIdProducts = []
        for (let i = 0; i < basket.length; i++) {
          arrayIdProducts.push(basket[i].id)
        }
        // //Création du corps de la requête contenant l'objet contact et le tableau de produits
        let bodyRequest = {
          contact: {
            firstName: form.firstName.value,
            lastName: form.lastName.value,
            address: form.address.value,
            city: form.city.value,
            email: form.email.value,
          },
          products: arrayIdProducts,
        }
        console.log(bodyRequest)
        //Envoi de la requete POST
        let orderId = await model.fetchPostRequest(bodyRequest)
        //Vider le formulaire après commande
        form.reset()
        //Vider le panier après commande
        basket = []
        model.saveBasket(basket)
        //Redirection vers la page de confirmation
        window.location.href = `./confirmation.html?orderId=${orderId}`
      } else {
        alert("Merci de remplir correctement le formulaire")
      }
    })
  }

  confirmationPageController() {
    let model = new Model()
    let orderId = model.getUrlData("orderId")

    let confirmationView = new ConfirmationView()
    confirmationView.displayConfirmation(orderId)
  }
}
