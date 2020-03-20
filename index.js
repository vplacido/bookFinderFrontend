document.addEventListener("DOMContentLoaded", () => {
    fetchBooks();
    const searchBtn = document.querySelector("#search_btn");
    searchBtn.addEventListener("click", () => {
        let searchTerm = document.querySelector("#search_term").value;
        // debugger
        searchForBook(searchTerm)
    })
})

function fetchBooks() {
    fetch("http://localhost:3000/books")
    .then(response => response.json())
    .then(json => json.forEach(book => renderBook(book)))
}

function renderBook(book) {
    console.log(book);
    const container = document.querySelector("#container");
    const bookDiv = document.createElement("div");
    bookDiv.classList.add("book")
    const bookTitleDiv = document.createElement("div");
    bookTitleDiv.classList.add("book_title");
    const bookDescDiv = document.createElement("div");
    bookDescDiv.classList.add("book_desc");
    const bookImgDiv = document.createElement("img");
    bookImgDiv.classList.add("book_img");
    bookTitleDiv.innerText = book.title;
    bookDescDiv.innerText = book.description;
    bookImgDiv.src = book.image;
    const watchlistBtn = document.createElement("button");
    watchlistBtn.classList.add("watchlist_btn");
    watchlistBtn.innerText = "Add to watchlist";
    watchlistBtn.addEventListener("click", addToWatchlist(book));
    bookDiv.append(bookTitleDiv, bookDescDiv, bookImgDiv, watchlistBtn);
    container.appendChild(bookDiv);
}

function addToWatchlist(book) {
    // let data = {
    //     user_id: user.id,
    //     book_id: book.id
    // }
    // fetch("http://localhost:3000/watchlists", {
    //     method: "POST", 
    //     headers: {
    //         "application/json"
    //     }
    //     body: JSON.stringify()
    // }).then(response => response.json())
}

function searchForBook(searchTerm) {
    fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchTerm}`)
    .then(response => response.json())
    .then(json => console.log(json))
}