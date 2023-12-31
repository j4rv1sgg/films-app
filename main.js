let options
let selectedOptions = []
let isTimerRunning = false
let countdown
let currentLatency = 0;

let timerCounter = document.querySelector('[data-name="timer"]')

let customButton = document.querySelector('[data-name="timer-custom"]')
let timerButtons = document.querySelector('.timer__buttons')

let timer0 = document.querySelector('[data-name="timer-immediately"]')
let timer5 = document.querySelector('[data-name="timer-5"]')
let timer10 = document.querySelector('[data-name="timer-10"]')

addOnClick(timer0, ()=>setLatency(0))
addOnClick(timer5, ()=>setLatency(5))
addOnClick(timer10, ()=>setLatency(10))

addOnClick(customButton, ()=>createTimerInput(timerButtons))

function setLatency(value){
    currentLatency = value;
}

function createTimerInput(element) {
    let createdInput = document.querySelector('[data-name="timer-custom-input"]');
    let createdButton = document.querySelector('[data-name="timer-custom-button"]');
    
    if (!createdInput || !createdButton) {
        const timerInputTemplate = `
        <input data-name="timer-custom-input" type="number">
        <button data-name="timer-custom-button">OK</button>
        `;
        element.insertAdjacentHTML('afterend', timerInputTemplate);

        createdInput = document.querySelector('[data-name="timer-custom-input"]');
        createdButton = document.querySelector('[data-name="timer-custom-button"]');

        createdInput.onkeydown = () => handleInput(event);
        addOnClick(createdButton, ()=>setLatency(createdInput.value))
    } else { 
            createdInput.remove()
            createdButton.remove()
    }
}

function timer(seconds, cb) {
    isTimerRunning = true
    
    let removeCancelButton = addStopButton()
    
    const currentTime = Date.now();
    const endTime  = currentTime + seconds * 1000;
    
    displayTimeLeft(seconds)
    
    countdown = setInterval(() => {
        const secondsLeft = Math.round((endTime - Date.now()) / 1000)

        if (secondsLeft < 0){
            clearInterval(countdown)
            cb()
            removeCancelButton()
            isTimerRunning = false
            return
        }

        displayTimeLeft(secondsLeft)
    }, 1000);

}

function displayTimeLeft(seconds){
    const minutesLeft = Math.floor(seconds / 60)
    const secondsLeft = seconds % 60;
    timerCounter.textContent = `${minutesLeft < 10 ? '0' + minutesLeft : minutesLeft}:${secondsLeft < 10 ? '0' + secondsLeft : secondsLeft}`
}


function addStopButton(){
    let button = document.createElement('button')
    button.textContent = 'Cancel'

    addOnClick(button, ()=>{
        clearInterval(countdown)
        isTimerRunning = false
        removeButton()
        timerCounter.textContent = "00:00"
    })
    
    timerCounter.insertAdjacentElement('afterend', button)
    
    function removeButton(){
        button.remove()
    }
    return removeButton
}

function handleInput(event) {
    if (event.key === '+' || event.key === '-' || event.key === '.' || event.key === ',') {
      event.preventDefault();
    } 
}

let input = document.querySelector('[data-name="films-search-input"]')
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
    input.insertAdjacentElement('afterend', dropdown)
    
}

function fillOptions(ul, options){
    ul.innerHTML = ''
    options.map((item)=>{
        let li = document.createElement('li')
        li.textContent = item.show.name
        addOnClick(li, ()=>currentLatency ? setTimer(item.show.id) : addToFavorite(item.show.id))//
        ul.appendChild(li)
    })
}

function setTimer(id){
    !isTimerRunning ? timer(currentLatency, ()=>addToFavorite(id)) : console.log('Timer already is running')
    
}

function addOnClick(element, func){
    element.addEventListener('click', func)
}

async function addOnInput(input, func){
    input.addEventListener('input', (e) => func(e))
}


let currentRequest = null;

async function onInput(e){
    if(e.target.value.trim()){

        if (currentRequest) {
            currentRequest.abort();
            
        }

        const controller = new AbortController();
        currentRequest = controller;
        
        try {
            await request(e.target.value, controller.signal).then(()=>{
            fillOptions(dropdown, options)
            setVisible(dropdown, true)
        })
        } catch (error) {
            if (error.name === 'AbortError') {
              console.log('Request was cancelled');
            } else {
              console.log('Error:', error.message);
            }
        }
    } else setVisible(dropdown, false)
}


async function request(value, signal){
    
    const response = await fetch(`https://api.tvmaze.com/search/shows?q=${value}`, { signal })
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
    
    if(item.show.image !== null){
        img.src = item.show.image.medium
    } else {
        img.src = 'https://www.shutterstock.com/image-illustration/no-picture-available-placeholder-thumbnail-260nw-2226533855.jpg'
    }
    
    img.className = 'card__img'

    addOnClick(img, ()=>showInterface(false, item))

    card.appendChild(img)

    let genres = document.createElement('p')
    genres.textContent = `Genres: ${item.show.genres.join(', ')}`

    card.appendChild(genres)
    
    let removeButton = document.createElement('button')
    removeButton.className = 'card__remove'
    removeButton.textContent = 'Remove'

    addOnClick(removeButton, ()=>{
        card.remove()
        selectedOptions = selectedOptions.filter((el)=>el === item)
    })

    card.appendChild(removeButton)

    placeToInsert.appendChild(card)

}

function renderShowPage(item){                       
    let backButton = document.createElement('div')
    backButton.innerHTML = 'Go back'
    backButton.style.color = 'white'
    
    let showPage = document.createElement('div')
    showPage.innerHTML = drawCardOnPage(item)
    showPage.style.margin = "0 auto"
    document.querySelector('.films__wrapper').appendChild(showPage)

    addOnClick(backButton, ()=>{
                                showInterface(true, item)
                                showPage.remove()
                                backButton.remove()
                                })
    document.querySelector('.top-bar').appendChild(backButton)
    
}

function drawCardOnPage(item){
    return `
        <div class="card__onPage">
            <p>${item.show.name}</p>
            <img src="${item.show.image.medium !== null ? item.show.image.medium : 'https://www.shutterstock.com/image-illustration/no-picture-available-placeholder-thumbnail-260nw-2226533855.jpg'}" />
            <p>Genres: ${item.show.genres.join(', ')}</p>
            <p>Language: ${item.show.language}</p>
            </br>
            <p>Status: ${item.show.status} </p>
        `
}

function showInterface(value, item){
    let search = document.querySelector('.films__search')
    let timer = document.querySelector('.films__timer')

    if(value){
        search.style.display = 'block'
        cards.style.display = 'block'
        timer.style.display = 'block'
    } else {
        search.style.display = 'none'
        cards.style.display = 'none'
        timer.style.display = 'none'
        renderShowPage(item)

    }
}






