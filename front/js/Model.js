class Model {
  // Récuppération des données de l'API
  async fetchData(url) {
    let myData
    await fetch(url)
      .then((res) => res.json())
      .then((data) => (myData = data))
      .catch((error) => {
        console.log(
          "Il y a eu un problème avec l'opération fetch : " + error.message
        )
      })
    // console.log(myData)
    return myData
  }

  // Envoi des données vers l'API
  async fetchPostRequest(dataToSend) {
    let dataResponse
    await fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      body: JSON.stringify(dataToSend),
      headers: {
        Accept: "application/json; charset=UTF-8",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => (dataResponse = data.orderId))
      .catch((error) => {
        console.log(
          "Il y a eu un problème avec l'opération fetch (POST) : " +
            error.message
        )
      })
      return dataResponse
  }

  //Stockage du panier dans le Local Storage
  saveBasket(basket) {
    localStorage.setItem("basket", JSON.stringify(basket))
  }

  //Récupération du panier à partir du Local Storage
  getBasket(basket) {
    basket = localStorage.getItem("basket")
    if (basket == null) {
      return []
    } else {
      return JSON.parse(basket)
    }
  }

  //Ajout des produits dans le panier
  addBasket(product) {
    let basket = []
    basket = this.getBasket(basket)

    console.log(basket)

    let foundSameProduct = basket.find(
      (p) => (p.id && p.color) === (product.id && product.color)
    )
    console.log(foundSameProduct)

    if (foundSameProduct !== undefined) {
      foundSameProduct.quantity = foundSameProduct.quantity + product.quantity
      this.saveBasket(basket)
    } else {
      basket.push(product)
      this.saveBasket(basket)
    }
  }
  //Récuppération des données de l'url
  getUrlData(data) {
    const pageUrl = window.location.href
    const url = new URL(pageUrl)
    const urlData = url.searchParams.get(data)
    return urlData
  }

//   dataToSend(firstName, lastName, address, city, email, arrayId) {
//     let bodyRequest = {
//     contact : {
//       firstName : firstName,
//       lastName : lastName,
//       address : address,
//       city : city,
//       email : email,
//     },
//     products : arrayId,
//   }
//   return bodyRequest
// }

}
