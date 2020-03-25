//super strech function: find a way to logout the user from the application without reloading the page

//fix width of row with only one book
//fix the logout page when a user logs out and attempts to login again the page reloads, fix the issue

document.addEventListener("DOMContentLoaded", () => {
    loginPage()
    const form = document.querySelector(".login_form");
    let userObject = {} 
    form.addEventListener("submit", (event) => {
        // debugger
        event.preventDefault()
        console.log("form was hit")
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
            watchListBtn.style = "margin-left: 750px;"
            watchListBtn.classList = "btn-primary";
            watchListBtn.addEventListener("click", () => renderWatchlist(userObject));
            const header = document.querySelector("#navbar-btn");//.container d-flex justify-content-between");// #header");
            const logout = document.createElement("button");
            logout.innerText = "Logout";
            logout.classList = "btn-primary"
            logout.addEventListener("click", () => { 
                event.preventDefault();
                userObject = {};
                // const container = document.querySelector(".container");
                //container.innerHTML = "";
                const row = document.querySelector(".row");
                row.innerHTML = ""
                const container = row.parentElement
                // header.innerHTML = ""
                // document.querySelector("#header > button").parentElement.removeChild(document.querySelector("#header > button"))
                // document.querySelector("#header > button").parentElement.removeChild(document.querySelector("#header > button"))
                document.querySelector("#navbar-btn > button:nth-child(2)").parentElement.removeChild(document.querySelector("#navbar-btn > button:nth-child(2)"));
                document.querySelector("#navbar-btn > button:nth-child(2)").parentElement.removeChild(document.querySelector("#navbar-btn > button:nth-child(2)"));
                // debugger
                container.appendChild(row)
                loginPage()
            })
            // debugger
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
            // debugger
            // div.parentNode.removeChild(div);
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
                // const container = document.querySelector(".container");
                // //container.innerHTML = "";
                // const row = document.querySelector(".row");
                const row = document.querySelector(".row");
                const container = row.parentElement
                row.innerHTML = ""
                // header.innerHTML = "";
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
        whatUser(userObject);
        let searchTerm = document.querySelector("#search_term").value;
        // let container = document.querySelector(".container");
        //container.innerText = "";
        const row = document.querySelector(".row");
        const container = row.parentElement
        row.innerHTML = ""
        container.append(row);
        searchForBook(searchTerm, userObject)
    })
})


//stopped working here



function renderWatchlist(userObject) {
    let bookIdArray = []
    let watchlistIdArray = []
    const mainDiv = document.querySelector(".album");
    // debugger;
    const container = document.querySelector(".album > .container");
    // debugger
    let row = document.querySelector(".album > .container > .row");
    // const container = document.querySelector(".container");
    // container.dataset.id = userObject.id
    //container.innerHTML = "";
    // const row = document.querySelector(".row");
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
            bookDiv.classList = "col-md-4";//.add("card-body");//book")
            bookDiv.dataset.id = userObject.id;
            // bookDiv.style = "width: 21em;"
            const lastBookDiv = document.createElement("div");
            lastBookDiv.classList = "card md-4 box-shadow"
            const bookImg = document.createElement("img");
            bookImg.classList = "card-img-top"
            bookImg.alt = "Card image cap"
            const cardBodyDiv = document.createElement("div");
            cardBodyDiv.classList = "card-body";    
            const bookTitle = document.createElement("h4");
            bookTitle.classList.add("card-text")//book_title");
            // bookTitleDiv.style = "text-align: center; font-weight: bold;"
            const bookDesc = document.createElement("p");
            bookDesc.classList.add("card-text")//book_desc");
            // bookDescDiv.style = "text-align: center;"
            // const newImgDiv = document.createElement("div");
            // newImgDiv.classList = "card-image";
            // const bookImgDiv = document.createElement("img");
            const outterBtnDiv = document.createElement("div");
            outterBtnDiv.classList = "d-flex justify-content-between align-items-center";
            const innerBtnDiv = document.createElement("div");
            innerBtnDiv.classList = "btn-group"
            const watchlistDeleteBtn = document.createElement("button");
            watchlistDeleteBtn.innerText = "Delete";
            watchlistDeleteBtn.addEventListener("click", () => deleteWatchlist(userObject, b, watchlistIdArray[bookIdArray.indexOf(b.id)]));
            // bookImgDiv.classList = ("bd-placeholder-img card-img-top");//book_img");
            bookTitle.innerText = b.title;
            // bookDescDiv.innerText = b.description;
            if (!!b.snippet) {
                bookDesc.innerText = b.snippet
            }else {
                bookDesc.innerText = b.description;
            }
            bookImg.src = b.image;
            // debugger;
            bookImg.addEventListener("click", () => showBook(b, userObject))

            innerBtnDiv.append(watchlistDeleteBtn);
            outterBtnDiv.append(innerBtnDiv);
            cardBodyDiv.append(bookTitle, bookDesc, outterBtnDiv);
            lastBookDiv.append(bookImg, cardBodyDiv);
            bookDiv.append(lastBookDiv);
            row.appendChild(bookDiv);
            container.appendChild(row);
            mainDiv.appendChild(container)
            // newImgD.appendChild(bookImgDiv);
            // // newImgDiv.style = `background: url(${bookImgDiv.src});`
            // bookDiv.append(newImgDiv, bookTitleDiv, bookDescDiv,  watchlistDeleteBtn);
            // row.appendChild(bookDiv);
            // container.appendChild(row)//bookDiv);
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
    // debugger;
    const container = document.querySelector(".album > .container");
    // debugger
    let row = document.querySelector(".album > .container > .row");
    const bookDiv = document.createElement("div");
    bookDiv.classList = "col-md-4";//.add("card-body");//book")
    //bookDiv.style = "width: 21em;"
    const lastBookDiv = document.createElement("div");
    lastBookDiv.classList = "card md-4 box-shadow"
    // const newImgDiv = document.createElement("div");
    // newImgDiv.classList = "card-image";
    const bookImg = document.createElement("img");
    bookImg.classList = "card-img-top";// ("bd-placeholder-img card-img-top");//book_img");
    bookImg.alt = "Card image cap"
    const cardBodyDiv = document.createElement("div");
    cardBodyDiv.classList = "card-body";
    const bookTitle = document.createElement("h4");
    bookTitle.classList.add("card-text")//book_title");
    // bookTitleDiv.style = "text-align: center; font-weight: bold;"
    bookTitle.innerText = book.volumeInfo.title;
    const bookDesc = document.createElement("p");
    bookDesc.classList.add("card-text")//book_desc");
    // bookDescDiv.style = "text-align: center;"

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
    watchlistBtn.classList = "btn btn-sm btn-outline-secondary";//watchlist_btn");
    watchlistBtn.dataset.id = userObject.id;
    watchlistBtn.innerText = "Add to watchlist";
    watchlistBtn.addEventListener("click", () => {
        createBook(book, userObject)
    });
    innerBtnDiv.append(watchlistBtn);
    outterBtnDiv.append(innerBtnDiv);
    cardBodyDiv.append(bookTitle, bookDesc, outterBtnDiv)
    //newImgDiv.appendChild(bookImgDiv);
    // newImgDiv.style = `background: url(${bookImgDiv.src});`
    lastBookDiv.append(bookImg, cardBodyDiv)
    bookDiv.append(lastBookDiv);
    // debugger
    row.appendChild(bookDiv);
    container.appendChild(row);
    mainDiv.appendChild(container);
    // bookDiv.append(newImgDiv, bookTitleDiv, bookDescDiv,  watchlistBtn);
    // row.appendChild(bookDiv);
    // container.appendChild(row)//bookDiv);
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
            id: userObject.id//id
        }
        // debugger;
    }else {
        bookData = {
            title: book.volumeInfo.title,
            description: book.volumeInfo.description,
            image: book.volumeInfo.imageLinks.smallThumbnail,
            snippet: null,
            snippet: book.searchInfo.textSnippet,
            publisher: book.volumeInfo.publisher,
            published_date: book.volumeInfo.publishedDate,
            isbn: null,
            category: null,
            rating: null,
            price: null,
            preview_link: null,
            id: userObject.id//id
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
    // debugger;
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
    const bookPubDateDiv = document.createElement("div");
    bookPubDateDiv.classList = "book_date";
    const bookISBNDiv = document.createElement("div");
    bookISBNDiv.classList = "book_isbn";
    const bookCatDiv = document.createElement("div");
    bookCatDiv.classList = "book_cat";
    const bookRatingDiv = document.createElement("div");
    bookRatingDiv.classList = "book_rating";
    if ("volumeInfo" in book) {
        bookPubDiv.innerText = book.volumeInfo.publisher;
        bookPubDateDiv.innerText = book.volumeInfo.publishedDate;
        bookISBNDiv.innerText = book.volumeInfo.industryIdentifiers[1].identifier;
        bookCatDiv.innerText = book.volumeInfo.categories[0];
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
    } else {
        bookPubDiv.innerText = book.publisher;
        bookPubDateDiv.innerText = book.published_date;
        bookISBNDiv.innerText = book.isbn;
        bookCatDiv.innerText = book.category;
        bookRatingDiv.innerText = book.rating;
        if (book.price != null) {
            const bookPrice = document.createElement("div");
            bookPrice.classList = "book_price";
            bookPrice.innerText = book.price;
            const bookBuyLink = document.createElement("a");
            bookBuyLink.href = book.preview_link;
            const buyLinkDiv = document.createElement("div");
            buyLinkDiv.classList = "book_link";
            buyLinkDiv.innerText = "Buy Now";
            bookBuyLink.appendChild(buyLinkDiv);
            bookDiv.append(bookPrice, bookBuyLink);
        }
        bookTitleDiv.innerText = book.title;
        bookDescDiv.innerText = book.description;
        // debugger
        bookImgDiv.src = book.image;
    }
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