let contentDiv = document.getElementById('content')
let totalPrice =document.getElementById('totalPrice')
let mobileCheckoutBtn=document.getElementById('checkoutDisplay')
let billingDiv=document.getElementById('billingDiv')
let removeBtn=document.querySelector('.bi-x-circle')
let cartItems = null

async function getCartItems(){
    let response = await fetch('/addCart')
    cartItems = await response.json()
    //displays the checkout btn mobile
    if(cartItems.length==0){
        mobileCheckoutBtn.style.display='none'
    }
    displayCartItems()
    calcTotal()
}
getCartItems()

mobileCheckoutBtn.addEventListener('click',(req,res)=>{
    billingDiv.style.display='flex'
})
removeBtn.addEventListener('click',()=>{
    billingDiv.style.display='none'
})




function calcTotal(){
    let total = 0
    cartItems.forEach((item)=>{
        total+= Number(item.price*item.unit) 
    })
    totalPrice.innerText=total
    document.getElementById('total').value=total
}



function displayCartItems(){
    cartItems.forEach((item,index)=>{
        let {name,price,image,unit} = item
        let bigDiv = document.createElement('div')
        bigDiv.classList.add('cartProductDiv')
        bigDiv.innerHTML=`
            <img class='cartProductImage' src='${image}'>
            <div class='productDesc'>
                <h2 class='cartName'>${name}</h2>
                <div class='secondRow'>
                    <h3 class='cartPrice'>${price}</h3>
                </div>
                <div style='display:flex;align-items:center;margin-bottom:8px;'>
                    <i class="bi bi-dash-lg" index='${index}'></i>
                    <div class='digitDisplay ' id='div${index}' >${unit}</div>
                    <i class="bi bi-plus-lg " index='${index}'></i>
                </div>
                <div class='thirdRow'>
                    <i class="bi bi-trash3" index='${index}'></i>
                 </div>
            </div>
            `
            contentDiv.appendChild(bigDiv)
            addFunc(bigDiv,item)
            subFunc(bigDiv,item)
            removeFunc(bigDiv,item)
        })
        //calcTotal()
}


function addFunc(div,item){
    let addBtn = div.querySelector('.bi-plus-lg')
    addBtn.addEventListener('click',async()=>{
        let {unit} = item
        unit+=1
        let itemIndex = cartItems.indexOf(item)
        cartItems[itemIndex].unit = unit
        div.querySelector('.digitDisplay').innerText=unit
        calcTotal()
        await updFunc()
    })
}

function subFunc(div,item){
    let subBtn = div.querySelector('.bi-dash-lg')
    subBtn.addEventListener('click',async()=>{
        let {unit} = item
        if(unit!==1){
            unit-=1
            let itemIndex = cartItems.indexOf(item)
            cartItems[itemIndex].unit = unit
            div.querySelector('.digitDisplay').innerText=unit
            calcTotal()
            await updFunc()
        }
    })
}


function removeFunc(div,item){
    let removeBtn =div.querySelector('.bi-trash3')
    removeBtn.addEventListener('click',async()=>{
        let index = cartItems.indexOf(item)
        cartItems.splice(index,1)
        div.remove()
        calcTotal()
        await updFunc()
        location.reload()
    })
}


async function updFunc(){
    await fetch('/updCart',{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
        },
        body:JSON.stringify({cartItems:cartItems}),
    })
}
document.addEventListener("DOMContentLoaded", function() {
    let form = document.getElementById("billingForm");

    form.addEventListener("submit", function(event) {
        let totalPrice = parseFloat(document.getElementById("totalPrice").textContent);
        // Check the condition (totalPrice is 0)
        if (totalPrice === 0) {
            // Prevent the form from submitting
            event.preventDefault();
            // Display an error message or take other actions
            alert("Cart is Empty, continue shopping.");
        }
    });
});