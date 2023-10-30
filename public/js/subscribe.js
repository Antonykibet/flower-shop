let contentSection = document.getElementById('content')
displaySubItems()
async function displaySubItems(){
    let response = await fetch('/getSubItems')
    let result = await response.json()
    result.forEach((item)=>{
        let {product,intervals,subscription,deliveries,totalDeliveries,nextDelivery,lastDelivery} = item
        let list = document.createElement('div')
        list.classList.add('orderRecord')
        list.innerHTML=subList(product,deliveries,totalDeliveries,subscription,intervals,nextDelivery,lastDelivery)
        contentSection.appendChild(list)
    })
}
function subList(productName,deliveries,totalDeliveries,subscription,intervals,nextDelivery,lastDelivery){
    return `
    <div class="credentials">
        <p id="name">${productName}</p>
    </div>
    <div>
        <p>${subscription}</p>
        <p>${intervals}</p>
    </div>
    <div>
        <p>Next delivery : ${nextDelivery}</p>
        <p>Last delivery : ${lastDelivery}</p>
    </div>
    <div id='deliveryRecordDiv'>
        <p>${deliveries}/${JSON.stringify(totalDeliveries)}</p>
    </div>
    `
}