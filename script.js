const container = document.getElementById("games-container")
const loader = document.getElementById("loader")
const search = document.getElementById("search")
const genreFilter = document.getElementById("genreFilter")
const sortGames = document.getElementById("sortGames")
const themeToggle = document.getElementById("themeToggle")
const THEME_KEY = "gamevault-theme"
let allGames = []

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
    allGames = data.slice(0, 400)
    showGames(allGames)
    //console.log(data)
  })
  .catch(err => {
    console.log(err)
    loader.innerText = "Failed to load games"
  })

function showGames(games) {
  loader.style.display = "none"
  container.innerHTML = ""

  if (!games.length) {
    container.innerHTML = `
      <div class="empty-state">
        <h2>No games found</h2>
        <p>Try a different search, genre, or platform filter.</p>
      </div>
    `
    return
  }

  games.forEach(game => {
    const card = document.createElement("div")
    card.className = "card"
    card.innerHTML = `
      <img src="${game.thumbnail}" />
      <div class="card-content">
        <div class="meta">
          <span class="pill">${game.genre}</span>
          <span class="platform">${game.platform}</span>
        </div>
        <h3>${game.title}</h3>
        <a class="cta" href="${game.game_url}" target="_blank" rel="noopener noreferrer">Play now</a>
      </div>
    `
    container.appendChild(card)
  })
}

function updateGames() {
  let filtered = [...allGames]
  const searchValue = search.value.toLowerCase()
  filtered = filtered.filter(game =>
    game.title.toLowerCase().includes(searchValue)
  )
  if (genreFilter.value !== "all") {
    filtered = filtered.filter(
      game => game.genre === genreFilter.value
    )
  }
  if (sortGames.value !== "all") {
  filtered = filtered.filter(
    game => game.platform === sortGames.value
  )
}
  showGames(filtered)
}
search.addEventListener("input", updateGames)
genreFilter.addEventListener("change", updateGames)
sortGames.addEventListener("change", updateGames)

function applyTheme(theme) {
  document.body.classList.toggle("light", theme === "light")
  themeToggle.textContent = theme === "light" ? "Dark mode" : "Light mode"
  themeToggle.setAttribute(
    "aria-label",
    `Switch to ${theme === "light" ? "dark" : "light"} mode`
  )
}

function getPreferredTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY)
  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme
  }

  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark"
}

let currentTheme = getPreferredTheme()
applyTheme(currentTheme)

themeToggle.addEventListener("click", () => {
  currentTheme = currentTheme === "light" ? "dark" : "light"
  localStorage.setItem(THEME_KEY, currentTheme)
  applyTheme(currentTheme)
})
