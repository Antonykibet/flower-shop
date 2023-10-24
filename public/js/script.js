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
            <button  id='orderBtn' index='${index}'>Order now</button>
            <button class='cartButton' index='${index}'>Add to Cart</button>    
        `
        let cartBtn = productDiv.querySelector('.cartButton')
        let orderBtn = productDiv.querySelector('#orderBtn')
        cartBtn.addEventListener('click',()=>{
            document.body.style.overflowY='hidden'
            let modalBackground = document.createElement('div')
            modalBackground.classList.add('modalBackground')
            modalBackground.innerHTML= cartModalRender()
            addOns.forEach((item)=>{
                modalBackground.querySelector('#addOns').innerHTML+=`
                <div class='addOnsItem'>
                    <p class='addOnName'>${item.name}</p>
                    <i class="bi bi-plus-circle-fill"></i>
                </div>`
                modalBackground.querySelector('.bi-plus-circle-fill').addEventListener('click',()=>{
                    addCartFunc(item)
                })
            }) 
            let submitBtn=modalBackground.querySelector('#proceedAddCart')
            submitBtn.addEventListener('click',addCartFunc(item))
            let closeBtn = modalBackground.querySelector('.bi-x-circle')
            closeBtn.addEventListener('click',()=>{
                document.body.style.overflowY='scroll'
                modalBackground.remove()
            })
            document.body.appendChild(modalBackground)
        })

        orderBtn.addEventListener('click',()=>{
            document.body.style.overflowY='hidden'
            let modalBackground = document.createElement('div')
            modalBackground.classList.add('modalBackground')
            modalBackground.innerHTML= orderModalRender()
            addOns.forEach((item)=>{
                modalBackground.querySelector('#addOns').innerHTML+=`
                <div class='addOnsItem'>
                    <p class='addOnName'>${item.name}</p>
                    <i class="bi bi-plus-circle-fill"></i>
                </div>`
            }) 
            let submitBtn=modalBackground.querySelector('#proceedCheckout')
            submitBtn.addEventListener('click',()=>{
                modalBackground.innerHTML=checkoutForm()
                //modalBackground.querySelector('')
                modalBackground.querySelector('.bi-x-circle').addEventListener('click',()=>{
                    modalBackground.remove()                    
                })
            })
            let closeBtn = modalBackground.querySelector('.bi-x-circle')
            closeBtn.addEventListener('click',()=>{
                document.body.style.overflowY='scroll'
                modalBackground.remove()
            })
            document.body.appendChild(modalBackground)
        } )
        //addCartFunc(productDiv,item)
        contentDiv.appendChild(productDiv)
    })
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

