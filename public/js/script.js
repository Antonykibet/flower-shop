let cartArray = []
let links =document.querySelectorAll('.link')
let result=null
let addcartBtn


// links.forEach((link)=>{
//     link.addEventListener('click',async ()=>{
//         contentDiv.innerHTML=''
//         let product = link.getAttribute('data-product')
//         let response = await fetch(`/products/${product}`)
//         result = await response.json()
//         productDisplay(result)
//     })
// })



function productDisplay(result,section = 'content'){
    let contentDiv = document.getElementById(section)
    result.forEach((item, index)=>{
        let {_id,name,description,price,image} = item
        let productDiv = document.createElement('div')
        productDiv.classList.add('productDiv')
        productDiv.innerHTML=`
            <a class='imageHyperlink' href='/product/${_id}'>
                <img class='productImage' src='${image}'>
            </a>
            <div class='nameDiv'>
                <h3 class='productName'>${name}</h3>
                <h4 class='productPrice'>${price}</h4>
            </div>
            <div class='descDiv'>
                <p class='description'>${description}</p>
            </div>
            <button class='cartButton' index='${index}'>Order Now</button>    
        `
        contentDiv.appendChild(productDiv)
    })
    addCartFunc()
}

function addCartFunc(){
    addcartBtn = document.querySelectorAll('.cartButton')
    addcartBtn.forEach((cartBtns)=>{
        cartBtns.addEventListener('click',()=>{
            let index = cartBtns.getAttribute('index')
            cartArray.push(result[ Number(index)])
            localStorage.setItem('cartItems',JSON.stringify(cartArray))
        })
    })
}

