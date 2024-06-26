import { skeletonRender } from "./skeletonRender.js"
import {addCartFunc } from "./addCartFunc.js"
let result=null

document.addEventListener("DOMContentLoaded", async function() {
    await init()
})
async function getAddOns(){
    let response = await fetch(`/products/addOns`)
    return result =await response.json()
}

document.addEventListener('click', (event) => {
    if (
      !searchInput.contains(event.target) &&          // Click not on searchInput
      !searchResultsBox.contains(event.target)
    ) {
      searchResultsBox.style.display = 'none';
    }else{
        searchResultsBox.style.display = 'flex';
    }
  });
  
async function init(){
    skeletonRender('productCard')
    let response = await fetch(`/topProducts`)
    let result = await response.json()
    productDisplay(result)
    let secondarySections = document.querySelectorAll('.horizontalScroll')
    secondarySections.forEach(async(section)=>{
        let sectionId = section.getAttribute('id')
        await renderSecondarySectCards(sectionId)
        let moreIconDiv = document.createElement('div')
        moreIconDiv.style.cssText='height:auto;display:flex;align-items:center;'
        moreIconDiv.innerHTML=`
            <a href="/category/${sectionId}">
                <i title="More" class="bi bi-arrow-right"></i>
            </a>`
        document.getElementById(sectionId).appendChild(moreIconDiv)
    })
}

let searchInput = document.getElementById('search')
let searchResultsBox = document.getElementById('searchResult') 

searchInput.addEventListener('focus',(e)=>{
        searchResultsBox.style.display = 'flex'; 
        searchResultsBox.innerHTML=''
        skeletonRender('searchResults')
        searchResultsBox.style.display = 'none'; 
})
searchInput.addEventListener('keyup',(e)=>{
    getSearchResults(e.target.value)
})
async function getSearchResults(query){
    const url = `/searchResults?search=${encodeURIComponent(query)}`
    skeletonRender('searchResults')
    let response = await fetch( url)
    let results = await response.json()
    searchResultsBox.innerHTML=''
    if(results.length === 0){
        searchResultsBox.innerHTML=`<h4 class="resultName">Product unavailable</h4>`
    }
    results.forEach((result)=>{
        searchResultsRender(result)
    })
}
function searchResultsRender(result){
    let div = document.createElement('div')
    div.classList.add('resultsDiv')
    div.innerHTML = `
                <a href='/product/${result.name}' style = 'color:inherit;'><h4 class="resultName">${result.name}</h4> </a>
                <a href='/product/${result.name}' style = 'color:inherit;'><p class="resultDescription" >${result.description}</p></a>
                <div style='width:100%;height:1px;background-color:rgba(223, 223, 223);'></div>
    `
    searchResultsBox.appendChild(div)
}
async function renderSecondarySectCards(sectionId){
    let header={
        method:'GET',
        headers:{
            fromLandingPage:true,
        },
    }
    let response = await fetch(`/products/${sectionId}`,header)
    let result = await response.json()
    productDisplay(result,sectionId)
}

function disableButton(event){
    event.target.disabled = true;
    // Re-enable the button after a delay:
    setTimeout(() => {
        event.target.disabled = false;
    }, 1000)
}

export function productDisplay(result,section = 'content'){
    let contentDiv = document.getElementById(section)
    contentDiv.innerHTML=''
    result.forEach((item, index)=>{
        let {_id,name,description,price,image,isDiscounted,discountedPrice} = item
        let productDiv = document.createElement('div')
        productDiv.classList.add('productDiv')
        productDiv.innerHTML=productCardRender(_id,name,description,price,image,index,isDiscounted,discountedPrice)
        contentDiv.appendChild(productDiv)
        let cartBtn = productDiv.querySelector('.cartButton')
        let orderBtn = productDiv.querySelector('#orderBtn')
        cartBtn.addEventListener('click',(event) =>{
            disableButton(event)
            let btn = event.target.getAttribute('class')
            modalRender(btn,item)
        })
        orderBtn.addEventListener('click',(event)=>{
            disableButton(event)
            let btn = event.target.getAttribute('id')
            modalRender(btn,item)
        })
        //addCartFunc(productDiv,item)
    })
}

function productCardRender(_id,name,description,price,image,index,isDiscounted,discountedPrice){
    let priceDetails = `<h4 class='productPrice'>${price}</h4>`
    let discountTag =``
    if(isDiscounted){
        priceDetails = `
            <del style="color: red; " ><h4 style="color: red; " class='productPrice'>${price}</h4></del>
            <h4 class='productPrice'>${discountedPrice}</h4>
            `
            discountTag =`<img style='width:64px;height:64px;' src='/images/discountTen(pink).png'>`
    }
    return `
        <div class='discountSticker'>${discountTag}</div>
        <a class='imageHyperlink' href='/product/${name}'>
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
        <button  id='orderBtn' index='${index}'>Order now</button>
        <button class='cartButton' index='${index}'>Add to Cart</button>    
    `
}

function renderModalBackground(){
    document.body.style.overflowY='hidden'
    let modalBackground = document.createElement('div')
    modalBackground.classList.add('modalBackground')
    return modalBackground
}
function modalBackgroundDeletion(div){
    document.body.style.overflowY='scroll'
    div.remove()
} 
async function addOnsRender(div){
    let addOns = await getAddOns()
    addOns.forEach((item)=>{
        let addItem = document.createElement('div')
        addItem.classList.add('addOnsItemDiv')
        addItem.innerHTML=`
        <div class='addOnsItem'>
            <p  class='addOnName'>${item.name}</p>
            <i id='${item.name.split(' ').join('') }' class="bi bi-plus-circle-fill"></i>
        </div>`
        if(item.catalogue == 'addOns:chocolates'){
            div.querySelector('#chocolateAddOns').appendChild(addItem)
        }
        if(item.catalogue == 'addOns:wine'){
            div.querySelector('#wineAddOns').appendChild(addItem)
        }
        addItem.addEventListener('click',async()=>{
            await addCartFunc(item)
        })
    })
    /*addOns.forEach((item)=>{
        div.querySelector(`#${item.name.split(' ').join('')}`).addEventListener('click',async()=>{
            await addCartFunc(item)
        })
    })*/
}

export async function modalRender(btn,item){
    let modalBackground = renderModalBackground()
    if(btn==='orderBtn'){
        modalBackground.innerHTML= orderModalRender()
        /*if(item.catalogue.match(/Valentines/i)){
            let infoSection = modalBackground.querySelector('#infoSection')
            infoSection.style.cssText='border:solid rgba(223, 223, 223); border-radius:8px;padding:4px;margin-top:24px;'
            infoSection.innerHTML=` <i class="bi bi-info-circle"></i> By Booking you'll get your product on 14th Feb, proceed to add more delivery details...`
        }*/
        let checkoutBtn=modalBackground.querySelector('#proceedCheckout')
        checkoutBtn.addEventListener('click',async()=>{
            await addCartFunc(item)
            window.location.href = '/cart';
        })
    }
    if(btn==='cartButton'){
        modalBackground.innerHTML= cartModalRender()
        /*if(item.catalogue.match(/Valentines/i)){
            let infoSection = modalBackground.querySelector('#infoSection')
            infoSection.style.cssText='border:solid rgba(223, 223, 223); border-radius:8px;padding:4px;margin-top:24px;'
            infoSection.innerHTML=` <i class="bi bi-info-circle"></i> By Booking you'll get your product on 14th Feb, proceed to add more delivery details...`
        }*/
        let addCartBtn=modalBackground.querySelector('#proceedAddCart')
        addCartBtn.addEventListener('click',async()=>{
            await addCartFunc(item)
            modalBackgroundDeletion(modalBackground)
        })
    }
    
    let closeBtn = modalBackground.querySelector('.bi-x-circle')
    closeBtn.addEventListener('click',()=>{
        modalBackgroundDeletion(modalBackground)
    })
    document.body.appendChild(modalBackground)
    await addOnsRender(modalBackground)
}




function checkoutForm(){
    return `
        <div class='modal'>
            <i class="bi bi-x-circle"></i>
            <form id="billingForm" action="/checkout" method="post">
                <input class="billingInput" placeholder="First Name" type="text" id="fname" name="fname" required>
                <input class="billingInput" placeholder="Last Name" type="text" id="lname" name="lname" required>
                <input class="billingInput" placeholder="Phone Number" type="text" name="phoneNo" id="phoneNo" required>
                <input class="billingInput" placeholder="Email Address" type="text" name="email" id="email" required>
                <textarea name="note" id="addNote" placeholder="Add a note ..."></textarea>
                <input type="hidden" name="totalPrice" id="total">
                <button class="billingBtns" id="checkoutBtn" type="submit">Check Out</button>
            </form>
            <button id='proceedAddCart'>Proceed to Add to Cart</button>
        </div>
    `
}

function cartModalRender(){
    return `
        <div class='modal'>
            <i class="bi bi-x-circle"></i>
            <div style='width:100%'>
                <div id='infoSection'></div>
                <h2 class='title'>You can add:</h2>
                <h3 class='title'>Wine</h3>
                <div id='wineAddOns'></div>
                <h3 class='title'>Chocolates</h3>
                <div id='chocolateAddOns'></div>
            </div>
            <button class='modalSubmitBtn' id='proceedAddCart'>Proceed to Add to Cart</button>
        </div>
    `
}
function orderModalRender(){
    return `
        <div class='modal'>
            <i class="bi bi-x-circle"></i>
            <div style='width:100%'>
                <div id='infoSection'></div>
                <h2 class='title'>You can add:</h2>
                <h3 class='title'>Wine</h3>
                <div id='wineAddOns'></div>
                <h3 class='title'>Chocolates</h3>
                <div id='chocolateAddOns'></div>
            </div>
            <button class='modalSubmitBtn' id='proceedCheckout'>Proceed to Checkout</button>
        </div>
    `
}



