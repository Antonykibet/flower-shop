import { addCartFunc} from "/js/script.js"

let catalogueTitle = document.getElementById('catalogueTitle')
let catalogueNav = document.getElementById('catalogueNav')
let content = document.getElementById('content')
let MainTitle = document.querySelector('.mainTitle')
let byOccassion = ['Congratulation', 'Birthday','Love and romance','Thank you','Valentines','Mothers day','Get well','Funeral']
let giftHampers = ['For him','For Her','Bestie','Baby shower','Bridal shower']
let subscription=['Monthly','Quartely','Yearly']

if(byOccassion.includes(catalogueTitle.innerText)){
    renderNavbarAndTitle('By Occassion',byOccassion)
    catalogBtnToggle()
}
if(giftHampers.includes(catalogueTitle.innerText)){
    renderNavbarAndTitle('Gift Hampers',giftHampers)
    catalogBtnToggle()
}
if(subscription.includes(catalogueTitle.innerText)){
    renderNavbarAndTitle('Subscription',subscription)
    catalogBtnToggle()
}
function renderNavbarAndTitle(title,catalogue){
    MainTitle.innerHTML= title 
    catalogueNav.innerHTML=''
    catalogue.forEach(item=>{
        catalogueNav.innerHTML+=`<h2 class='catalogBtn'>${item}</h2>`
    })
}
function catalogBtnToggle(){
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
            <button class='cartButton' index='${index}'>Add to Cart</button>    
        `
        let cartButton=productDiv.querySelector('.cartButton')
        cartButton.addEventListener('click',()=>{
            addCartFunc(item)
        })
        contentDiv.appendChild(productDiv)
    })
}

