let links =document.querySelectorAll('.link')
let headerIcons =document.querySelectorAll('.headerIcons')
let cartItems = []
let result=null
let addcartBtn

async function getCartItems(){
    let response = await fetch('/addCart')
    cartItems = await response.json()
}
getCartItems()





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
            <button class='cartButton' index='${index}'>Order Now</button>    
        `
        addCartFunc(productDiv,item)
        contentDiv.appendChild(productDiv)
    })
}

function addCartFunc(elem,item){
    addcartBtn = elem.querySelector('.cartButton')
    addcartBtn.addEventListener('click', async()=>{
        try {
            //await getCartItems()
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
    })
}

