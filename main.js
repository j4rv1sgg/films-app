
let options;
let selectedOptions = []

let input = document.querySelector('.films__search-input')
createDropdown(input, 'dropdown')
let dropdown = document.querySelector('.dropdown')

let cards = document.querySelector('.films__cards')

setVisible(dropdown, false);
addOnInput(input, onInput)


function setVisible(element, value){
    value ? element.style.display = 'block' : element.style.display = 'none' 
}

function createDropdown(input, className){
    let dropdown = document.createElement('ul')
    dropdown.className = className;
    // fillOptions(dropdown, options)
    input.insertAdjacentElement('afterend', dropdown)
    
}

function fillOptions(ul, options){
    ul.innerHTML = ''
    options.map((item)=>{
        let li = document.createElement('li')
        li.textContent = item.show.name
        addOnClick(li, ()=>addToFavorite(item.show.id))
        ul.appendChild(li)
    })
}

function addOnClick(element, func){
    element.addEventListener('click', func)
}

async function addOnInput(input, func){
    input.addEventListener('input', (e) => func(e))
}

async function onInput(e){
    if(e.target.value.trim()){
        await request(e.target.value).then(()=>{
            fillOptions(dropdown, options)
            setVisible(dropdown, true)
        })
        
        
    } else setVisible(dropdown, false)
}

async function request(value){
    const response = await fetch(`https://api.tvmaze.com/search/shows?q=${value}`)
    options = await response.json()
    
    
    return options
}

function addToFavorite(id){
    let item = options.find((item) => id == item.show.id)
    if (!selectedOptions.includes(item)){
        selectedOptions.push(item)
        drawShowCard(item, cards)
    }
    
}

function drawShowCard(item, placeToInsert){
    let card = document.createElement('div')
    card.className = 'films__cards-item'

    let title = document.createElement('p')
    title.textContent = item.show.name

    card.appendChild(title)

    let img = document.createElement('img')

    if(item.show.image.medium == null){
        img.src = item.show.image.medium
    } else img.src = 'https://www.shutterstock.com/image-illustration/no-picture-available-placeholder-thumbnail-260nw-2226533855.jpg'
    
    img.className = 'card__img'

    card.appendChild(img)

    let genres = document.createElement('p')
    genres.textContent = `Genres: ${item.show.genres.join(', ')}`

    card.appendChild(genres)
    
    let removeButton = document.createElement('button')
    removeButton.className = 'card__remove'
    removeButton.textContent = 'Remove'
    addOnClick(removeButton, ()=>{

    })

    card.appendChild(removeButton)

    placeToInsert.appendChild(card)

}




















// {"score":0.90978205,
// "show":{"id":139,
// "url":"https://www.tvmaze.com/shows/139/girls",
// "name":"Girls",
// "type":"Scripted",
// "language":"English",
// "genres":["Drama","Romance"],
// "status":"Ended","runtime":30,
// "averageRuntime":30,
// "premiered":"2012-04-15",
// "ended":"2017-04-16",
// "officialSite":"http://www.hbo.com/girls",
// "schedule":{"time":"22:00","days":["Sunday"]},
// "rating":{"average":6.6},
// "weight":97,
// "network":{"id":8,"name":"HBO","country":{"name":"United States","code":"US","timezone":"America/New_York"},
// "officialSite":"https://www.hbo.com/"},
// "webChannel":null,
// "dvdCountry":null,
// "externals":{"tvrage":30124,"thetvdb":220411,"imdb":"tt1723816"},
// "image":{"medium":"https://static.tvmaze.com/uploads/images/medium_portrait/31/78286.jpg",
// "original":"https://static.tvmaze.com/uploads/images/original_untouched/31/78286.jpg"},
// "summary":"<p>This Emmy winning series is a comic look at the assorted humiliations and rare triumphs of a group of girls in their 20s.</p>",
// "updated":1611310521,
// "_links":{"self":{"href":"https://api.tvmaze.com/shows/139"},
// "previousepisode":{"href":"https://api.tvmaze.com/episodes/1079686"}}}}


















































// let countdown;
// let timerDiv = document.querySelector('.timer')
// let input = document.querySelector('.input')
// let button = document.querySelector('.ok')
// button.addEventListener('click', () => {!isRunning ? start(input) : alert('Timer is already running!')})
// let isRunning = false



// function timer(seconds) {
//   isRunning = true
//   const now = Date.now();
//   const then = now + seconds * 1000;

//   displayTimeLeft(seconds)
 
//   countdown = setInterval(() => {
//     const secondsLeft = Math.round((then - Date.now()) / 1000)
//     if (secondsLeft < 0){
//         clearInterval(countdown)
//         timerDiv.textContent = "Sosi huy"
//         isRunning = false
//         return
//     }
//     displayTimeLeft(secondsLeft)
//   }, 1000);
  
//   }



// function displayTimeLeft(seconds){
//     const minutesLeft = Math.floor(seconds / 60)
//     const secondsLeft = seconds % 60;
//     timerDiv.textContent = `${minutesLeft < 10 ? '0' + minutesLeft : minutesLeft}:${secondsLeft < 10 ? '0' + secondsLeft : secondsLeft}`
// }
// function start(input){
//     timer(input.value)

// }




 