let result = null
async function getFlowers(){
    let response = await fetch('/getFlowers')
    result = await response.json()
}
async function displayFlowers(){
    await getFlowers()
    result.forEach(elemCreator )
}
function addCart(){
    
}
function elemCreator({name, price}){
    let bigDiv = document.createElement('div')
    let imageElem = document.createElement('img')
    let nameElem = document.createElement('h1')
    let priceElem = document.createElement('h1')
    let cartElem = document.createElement('button')
    cartElem.innerText = 'Add to Cart'
    //image.src =""
    nameElem.innerText=name
    priceElem.innerText=price
    cartElem.addEventListener('click',addCart)
    bigDiv.append(imageElem,nameElem,priceElem,cartElem)
    document.body.appendChild(bigDiv)    
}

displayFlowers()