let cartArray = []
let contentDiv = document.getElementById('content')
let links =document.querySelectorAll('.link')
let result=null
let addcartBtn


let init = async ()=>{
    let response = await fetch(`/allFlowers`)
    result = await response.json()
    productDisplay(result)
}
init()

links.forEach((link)=>{
    link.addEventListener('click',async ()=>{
        contentDiv.innerHTML=''
        let product = link.getAttribute('data-product')
        let response = await fetch(`/products/${product}`)
        result = await response.json()
        productDisplay(result)
    })
})


function productDisplay(result){
    result.forEach((item, index)=>{
        let {_id,name,description,price,image} = item
        let bigDiv = document.createElement('div')
        bigDiv.classList.add('productDiv')
        bigDiv.innerHTML=`
            <a class='imageHyperlink' href='/${_id}'>
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
        contentDiv.appendChild(bigDiv)
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










