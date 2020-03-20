document.addEventListener("DOMContentLoaded", () => {
    // fetchBooks();
    const searchBtn = document.querySelector("#search_btn");
    searchBtn.addEventListener("click", () => {
        let searchTerm = document.querySelector("#search_term").value;
        let container = document.querySelector("#container");
        container.innerText = "";
        searchForBook(searchTerm)
    })
})

function fetchBooks() {
    fetch("http://localhost:3000/books")
    .then(response => response.json())
    .then(json => json.forEach(book => renderBook(book)))
}

function renderBook(book) {
    const container = document.querySelector("#container");
    const bookDiv = document.createElement("div");
    bookDiv.classList.add("book")
    const bookTitleDiv = document.createElement("div");
    bookTitleDiv.classList.add("book_title");
    const bookDescDiv = document.createElement("div");
    bookDescDiv.classList.add("book_desc");
    const bookImgDiv = document.createElement("img");
    bookImgDiv.classList.add("book_img");
    bookTitleDiv.innerText = book.volumeInfo.title;
    bookDescDiv.innerText = book.volumeInfo.description;
    bookImgDiv.src = book.volumeInfo.imageLinks.smallThumbnail;
    const watchlistBtn = document.createElement("button");
    watchlistBtn.classList.add("watchlist_btn");
    watchlistBtn.dataset.id = 1;
    watchlistBtn.innerText = "Add to watchlist";
    watchlistBtn.addEventListener("click", () => {
        createBook(book)
    });
    bookDiv.append(bookTitleDiv, bookDescDiv, bookImgDiv, watchlistBtn);
    container.appendChild(bookDiv);
}

function createBook(book) {
    let id = event.currentTarget.dataset.id
    let bookData = {
        title: book.volumeInfo.title,
        description: book.volumeInfo.description,
        image: book.volumeInfo.imageLinks.smallThumbnail,
        id: id
    }
    return fetch("http://localhost:3000/watchlists", { 
        method: "POST", 
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(bookData)
    }).then(response => response.json()).then(data => console.log(data))
}

function addToWatchlist(book) {
    debugger
    let data = {
        user_id: 1,
        book_id: book.id
    }
    debugger;
    fetch("http://localhost:3000/watchlists", {
        method: "POST", 
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }).then(response => response.json())
}

function searchForBook(searchTerm) {
    fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchTerm}`)
    .then(response => response.json())
    .then(json => json.items.forEach(book => renderBook(book)))
}