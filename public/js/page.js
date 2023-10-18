let title = document.getElementById('title')
let content = document.getElementById('content')

async function getProducts(){
    let response = await fetch(`/products/${title.innerText.toLowerCase()}`)
    let result =await response.json()
    productDisplay(result)
}
getProducts()

function productDisplay(result){
    let contentDiv = document.getElementById('content')
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
        let cartButton=productDiv.querySelector('.cartButton')
        cartButton.addEventListener('click',()=>{
            alert('Hello')
        })
        contentDiv.appendChild(productDiv)
    })
}