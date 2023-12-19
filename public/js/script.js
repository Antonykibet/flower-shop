let links =document.querySelectorAll('.link')
let headerIcons =document.querySelectorAll('.headerIcons')
let cartItems = []
let addOns = null
let result=null
let addcartBtn

async function getAddOns(){
    let response = await fetch(`/products/addOns`)
    let result =await response.json()
    addOns=result
}
async function getCartItems(){
    let response = await fetch('/addCart')
    cartItems = await response.json()
}
getCartItems()
getAddOns()

let init = async ()=>{
    let response = await fetch(`/topProducts`)
    let result = await response.json()
    productDisplay(result)
    let secondarySections = document.querySelectorAll('.horizontalScroll')
    secondarySections.forEach(async(section)=>{
        await renderSecondarySectCards(section.getAttribute('id'))
    })
}
init()

async function renderSecondarySectCards(sectionId){
    let header={
        method:'GET',
        headers:{
            fromLandingPage:true,
        },
    }
    let response = await fetch(`/products/${sectionId}`,header)
    let result = await response.json()
    alert(result)
    productDisplay(result,sectionId)
}

function productDisplay(result,section = 'content'){
    let contentDiv = document.getElementById(section)
    result.forEach((item, index)=>{
        let {_id,name,description,price,image} = item
        let productDiv = document.createElement('div')
        productDiv.classList.add('productDiv')
        productDiv.innerHTML=productCardRender(_id,name,description,price,image,index)
        let cartBtn = productDiv.querySelector('.cartButton')
        let orderBtn = productDiv.querySelector('#orderBtn')
        cartBtn.addEventListener('click',(event) =>{
            let btn = event.target.getAttribute('class')
            modalRender(btn,item)
        })
        orderBtn.addEventListener('click',(event)=>{
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
            <img class='productImage' src='${image}'>
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
function addOnsRender(div){
    addOns.forEach((item)=>{
        div.querySelector('#addOns').innerHTML+=`
        <div class='addOnsItem'>
            <p class='addOnName'>${item.name}</p>
            <i class="bi bi-plus-circle-fill"></i>
        </div>`
        div.querySelector('.bi-plus-circle-fill').addEventListener('click',()=>{
            addCartFunc(item)
        })
    }) 
}

function modalRender(btn,item){
    let modalBackground = renderModalBackground()
    if(btn=='orderBtn'){
        modalBackground.innerHTML= orderModalRender()
        let checkoutBtn=modalBackground.querySelector('#proceedCheckout')
        checkoutBtn.addEventListener('click',()=>{
            modalBackground.innerHTML=checkoutForm()
            modalBackground.querySelector('.bi-x-circle').addEventListener('click',()=>{
                modalBackground.remove()        
            })
        })
    }
    if(btn=='cartButton'){
        modalBackground.innerHTML= cartModalRender()
        let addCartBtn=modalBackground.querySelector('#proceedAddCart')
        addCartBtn.addEventListener('click',()=>{addCartFunc(item)})
    }
    
    addOnsRender(modalBackground)
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

async function addCartFunc(item){
    try {
        if(cartItems.some(cartItem=>cartItem._id===item._id)) return
        cartItems.push(item)
        await fetch('/addCart',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify({cartItems:cartItems}),
        })   
    } catch (error) {
        alert(`Error:Did not add to cart.`)
    }
}

