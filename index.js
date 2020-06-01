document.addEventListener("DOMContentLoaded", () => {
    loginPage()
    const form = document.querySelector(".login_form");
    let userObject = {} 
    form.addEventListener("submit", (event) => {
        event.preventDefault()
        // console.log("form was hit")
        const username = event.currentTarget.querySelector("input").value
        fetch("http://localhost:3000/users").then(response => response.json())
            .then(json => { 
        let isfound = false;
        json.forEach(user => {
        if  (username == user.username) {
            const div = document.querySelector("#login");
            div.innerHTML = ""
            userObject = user;
            const watchListBtn = document.createElement("button");
            watchListBtn.innerText = "My WatchList";
            watchListBtn.style = "margin-left: 750px;"
            watchListBtn.classList = "btn-primary";
            watchListBtn.addEventListener("click", () => renderWatchlist(userObject));
            const header = document.querySelector("#navbar-btn");
            const logout = document.createElement("button");
            logout.innerText = "Logout";
            logout.classList = "btn-primary"
            logout.addEventListener("click", () => { 
                event.preventDefault();
                userObject = {};
                const row = document.querySelector(".row");
                row.innerHTML = ""
                const container = row.parentElement
                document.querySelector("#navbar-btn > button:nth-child(2)").parentElement.removeChild(document.querySelector("#navbar-btn > button:nth-child(2)"));
                document.querySelector("#navbar-btn > button:nth-child(2)").parentElement.removeChild(document.querySelector("#navbar-btn > button:nth-child(2)"));
                container.appendChild(row)
                loginPage()
            })
            header.append(watchListBtn, logout);
            isfound = true;
            return user;
        } 
    })
        if (!isfound) { 
            event.preventDefault()
            fetch("http://localhost:3000/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({username: username})
        }).then(response => response.json()).then(json => {
            const div = document.querySelector("#login");
            div.innerHTML = "";
            userObject = json;
            const watchListBtn = document.createElement("button");
            watchListBtn.innerText = "My WatchList";
            watchListBtn.style = "margin-left: 750px;";
            watchListBtn.classList = "btn-primary"
            watchListBtn.addEventListener("click", () => renderWatchlist(userObject));
            const header = document.querySelector("#header");
            const logout = document.createElement("button");
            logout.innerText = "Logout";
            logout.classList = "btn-primary"
            logout.addEventListener("click", () => { 
                event.preventDefault()
                userObject = {};
                const row = document.querySelector(".row");
                const container = row.parentElement
                row.innerHTML = ""
                container.appendChild(row);
                loginPage()
            })
            header.append(watchListBtn, logout);
            return json;
        })
        }

})
    })
    event.preventDefault()
    const searchBtn = document.querySelector("#search_btn");
    searchBtn.addEventListener("click", () => {
        event.preventDefault();
        whatUser(userObject);
        let searchTerm = document.querySelector("#search_term").value;
        const main = document.querySelector(".album");
        const container = document.querySelector(".album > .container");
        let row = document.querySelector(".album > .container > .row");
        row.innerHTML = ""
        container.append(row);
        main.append(container)
        searchForBook(searchTerm, userObject)
    })
    const homeIcon = document.querySelector("#navbar");
    homeIcon.addEventListener("click", () => {
        const main = document.querySelector(".album");
        const container = document.querySelector(".album > .container");
        let row = document.querySelector(".album > .container > .row");
        row.innerHTML = ""
        container.append(row);
        main.append(container)
    })
})

function renderWatchlist(userObject) {
    let bookIdArray = []
    let watchlistIdArray = []
    const mainDiv = document.querySelector(".album");
    const container = document.querySelector(".album > .container");
    let row = document.querySelector(".album > .container > .row");
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
            const bookDiv = document.createElement("div");
            bookDiv.classList = "col-md-4";
            bookDiv.dataset.id = userObject.id;
            const lastBookDiv = document.createElement("div");
            lastBookDiv.classList = "card md-4 box-shadow"
            const bookImg = document.createElement("img");
            bookImg.classList = "card-img-top"
            bookImg.alt = "Card image cap"
            const cardBodyDiv = document.createElement("div");
            cardBodyDiv.classList = "card-body";    
            const bookTitle = document.createElement("h4");
            bookTitle.classList.add("card-text")
            const bookDesc = document.createElement("p");
            bookDesc.classList.add("card-text")
            const outterBtnDiv = document.createElement("div");
            outterBtnDiv.classList = "d-flex justify-content-between align-items-center";
            const innerBtnDiv = document.createElement("div");
            innerBtnDiv.classList = "btn-group"
            const watchlistDeleteBtn = document.createElement("button");
            watchlistDeleteBtn.innerText = "Delete";
            watchlistDeleteBtn.id = "delete";
            watchlistDeleteBtn.addEventListener("click", () => deleteWatchlist(userObject, b, watchlistIdArray[bookIdArray.indexOf(b.id)]));
            bookTitle.innerText = b.title;
            if (!!b.snippet) {
                bookDesc.innerText = b.snippet
            }else {
                bookDesc.innerText = b.description;
            }
            bookImg.src = b.image;
            bookImg.addEventListener("click", () => showBook(b, userObject))
            innerBtnDiv.append(watchlistDeleteBtn);
            outterBtnDiv.append(innerBtnDiv);
            cardBodyDiv.append(bookTitle, bookDesc, outterBtnDiv);
            lastBookDiv.append(bookImg, cardBodyDiv);
            bookDiv.append(lastBookDiv);
            row.appendChild(bookDiv);
            container.appendChild(row);
            mainDiv.appendChild(container)
        }
    }))

}

function deleteWatchlist(userObject, book, watchlistId) {
    console.log(userObject, book);
    fetch(`http://localhost:3000/watchlists/${watchlistId}`, {
        method: "DELETE"
    })
    event.currentTarget.parentElement.parentElement.parentElement.parentElement.parentElement.remove()
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
    input.required = true;
    submit.type = "submit";
    submit.classList = "btn-primary"
    form.append(input, submit);
    div.append(h1, form);
}

function fetchBooks() {
    fetch("http://localhost:3000/books")
    .then(response => response.json())
    .then(json => json.forEach(book => renderBook(book)))
}

function renderBook(book, userObject) {
    const mainDiv = document.querySelector(".album");
    const container = document.querySelector(".album > .container");
    let row = document.querySelector(".album > .container > .row");
    const bookDiv = document.createElement("div");
    bookDiv.classList = "col-md-4";
    const lastBookDiv = document.createElement("div");
    lastBookDiv.classList = "card md-4 box-shadow"
    const bookImg = document.createElement("img");
    bookImg.classList = "card-img-top";
    bookImg.alt = "Card image cap"
    const cardBodyDiv = document.createElement("div");
    cardBodyDiv.classList = "card-body";
    const bookTitle = document.createElement("h4");
    bookTitle.classList.add("card-text")
    bookTitle.innerText = book.volumeInfo.title;
    const bookDesc = document.createElement("p");
    bookDesc.classList.add("card-text")
    if ("searchInfo" in book) {
        bookDesc.innerText = book.searchInfo.textSnippet
    }else {
        bookDesc.innerText = book.volumeInfo.description;
    }
    bookImg.src = book.volumeInfo.imageLinks.smallThumbnail;
    bookImg.addEventListener("click", () => showBook(book, userObject))
    const outterBtnDiv = document.createElement("div");
    outterBtnDiv.classList = "d-flex justify-content-between align-items-center";
    const innerBtnDiv = document.createElement("div");
    innerBtnDiv.classList = "btn-group";
    const watchlistBtn = document.createElement("button");
    watchlistBtn.classList = "btn btn-sm btn-outline-secondary";
    watchlistBtn.dataset.id = userObject.id;
    watchlistBtn.innerText = "Add to watchlist";
    watchlistBtn.addEventListener("click", () => {
        createBook(book, userObject)
    });
    innerBtnDiv.append(watchlistBtn);
    outterBtnDiv.append(innerBtnDiv);
    cardBodyDiv.append(bookTitle, bookDesc, outterBtnDiv)
    lastBookDiv.append(bookImg, cardBodyDiv)
    bookDiv.append(lastBookDiv);
    row.appendChild(bookDiv);
    container.appendChild(row);
    mainDiv.appendChild(container);
}

function createBook(book, userObject) {
    let id = event.currentTarget.dataset.id
    let bookData = {}
    if ("searchInfo" in book && book.saleInfo.saleability === "FOR_SALE") {
        bookData = {
            title: book.volumeInfo.title,
            description: book.volumeInfo.description,
            image: book.volumeInfo.imageLinks.smallThumbnail,
            snippet: book.searchInfo.textSnippet,
            publisher: book.volumeInfo.publisher,
            published_date: book.volumeInfo.publishedDate,
            isbn: book.volumeInfo.industryIdentifiers[1].identifier,
            category: book.volumeInfo.categories[0],
            rating: book.volumeInfo.averageRating,
            price: book.saleInfo.listPrice.amount,
            preview_link: book.volumeInfo.previewLink,
            id: userObject.id
        }
    }else {
        bookData = {
            title: book.volumeInfo.title,
            description: book.volumeInfo.description,
            image: book.volumeInfo.imageLinks.smallThumbnail,
            snippet: null,
            publisher: book.volumeInfo.publisher,
            published_date: book.volumeInfo.publishedDate,
            isbn: null,
            category: null,
            rating: null,
            price: null,
            preview_link: null,
            id: userObject.id
        }
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
    let term = document.querySelector("#search_term");
    term.value = ""
}

function selectOnlyThis(id) {
    for (var i = 1;i <= 2; i++)
    {
        document.getElementById("check" + i).checked = false;
    }
    document.getElementById(id).checked = true;
}

function showBook(book, userObject) {
    const mainDiv = document.querySelector(".album");
    const container = document.querySelector(".album > .container");
    let row = document.querySelector(".album > .container > .row");
    const bookDiv = document.createElement("div");
    row.innerHTML = ""
    bookDiv.classList = "col-md-4"
    const lastBookDiv = document.createElement("div");
    lastBookDiv.classList = "card md-4 box-shadow";
    const cardBodyDiv = document.createElement("div");
    cardBodyDiv.classList = "card-body";
    const bookTitle = document.createElement("h2");
    bookTitle.classList.add("card-text");
    const bookDesc = document.createElement("p");
    bookDesc.classList.add("card-text");
    const bookImg = document.createElement("img");
    bookImg.classList = ("card-img-top");
    const bookPub = document.createElement("p");
    bookPub.classList = "card-text";
    const bookPubDate = document.createElement("p");
    bookPubDate.classList = "card-text";
    const bookISBN = document.createElement("p");
    bookISBN.classList = "card-text";
    const bookCat = document.createElement("p");
    bookCat.classList = "card-text";
    const bookRating = document.createElement("p");
    bookRating.classList = "card-text";
    if ("volumeInfo" in book) {
        bookPub.innerText = `Publisher: ${book.volumeInfo.publisher}`;
        bookPubDate.innerText = `Publised on: ${book.volumeInfo.publishedDate}`;
        bookISBN.innerText = `ISBN: ${book.volumeInfo.industryIdentifiers[1].identifier}`;
        bookCat.innerText = `Category: ${book.volumeInfo.categories[0]}`;
        bookRating.innerText = `Rating: ${book.volumeInfo.averageRating}`;
        if (book.saleInfo.saleability === "FOR_SALE") {
            const bookPrice = document.createElement("p");
            bookPrice.classList = "card-text";
            bookPrice.innerText = `Price: $${book.saleInfo.listPrice.amount}`;
            const bookBuyLink = document.createElement("a");
            bookBuyLink.href = book.volumeInfo.previewLink;
            const buyLink = document.createElement("p");
            buyLink.classList = "card-text";
            buyLink.innerText = "Buy Now";
            bookBuyLink.appendChild(buyLink);
            bookDiv.append(bookPrice, bookBuyLink);
        }
        bookTitle.innerText = book.volumeInfo.title;
        bookDesc.innerText = book.volumeInfo.description;
        bookImg.src = book.volumeInfo.imageLinks.smallThumbnail;
    } else {
        bookPub.innerText = `Publisher: ${book.publisher}`;
        bookPubDate.innerText = `Published on: ${book.published_date}`;
        bookISBN.innerText = `ISBN: ${book.isbn}`;
        bookCat.innerText = `Category: ${book.category}`;
        bookRating.innerText = `Rating: ${book.rating}`;
        if (book.price != null) {
            const bookPrice = document.createElement("p");
            bookPrice.classList = "card-text";
            bookPrice.innerText = `Price: ${book.price}`;
            const bookBuyLink = document.createElement("a");
            bookBuyLink.href = book.preview_link;
            const buyLink = document.createElement("p");
            buyLink.classList = "card-text";
            buyLink.innerText = "Buy Now";
            bookBuyLink.appendChild(buyLink);
            bookDiv.append(bookPrice, bookBuyLink);
        }
        bookTitle.innerText = book.title;
        bookDesc.innerText = book.description;
        bookImg.src = book.image;
    }
    bookImg.addEventListener("click", () => showBook(book, userObject))
    const outterBtnDiv = document.createElement("div");
    outterBtnDiv.classList = "d-flex justify-content-between align-items-center";
    const innerBtnDiv = document.createElement("div");
    innerBtnDiv.classList = "btn-group";
    const watchlistBtn = document.createElement("button");
    watchlistBtn.classList = "btn btn-sm btn-outline-secondary";
    watchlistBtn.dataset.id = userObject.id;
    watchlistBtn.innerText = "Add to watchlist";
    watchlistBtn.addEventListener("click", () => {
        createBook(book, userObject)
    });
    innerBtnDiv.append(watchlistBtn);
    outterBtnDiv.append(innerBtnDiv);
    cardBodyDiv.append(bookTitle, bookDesc, bookPub, bookPubDate, bookISBN, bookCat, bookRating, outterBtnDiv)
    lastBookDiv.append(bookImg, cardBodyDiv)
    bookDiv.append(lastBookDiv);
    row.appendChild(bookDiv);
    container.appendChild(row);
    mainDiv.appendChild(container)
}