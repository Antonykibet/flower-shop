let catalogueTitle = document.getElementById('catalogueTitle')
let catalogueNav = document.getElementById('catalogueNav')
let content = document.getElementById('content')
let MainTitle = document.querySelector('.mainTitle')
let byOccassion = ['Congratulation', 'Birthday','Love and romance','Thank you','Valentines','Mothers day','Get well','Funeral']
let giftHampers = ['For him','For Her','Bestie','Baby shower','Bridal shower']

if(byOccassion.includes(catalogueTitle.innerText)){
    MainTitle.innerHTML='By Occassion'
    catalogueNav.innerHTML=''
    byOccassion.forEach(item=>{
        catalogueNav.innerHTML+=`<div class='catalogBtn'>${item}</div>`
    })
    let catalogBtn =catalogueNav.querySelectorAll('.catalogBtn')
    catalogBtn.forEach(btn=>{
        btn.addEventListener('click',()=>{
            catalogBtn.forEach(button => {
                button.style.color = 'grey';
            });
            btn.style.color='brown'
            getProducts(btn)
        })
        if(btn.innerText==catalogueTitle.innerText){
            btn.style.color='brown'
        }
    })
}

if(giftHampers.includes(catalogueTitle.innerText)){
    MainTitle.innerHTML='Gift Hampers'
    giftHampers.forEach(item=>{
        catalogueNav.innerHTML+=`<div>${item}</div>`
    })
}
async function getProducts(catTitle){
    let response = await fetch(`/products/${catTitle.innerText}`)
    let result =await response.json()
    productDisplay(result)
}
getProducts(catalogueTitle)

function productDisplay(result){
    let contentDiv = document.getElementById('content')
    contentDiv.innerHTML=''
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

