export function skeletonRender(identifier){
    const searchResultsTemplate = document.getElementById('searchTemplate')
    const cardTemplate = document.getElementById('card-template')
    if(identifier === 'productCard'){
        let contentContainer = document.querySelectorAll('.contentContainer')
        contentContainer.forEach((container)=>{
        for (let i = 0; i < 6; i++) {
            container.append(cardTemplate.content.cloneNode(true))
          }
    })
    }
    if(identifier === 'searchResults'){
        let searchResultsBox = document.getElementById('searchResult')
        for (let i = 0; i < 6; i++) {
            searchResultsBox.append(searchResultsTemplate.content.cloneNode(true))
          }
    }
    
}