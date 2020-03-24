//super strech function: find a way to logout the user from the application without reloading the page

//if the user searches for a book via genre do not use text snippet only description
document.addEventListener("DOMContentLoaded", () => {
    loginPage()
    const form = document.querySelector("form");
    let userObject = {} 
    form.addEventListener("submit", (event) => {
        event.preventDefault()
        const username = event.currentTarget.querySelector("input").value
        fetch("http://localhost:3000/users").then(response => response.json())
            .then(json => { 
        let isfound = false;
        json.forEach(user => {
        if  (username == user.username) {
            const div = document.querySelector("#login");
            // div.parentNode.removeChild(div);
            div.innerHTML = ""
            userObject = user;
            const watchListBtn = document.createElement("button");
            watchListBtn.innerText = "My WatchList";
            watchListBtn.addEventListener("click", () => renderWatchlist(userObject));
            const header = document.querySelector("#header");
            const logout = document.createElement("button");
            logout.innerText = "Logout";
            logout.addEventListener("click", () => { 
                userObject = null;
                const container = document.querySelector(".container");
                //container.innerHTML = "";
                const row = document.querySelector(".row");
                row.innerHTML = ""
                header.innerHTML = ""
                loginPage()
            })
            header.append(watchListBtn, logout);
            isfound = true;
            return user;
        } 
    })
        if (!isfound) {
            fetch("http://localhost:3000/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({username: username})
        }).then(response => response.json()).then(json => {
            const div = document.querySelector("#login");
            // debugger
            // div.parentNode.removeChild(div);
            div.innerHTML = "";
            userObject = json;
            const watchListBtn = document.createElement("button");
            watchListBtn.innerText = "My WatchList";
            watchListBtn.addEventListener("click", () => renderWatchlist(userObject));
            const header = document.querySelector("#header");
            const logout = document.createElement("button");
            logout.innerText = "Logout";
            logout.addEventListener("click", () => { 
                userObject = null;
                const container = document.querySelector(".container");
                //container.innerHTML = "";
                const row = document.querySelector(".row");
                row.innerHTML = ""
                header.innerHTML = "";
                loginPage()
            })
            header.append(watchListBtn, logout);
            return json;
        })
        }

})
    })
    
    const searchBtn = document.querySelector("#search_btn");
    searchBtn.addEventListener("click", () => {
        whatUser(userObject);
        let searchTerm = document.querySelector("#search_term").value;
        let container = document.querySelector(".container");
        //container.innerText = "";
        const row = document.querySelector(".row");
        row.innerHTML = ""
        searchForBook(searchTerm, userObject)
    })
})

function renderWatchlist(userObject) {
    let bookIdArray = []
    let watchlistIdArray = []
    const container = document.querySelector(".container");
    // container.dataset.id = userObject.id
    //container.innerHTML = "";
    const row = document.querySelector(".row");
    row.innerHTML = ""
    fetch("http://localhost:3000/watchlists")
    .then(response => response.json())
    .then(json => {
        for (let i = 0; i < json.length; i++) {
            if (json[i].user_id === userObject.id) {
                bookIdArray.push(json[i].book_id);
                watchlistIdArray.push(json[i].id)
            }
    }})

    fetch("http://localhost:3000/books")
    .then(response => response.json())
    .then(json => json.forEach(b => {
        if (bookIdArray.includes(b.id)) {
            // const container = document.querySelector("#container");
            // container.innerHTML = "";
            const bookDiv = document.createElement("div");
            bookDiv.classList.add("card-body");//book")
            bookDiv.dataset.id = userObject.id;
            bookDiv.style = "width: 21em;"
            const bookTitleDiv = document.createElement("div");
            bookTitleDiv.classList.add("card-text")//book_title");
            bookTitleDiv.style = "text-align: center; font-weight: bold;"
            const bookDescDiv = document.createElement("div");
            bookDescDiv.classList.add("card-text")//book_desc");
            bookDescDiv.style = "text-align: center;"
            const newImgDiv = document.createElement("div");
            newImgDiv.classList = "card-image";
            const bookImgDiv = document.createElement("img");
            const watchlistDeleteBtn = document.createElement("button");
            watchlistDeleteBtn.innerText = "Delete";
            watchlistDeleteBtn.addEventListener("click", () => deleteWatchlist(userObject, b, watchlistIdArray[bookIdArray.indexOf(b.id)]));
            bookImgDiv.classList = ("bd-placeholder-img card-img-top");//book_img");
            bookTitleDiv.innerText = b.title;
            bookDescDiv.innerText = b.description;
            bookImgDiv.src = b.image;
            newImgDiv.appendChild(bookImgDiv);
            newImgDiv.style = `background: url(${bookImgDiv.src});`
            bookDiv.append(newImgDiv, bookTitleDiv, bookDescDiv,  watchlistDeleteBtn);
            row.appendChild(bookDiv);
            container.appendChild(row)//bookDiv);
        }
    }))

}

function deleteWatchlist(userObject, book, watchlistId) {
    console.log(userObject, book);
    // console.log(book).
    // debugger

    fetch(`http://localhost:3000/watchlists/${watchlistId}`, {
        method: "DELETE"
    })
    event.target.parentElement.remove()
}

function whatUser(userObject){
    console.log(userObject);
}

function loginPage() {
    const div = document.querySelector("#login");
    const h1 = document.createElement("h1");
    const form = document.createElement("form");
    const input = document.createElement("input");
    const submit = document.createElement("input");
    h1.innerText = "Login with a username";
    form.classList = "login_form";
    input.placeholder = "username";
    submit.type = "submit";
    form.append(input, submit);
    div.append(h1, form);
}

function fetchBooks() {
    fetch("http://localhost:3000/books")
    .then(response => response.json())
    .then(json => json.forEach(book => renderBook(book)))
}

function renderBook(book, userObject) {
    const container = document.querySelector(".container");
    const row = document.querySelector(".row");
    const bookDiv = document.createElement("div");
    bookDiv.classList.add("card-body");//book")
    bookDiv.style = "width: 21em;"
    const bookTitleDiv = document.createElement("div");
    bookTitleDiv.classList.add("card-text")//book_title");
    bookTitleDiv.style = "text-align: center; font-weight: bold;"
    const bookDescDiv = document.createElement("div");
    bookDescDiv.classList.add("card-text")//book_desc");
    bookDescDiv.style = "text-align: center;"
    const newImgDiv = document.createElement("div");
    newImgDiv.classList = "card-image";
    const bookImgDiv = document.createElement("img");
    bookImgDiv.classList = ("bd-placeholder-img card-img-top");//book_img");
    bookTitleDiv.innerText = book.volumeInfo.title;
    bookDescDiv.innerText = book.searchInfo.textSnippet// .volumeInfo.description;
    bookImgDiv.src = book.volumeInfo.imageLinks.smallThumbnail;
    bookImgDiv.addEventListener("click", () => showBook(book, userObject))
    const watchlistBtn = document.createElement("button");
    watchlistBtn.classList.add("watchlist_btn");
    watchlistBtn.dataset.id = userObject.id;
    watchlistBtn.innerText = "Add to watchlist";
    watchlistBtn.addEventListener("click", () => {
        createBook(book, userObject)
    });
    newImgDiv.appendChild(bookImgDiv);
    newImgDiv.style = `background: url(${bookImgDiv.src});`
    bookDiv.append(newImgDiv, bookTitleDiv, bookDescDiv,  watchlistBtn);
    row.appendChild(bookDiv);
    container.appendChild(row)//bookDiv);
}

function createBook(book, userObject) {
    let id = event.currentTarget.dataset.id
    let bookData = {
        title: book.volumeInfo.title,
        description: book.volumeInfo.description,
        image: book.volumeInfo.imageLinks.smallThumbnail,
        id: userObject.id//id
    }
    return fetch("http://localhost:3000/watchlists", { 
        method: "POST", 
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(bookData)
    }).then(response => response.json()).then(data => console.log(data))
}

function searchForBook(searchTerm, userObject) {
    if (event.target.parentElement.querySelector("#check1").checked) {
        fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchTerm}`)
        .then(response => response.json())
        .then(json => json.items.forEach(book => renderBook(book, userObject)))
    } else {
        fetch(`https://www.googleapis.com/books/v1/volumes?q=subject:${searchTerm}`)
        .then(response => response.json())
        .then(json => json.items.forEach(book => renderBook(book, userObject)))
    }
}

function selectOnlyThis(id) {
    for (var i = 1;i <= 2; i++)
    {
        document.getElementById("check" + i).checked = false;
    }
    document.getElementById(id).checked = true;
}

function showBook(book, userObject) {
    let container = document.querySelector(".container");
    // container.innerHTML = "";
    let row = document.querySelector(".row");
    row.innerHTML = ""
    const bookDiv = document.createElement("div");
    bookDiv.classList.add("card-body");//book")
    bookDiv.style = "width: 21em;"
    const bookTitleDiv = document.createElement("div");
    bookTitleDiv.classList.add("book_title");
    bookTitleDiv.style = "text-align: center; font-weight: bold;"
    const bookDescDiv = document.createElement("div");
    bookDescDiv.classList.add("book_desc");
    bookDescDiv.style = "text-align: center;"
    const bookImgDiv = document.createElement("img");
    bookImgDiv.classList = ("bd-placeholder-img card-img-top");//book_img");
    const bookPubDiv = document.createElement("div");
    bookPubDiv.classList = "book_pub"
    bookPubDiv.innerText = book.volumeInfo.publisher;
    const bookPubDateDiv = document.createElement("div");
    bookPubDateDiv.classList = "book_date";
    bookPubDateDiv.innerText = book.volumeInfo.publishedDate;
    const bookISBNDiv = document.createElement("div");
    bookISBNDiv.classList = "book_isbn";
    bookISBNDiv.innerText = book.volumeInfo.industryIdentifiers[1].identifier;
    const bookCatDiv = document.createElement("div");
    bookCatDiv.classList = "book_cat";
    bookCatDiv.innerText = book.volumeInfo.categories[0];
    const bookRatingDiv = document.createElement("div");
    bookRatingDiv.classList = "book_rating";
    bookRatingDiv.innerText = book.volumeInfo.averageRating;
    if (book.saleInfo.saleability === "FOR_SALE") {
        const bookPrice = document.createElement("div");
        bookPrice.classList = "book_price";
        bookPrice.innerText = book.saleInfo.listPrice.amount;
        const bookBuyLink = document.createElement("a");
        bookBuyLink.href = book.volumeInfo.previewLink;
        const buyLinkDiv = document.createElement("div");
        buyLinkDiv.classList = "book_link";
        buyLinkDiv.innerText = "Buy Now";
        bookBuyLink.appendChild(buyLinkDiv);
        bookDiv.append(bookPrice, bookBuyLink);
    }
    bookTitleDiv.innerText = book.volumeInfo.title;
    bookDescDiv.innerText = book.volumeInfo.description;
    bookImgDiv.src = book.volumeInfo.imageLinks.smallThumbnail;
    bookImgDiv.addEventListener("click", () => showBook(book, userObject))
    const watchlistBtn = document.createElement("button");
    watchlistBtn.classList.add("watchlist_btn");
    watchlistBtn.dataset.id = userObject.id;
    watchlistBtn.innerText = "Add to watchlist";
    watchlistBtn.addEventListener("click", () => {
        createBook(book, userObject)
    });
    bookDiv.append(bookImgDiv, bookTitleDiv, bookDescDiv, bookPubDiv, bookPubDateDiv, bookISBNDiv, bookCatDiv, bookRatingDiv, watchlistBtn);
    row.appendChild(bookDiv)
    container.appendChild(row);//bookDiv);
}