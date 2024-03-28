import { addCartFunc} from "/js/addCartFunc.js"
import { skeletonRender } from "./skeletonRender.js"

let catalogueTitle = document.getElementById('catalogueTitle')
let catalogueNav = document.getElementById('catalogueNav')
let MainTitle = document.querySelector('.mainTitle')
let byOccassion = ['Congratulation', 'Birthday','Love and romance','Thank you','Valentines:flowerPackages','Valentines:flowers','Valentines:teddy','Mothers day','Get well','Funeral']
let giftHampers = ['For him','For Her','Bestie','Baby shower','Bridal shower']
let subscription=['Monthly','Quartely','Yearly']

if(byOccassion.includes(catalogueTitle.innerText)){
    renderNavbarAndTitle('By Occassion',byOccassion)
    await getProducts(catalogueTitle)
    catalogBtnToggle()
}
if(giftHampers.includes(catalogueTitle.innerText)){
    renderNavbarAndTitle('Gift Hampers',giftHampers)
    await getProducts(catalogueTitle)
    catalogBtnToggle()
}
if(subscription.includes(catalogueTitle.innerText)){
    renderNavbarAndTitle('Subscription',subscription)
    await getProducts(catalogueTitle)
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
        btn.addEventListener('click',async()=>{
            catalogBtn.forEach(button => {
                button.style.color = 'grey';
            });
            btn.style.color='#B7A28A'
            await getProducts(btn)
        })
        if(btn.innerText==catalogueTitle.innerText){
            btn.style.color='#B7A28A'
        }
    })
}
async function getProducts(catTitle){
    let response = await fetch(`/products/${catTitle.innerText}`)
    let result =await response.json()
    productDisplay(result)
}

function productDisplay(result){
    let contentDiv = document.getElementById('pageContent')
    contentDiv.innerHTML=''
    result.forEach((item, index)=>{
        let {_id,name,description,price,image,isDiscounted,discountedPrice} = item
        let priceDetails = `<h4 class='productPrice'>${price}</h4>`
        let discountTag =``
        if(isDiscounted){
            priceDetails = `
                <del style="color: red; " ><h4 style="color: red; " class='productPrice'>${price}</h4></del>
                <h4 class='productPrice'>${discountedPrice}</h4>
                `
                discountTag =`<img  src='/images/discount tag 20.png'>`
        }

        let productDiv = document.createElement('div')
        productDiv.classList.add('productDiv')
        productDiv.innerHTML=`
            <div class='discountSticker'>${discountTag}</div>
            <a class='imageHyperlink' href='/product/${_id}'>
                <img class='productImage' src='/images/${image}'>
            </a>
            <div class='nameDiv'>
                <h3 class='productName'>${name}</h3>
                <div>
                    ${priceDetails}
                </div>
            </div>
            <div class='descDiv'>
                <p class='description'>${description}</p>
            </div>
            <button class='cartButton' index='${index}'>Add to Cart</button>    
        `
        let cartButton=productDiv.querySelector('.cartButton')
        cartButton.addEventListener('click',async ()=>{
            await addCartFunc(item)
        })
        contentDiv.appendChild(productDiv)
    })
}

