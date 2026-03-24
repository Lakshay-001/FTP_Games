const container = document.getElementById("games-container")
const loader = document.getElementById("loader")
/* there was a slight error in the permissions of this api so i had to use another method to fetch it which I saw on its website (source: https://rapidapi.com/digiwalls/api/free-to-play-games-database/playground/apiendpoint_a8770385-fce7-47cc-82b6-6d1ce4b13fe2)
*/
const options = {
method: 'GET',
headers: {
'X-RapidAPI-Key': '9b5734fb40msh23c0f35133ad8f1p15cdf4jsndc65e5654ee6',
'X-RapidAPI-Host': 'free-to-play-games-database.p.rapidapi.com'
}
}

fetch('https://free-to-play-games-database.p.rapidapi.com/api/games', options)
.then(res => res.json())
.then(data => {
loader.style.display = "none"

data.slice(0,400).forEach(game => {
const card = document.createElement("div")
card.className = "card"

card.innerHTML = `
<img src="${game.thumbnail}" />
<h3>${game.title}</h3>
<p>${game.genre} • ${game.platform}</p>
`

container.appendChild(card)
})
})
.catch(err => {
console.log(err)
loader.innerText = "Failed to load games"
})