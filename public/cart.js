let cartItems = localStorage.getItem('cartItems')


if(cartItems!==null){
    cartItems = JSON.parse(cartItems)
    cartItems.forEach((item)=>{
        let {name, price, image} = item
        let bigDiv = document.createElement('div')
        bigDiv.innerHTML=`
            <div class='productDiv'>
                <img class='productImage' src='${image}'>
            </div>
            <div class='productDesc'>
                <h2>${name}</h2>
                <h3>${price}</h3>
            </div>
        `
        // let imageRow =document.createElement('div')
        // let imageElem = document.createElement('img')
        // let nameElem = document.createElement('h1')
        // let priceElem = document.createElement('h1')
        // bigDiv.classList.add('productDiv')
        // imageRow.classList.add('imageRowDiv')
        // imageElem.classList.add('productImage')
        // nameElem.classList.add('productName')
        // priceElem.classList.add('productPrice')
        // imageElem.src=image
        // nameElem.innerText=name
        // priceElem.innerText=price
        // cartElem.addEventListener('click',()=>{
        //     cartStorage.push(item)
        //     localStorage.setItem('cartItems',JSON.stringify(cartStorage))
        // })
        // imageRow.append(imageElem,nameElem,priceElem)
        // bigDiv.append(imageRow)
        document.body.appendChild(bigDiv)    
        document.getElementById('itemDiv').innerText= ''
    })
}else{
    document.getElementById('itemDiv').innerText='No items'
}