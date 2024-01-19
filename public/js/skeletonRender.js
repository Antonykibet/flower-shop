export function skeletonRender(){
    const cardTemplate = document.getElementById('card-template')
    let contentContainer = document.querySelectorAll('.contentContainer')
    contentContainer.forEach((container)=>{
        for (let i = 0; i < 6; i++) {
            container.append(cardTemplate.content.cloneNode(true))
          }
    })
}