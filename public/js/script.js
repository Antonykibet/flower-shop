let cartItems = []
let result=null

getCartItems()
init()
async function getAddOns(){
    let response = await fetch(`/products/addOns`)
    return result =await response.json()
}
async function getCartItems(){
    let response = await fetch('/addCart')
    cartItems = await response.json()
}

function skeleton(){
    const cardTemplate = document.getElementById('card-template')
    let contentContainer = document.querySelectorAll('.contentContainer')
    contentContainer.forEach((container)=>{
        for (let i = 0; i < 6; i++) {
            container.append(cardTemplate.content.cloneNode(true))
          }
    })
}


async function init(){
    skeleton()
    let response = await fetch(`/topProducts`)
    let result = await response.json()
    productDisplay(result)
    let secondarySections = document.querySelectorAll('.horizontalScroll')
    secondarySections.forEach(async(section)=>{
        await renderSecondarySectCards(section.getAttribute('id'))
    })
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
        let {_id,name,description,price,image} = item
        let productDiv = document.createElement('div')
        productDiv.classList.add('productDiv')
        productDiv.innerHTML=productCardRender(_id,name,description,price,image,index)
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
        contentDiv.appendChild(productDiv)
    })
}

function productCardRender(_id,name,description,price,image,index){
    return `
        <a class='imageHyperlink' href='/product/${_id}'>
            <img class='productImage' src='/images/${image}'>
        </a>
        <div class='nameDiv'>
            <h3 class='productName'>${name}</h3>
            <h4 class='productPrice'>${price}</h4>
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
        div.querySelector('#addOns').appendChild(addItem)
    })
    addOns.forEach((item)=>{
        div.querySelector(`#${item.name.split(' ').join('')}`).addEventListener('click',()=>{
            addCartFunc(item)
        })
    })
}

export async function modalRender(btn,item){
    let modalBackground = renderModalBackground()
    if(btn=='orderBtn'){
        modalBackground.innerHTML= orderModalRender()
        let checkoutBtn=modalBackground.querySelector('#proceedCheckout')
        checkoutBtn.addEventListener('click',async()=>{
            await addCartFunc(item)
            window.location.href = '/cart';
        })
    }
    if(btn=='cartButton'){
        modalBackground.innerHTML= cartModalRender()
        let addCartBtn=modalBackground.querySelector('#proceedAddCart')
        addCartBtn.addEventListener('click',async()=>{
            await addCartFunc(item)
            modalBackgroundDeletion(modalBackground)
        })
    }
    
    await addOnsRender(modalBackground)
    let closeBtn = modalBackground.querySelector('.bi-x-circle')
    closeBtn.addEventListener('click',()=>{
        modalBackgroundDeletion(modalBackground)
    })
    document.body.appendChild(modalBackground)
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
                <h2 class='title'>You can add:</h2>
                <div id='addOns'></div>
            </div>
            <button id='proceedAddCart'>Proceed to Add to Cart</button>
        </div>
    `
}
function orderModalRender(){
    return `
        <div class='modal'>
            <i class="bi bi-x-circle"></i>
            <div style='width:100%'>
                <h2 class='title'>You can add:</h2>
                <div id='addOns'></div>
            </div>
            <button id='proceedCheckout'>Proceed to Checkout</button>
        </div>
    `
}

export async function addCartFunc(item){
    try {
        alert('adding to cart...')
        if(cartItems.some(cartItem=>cartItem._id===item._id)) return
        cartItems.push(item)
        await fetch('/addCart',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify({cartItems:cartItems}),
        })   
        alert('Added to cart')
    } catch (error) {
        alert(`Error:Did not add to cart.`)
    }
}

