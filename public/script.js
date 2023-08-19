let cartBtn = document.getElementById('addToCart')
let cartArray = []
let contentDiv = document.getElementById('content')
let links =document.querySelectorAll('.link')














links.forEach((link)=>{
    link.addEventListener('click',async ()=>{
        let product = link.getAttribute('data-product')
        let response = await fetch(`/products/${product}`)
        let result = await response.json()
        result.forEach((item)=>{
        let {name,price,image} = item
        let bigDiv = document.createElement('div')
        bigDiv.classList.add('productDiv')
        let productImage =document.createElement('img')
        productImage.classList.add('productImage')
        productImage.src=image
        let productName = document.createElement('h3')
        productName.classList.add('productName')
        productName.innerText=name
        let productPrice = document.createElement('h4')
        productPrice.classList.add('productPrice')
        productPrice.innerText =price
        let cartButton =document.createElement('button')
        cartButton.classList.add('cartButton')
        cartButton.innerText = 'Add to Cart'
        cartButton.addEventListener('click',()=>{
            cartArray.push(item)
            localStorage.setItem('cartItems',JSON.stringify(cartArray))
        })
        bigDiv.append(productImage,productName,productPrice,cartButton)
        contentDiv.appendChild(bigDiv)
    })
    })
})