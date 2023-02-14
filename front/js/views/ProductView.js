class ProductView {
  displayCurrentProduct(pageProduct) {
    console.log("pageProduct =", pageProduct)

    const itemImgContainer = document.querySelector(".item__img")
    const itemImg = document.createElement("img")
    const itemName = document.getElementById("title")
    const itemPrice = document.getElementById("price")
    const itemDescription = document.getElementById("description")
    const itemColors = document.getElementById("colors")

    itemImg.src = pageProduct.imageUrl
    itemImg.alt = pageProduct.altTxt
    itemImgContainer.appendChild(itemImg)
    itemName.textContent = pageProduct.name
    itemPrice.textContent = pageProduct.price
    itemDescription.textContent = pageProduct.description

    for (const color of pageProduct.colors) {
      let colorOption = document.createElement("option")
      colorOption.setAttribute("value", color)
      colorOption.textContent = color
      itemColors.appendChild(colorOption)
    }
  }
}
