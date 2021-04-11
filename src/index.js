document.addEventListener("DOMContentLoaded", () => {

  fetchAllDogs()

  const filterButton = document.getElementById("good-dog-filter")
  filterButton.addEventListener("click", event => {
    const dogBar = document.getElementById("dog-bar")
    dogBar.innerHTML = ""
    if (event.target.textContent === "Filter good dogs: OFF") {
      event.target.textContent = "Filter good dogs: ON"
      fetchGoodDogs()
    } else {
      event.target.textContent = "Filter good dogs: OFF"
      fetchAllDogs()
    }
  })
  
  const dogBar = document.querySelector("#dog-bar")
  dogBar.addEventListener("click", event => {
    if (event.target.tagName === 'SPAN') {
      fetch(`http://localhost:3000/pups/${event.target.dataset.id}`)
      .then(resp => resp.json())
      .then(dogObject => renderClickedDog(dogObject))
    }
  })
  
  
})

const renderDogNameInDogBar = dogObject => {
  const dogNameSpan = document.createElement("span")
  dogNameSpan.textContent = `${dogObject.name}`
  dogNameSpan.dataset.id = `${dogObject.id}`
  
  const dogBar = document.querySelector("#dog-bar")
  dogBar.append(dogNameSpan)
}

const renderClickedDog = dogObject => {
  const dogInfo = document.querySelector("#dog-info")
  const goodDogButton = document.createElement("button")
  goodDogButton.id = "good-dog-button"
  goodDogButton.dataset.id = `${dogObject.id}`
  if (dogObject.isGoodDog) {
    goodDogButton.textContent = "Good Dog!"
  } else {
    goodDogButton.textContent = "Bad Dog!"
  }
  
  
  dogInfo.innerHTML = `
  <img src="${dogObject.image}">
  <h2>${dogObject.name}</h2>
  `
  dogInfo.append(goodDogButton)
  goodDogButton.addEventListener("click", toggleGoodOrBad)
}

const toggleGoodOrBad = event => {
  let data = {}
  
  if (event.target.textContent === "Good Dog!"){
    data = {isGoodDog: false}
  } else {
    data = {isGoodDog: true}
  }
  
  fetch(`http://localhost:3000/pups/${event.target.dataset.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(resp => resp.json())
  .then(dogObject => {
    if (dogObject.isGoodDog){
      alert(`${dogObject.name} has turned over a new leaf!`)
    } else {
      alert(`${dogObject.name} is starting to develop some bad behavior...`)
    }
  
    renderClickedDog(dogObject)
  })
}

const filterGoodDogs = arrOfDogObjects => arrOfDogObjects.filter(dogObj => {
  return dogObj.isGoodDog
})


const fetchGoodDogs = () => {
  fetch('http://localhost:3000/pups')
  .then(resp => resp.json())
  .then(arrOfDogObjects => {
    const goodDogs = filterGoodDogs(arrOfDogObjects)
    goodDogs.forEach(dogObject => renderDogNameInDogBar(dogObject))
  })
}

const fetchAllDogs = () => {
  fetch('http://localhost:3000/pups')
  .then(resp => resp.json())
  .then(arrOfDogObjects => arrOfDogObjects.forEach(dogObject => {
    renderDogNameInDogBar(dogObject)
  }))
}  