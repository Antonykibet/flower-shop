let result = null
let cartStorage=[]
async function getFlowers(){
    let response = await fetch('/getFlowers')
    result = await response.json()
}
async function displayFlowers(){
    await getFlowers()
    result.forEach(elemCreator )
}
// function addCart(){
//     localStorage.setItem('name','anto')
//     nameElem.innerText=localStorage.getItem('name')
// }
function elemCreator(item){
    let {name, price, image} = item
    let bigDiv = document.createElement('div')
    let imageElem = document.createElement('img')
    let nameElem = document.createElement('h1')
    let priceElem = document.createElement('h1')
    let cartElem = document.createElement('button')
    cartElem.innerText = 'Add to Cart'
    imageElem.src =image
    nameElem.innerText=name
    priceElem.innerText=price
    cartElem.addEventListener('click',()=>{
        cartStorage.push(item)
        localStorage.setItem('cartItems',JSON.stringify(cartStorage))
    })
    bigDiv.append(imageElem,nameElem,priceElem,cartElem)
    document.body.appendChild(bigDiv)    
}

displayFlowers()
