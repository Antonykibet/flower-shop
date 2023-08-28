//localStorage.removeItem('cartItems')
//alert( localStorage.getItem('cartItems'))
let cartItems = JSON.parse(localStorage.getItem('cartItems'))
let contentDiv = document.getElementById('content')
let links =document.querySelectorAll('.link')
let totalPrice =document.getElementById('totalPrice')
let result=null


function calcTotal(){
    let total = 0
    cartItems.forEach((item)=>{
        total+= Number(item.price*item.unit) 
    })
    totalPrice.innerText=total
}


links.forEach((link)=>{
    link.addEventListener('click',async ()=>{
        contentDiv.style.justifyContent='space-around'
        contentDiv.innerHTML=``
        let product = link.getAttribute('data-product')
        let response = await fetch(`/products/${product}`)
        result = await response.json()
        result.forEach((item,index)=>{
            let {name,price,image,description} = item
            contentDiv.innerHTML+=`<div class='productDiv'>
                <img class='productImage' src='${image}'>
                <h3 class='productName'>${name}</h3>
                <h4 class='productPrice'>${price}</h4>
                <button class='cartButton' index='${index}'>OrderNow</button>
            </div>`
            })
        addcartBtn = document.querySelectorAll('.cartButton')
        addcartBtn.forEach((cartBtns)=>{
        cartBtns.addEventListener('click',()=>{
                let index = cartBtns.getAttribute('index')
                cartItems.push(result[Number(index)])
                localStorage.setItem('cartItems',JSON.stringify(cartItems))
            })
        })

    })
})


//function displayCart(){}
if(cartItems!==null){
    //cartItems = cartItems
    cartItems.forEach((item,index)=>{
        let {name,price,image,unit} = item
        let bigDiv = document.createElement('div')
        bigDiv.classList.add('cartProductDiv')
        bigDiv.innerHTML=`
                <img class='cartProductImage' src='${image}'>
                <div class='productDesc'>
                    <h2>${name}</h2>
                    <h3>${price}</h3>
                    <div style='display:flex;'>
                        <button class='subsBtn' index='${index}'>-</button>
                        <div id='div${index}' >${unit}</div>
                        <button class='addBtn' index='${index}' >+</button>
                    </div>
                    <button class='removeBtn index='${index}' >Remove</button>
                </div>
        `
        contentDiv.appendChild(bigDiv)
        document.getElementById('itemDiv').innerText= ''
    })
    calcTotal()
}else{
    document.getElementById('itemDiv').innerText='No items'
}

let removeBtns = document.querySelectorAll('.removeBtn')
let addBtns = document.querySelectorAll('.addBtn')
let subsBtns = document.querySelectorAll('.subsBtn')
addBtns.forEach((btn)=>{
    btn.addEventListener('click',()=>{
        let index = btn.getAttribute('index')
        cartItems[index].unit+=1
        let {unit} =cartItems[index]
        alert(unit)
        document.getElementById(`div${index}`).innerText=unit
        localStorage.setItem('cartItems',JSON.stringify(cartItems))
        calcTotal()
    })
})
subsBtns.forEach((btn)=>{
    btn.addEventListener('click',()=>{
        let index = btn.getAttribute('index')
        let {unit} =cartItems[index]
        if(unit>1){
            unit-=1
            cartItems[index].unit=unit
            document.getElementById(`div${index}`).innerText=unit
            localStorage.setItem('cartItems',JSON.stringify(cartItems))
            calcTotal()
        }
    })
})

removeBtns.forEach((btn)=>{
    btn.addEventListener('click',()=>{
        let index = btn.getAttribute('index')
        cartItems.splice(index,1)
        localStorage.setItem('cartItems',JSON.stringify(cartItems))
        location.reload()
    })
})
