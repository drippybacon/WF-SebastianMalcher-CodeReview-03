let movies = JSON.parse(localStorage.getItem('movies_data')); /* get from localStorage*/

if (movies == null) {
    /* if localStorage is empty copy movies array*/
    movies = movies_data;
    saveToLocalStorage(movies);
    for (i = 0; i < movies.length; i++) {
        /* randomize likeCount of each movie on localstorage (re)load*/
        let randomLikes = Math.floor(Math.random() * (500 - 60 + 1) + 60);
        movies[i].likeCount = randomLikes;
    }
}

for (i = 0; i < movies.length; i++) {
    /* randomize genre of each movie on site (re)load*/
    let genres = ["Adventure", "Fantasy", "Sci-Fi", "Action", "Crime", "Horror", "Comedy", "Drama", "Animation", "Romance"];
    let randomNumber = Math.floor(Math.random() * genres.length);
    let randomGenre = genres[randomNumber];
    movies[i].genre = randomGenre;
}

let movieCounter = 10; /* sets current page number*10 */

function initPage() {
    createHeader();
    createMain();
    createHomePage(movies);
    createFooter();
}

initPage();

function createHeader() {

    let header = document.createElement("HEADER");
    header.id = "header";
    document.getElementById("mainSite").appendChild(header);
    let heading = document.createElement("h1");
    heading.innerHTML = "MovieFactory";
    header.appendChild(heading);
    let navbar = document.createElement("nav");
    navbar.className = "navbar";
    let ul = document.createElement("ul");
    let li1 = document.createElement("li");
    let li2 = document.createElement("li");
    li1.innerHTML = `<a id="loadHomePage"title="Home">Home</a>`;
    li2.innerHTML = `<a id="reloadDefaultMovies" title="Movies">Movies</a>`;
    header.appendChild(navbar);
    navbar.appendChild(ul);
    ul.appendChild(li1);
    ul.appendChild(li2);
    document.getElementById("reloadDefaultMovies").addEventListener("click", function () {
        sortMoviesByName(movies);
    });
    document.getElementById("loadHomePage").addEventListener("click", function () {
        createHomePage(movies);
    });
    let searchInput = document.createElement("input");
    ul.appendChild(searchInput);
    searchInput.type = "text";
    searchInput.id = "searchInput";
    searchInput.value = "Search by name, genre, ...";
    searchInput.addEventListener('click', function (e) {
        e.target.select();
    });

    searchInput.addEventListener('keypress', function (e) {
        var key = e.which || e.keyCode;
        if (key === 13) {
            search(movies, movieCounter);
        }
    });


}

function createMain() {

    let main = document.createElement('main');
    let contentHeader = document.createElement("div");
    contentHeader.id = "contentHeader"
    contentHeader.innerHTML = `<h2>All Movies</h2><span id="sortBtnAsc">▲</span><span>Sort</span><span id="sortBtnDesc">▼</span>`;
    document.getElementById("mainSite").appendChild(main);
    main.appendChild(contentHeader);
    document.getElementById("sortBtnDesc").addEventListener("click", function () {
        sortMoviesByLikesDesc(movieCounter, movies)
    }); /* adds functionality to sort buttons*/
    document.getElementById("sortBtnAsc").addEventListener("click", function () {
        sortMoviesByLikesAsc(movieCounter, movies)
    });
}

function createMovieFlexBox() {

    let moreMoviesBtnsDivTop = document.createElement("div"); /* creates div for nextMovePage buttons*/
    moreMoviesBtnsDivTop.className = "moreMoviesBtnsDivTop";
    document.querySelector("main").appendChild(moreMoviesBtnsDivTop);

    let movieFlexBox = document.createElement("div");
    movieFlexBox.className = "flex";
    document.querySelector("main").appendChild(movieFlexBox);

    let moreMoviesBtnsDiv = document.createElement("div"); /* creates div for nextMovePage buttons*/
    moreMoviesBtnsDiv.className = "moreMoviesBtnsDiv";
    document.querySelector("main").appendChild(moreMoviesBtnsDiv);
}

function createMovies(movies, movieCounter) {

    let createMovieStart = movieCounter - 10;
    for (i = createMovieStart; i < movieCounter; i++) {
        /* creates movie divs ending at movies[movieCounter] and starting 10 movies before that*/
        if (i == movies.length || movies.length === undefined) {
            /* breaks loop if no movies are left*/
            break;
        }
        let movieFlexChildren = document.createElement("div");
        let movieImg = document.createElement("img");
        movieImg.src = movies[i].image;
        movieImg.id = i;
        let likeBtnDiv = document.createElement("div");
        likeBtnDiv.className = "likediv";
        likeBtnDiv.innerHTML = `Like: <img src="./img/thumbsup.png" class="likebutton" id="likeBtn${i}"> <div id="likeAmount${i}" value="">${movies[i].likeCount}</div>`;
        let description = document.createElement("div");
        description.innerHTML = `<h3>${movies[i].name}</h3>Year: ${movies[i].productionYear} <br> Genre: ${movies[i].genre} <br><br> Synopsis:<br>  ${movies[i].description} `;
        document.querySelector(".flex").appendChild(movieFlexChildren);
        movieFlexChildren.appendChild(movieImg);
        movieFlexChildren.appendChild(description);
        movieFlexChildren.appendChild(likeBtnDiv);
        openOneMovieOnClick(movieImg, movies);
    }

    createNextMoviePageBtns(movies);

    if (document.querySelector("[class^=nextMoviePageBtn]").style.color == "#5591ff") {
        /* resets nextMoviePageButton color if necessary*/
        resetNextMoviePageBtnColor();
    } else if (movieCounter > 11) {
        resetNextMoviePageBtnColor();
    } else {
        resetNextMoviePageBtnColor();
        let bothBtns = document.querySelectorAll("[class=nextMoviePageBtn0]");
        bothBtns.forEach(function (elem) {
            elem.style.color = "#5591ff";
            elem.style.textDecorationColor = "#5591ff";
        })
    };

    let allNextMoviePageBtns = document.querySelectorAll("[class^=nextMoviePageBtn]") /*creates functionality for each nextMoviePageButton*/
    allNextMoviePageBtns.forEach(function (elem) {
        elem.addEventListener("click", function (e) {
            document.querySelector(".flex").innerHTML = " "; /* resets already created movies*/
            movieCounter = parseInt(e.target.innerHTML) * 10;
            createMovies(movies, movieCounter);
            increaseCounterOnClick(movies);
            let currentNextMovieBtnBlue = e.target.className;
            let bothCurrentBtns = document.querySelectorAll(`[class=${currentNextMovieBtnBlue}]`);
            bothCurrentBtns.forEach(function (elem) {
                elem.style.color = "#5591ff";
                elem.style.textDecorationColor = "#5591ff";
            })

            scroll(0, 0);
            document.getElementById("sortBtnDesc").addEventListener("click", function () {
                sortMoviesByLikesDesc(movieCounter, movies)
            });
            document.getElementById("sortBtnAsc").addEventListener("click", function () {
                sortMoviesByLikesAsc(movieCounter, movies)
            });
        })
    })
}

function createNextMoviePageBtns(movies) {

    if (document.querySelector("[class=moreMoviesBtnsDiv]").innerHTML == "") {
        /* only creates buttons when there are none*/
        let x = movies.length % (Math.floor((movies.length) / 10)); /* checks how many nextMoviePageBtns need to be created*/
        let numberOfNextPageBtns = Math.floor((movies.length) / 10);
        if (x > 0) {
            numberOfNextPageBtns++;
        }

        if (movies.length < 10) {
            numberOfNextPageBtns = 1;
        }

        for (i = 0; i < numberOfNextPageBtns; i++) {
            /* creates nextMoviePageButton*/
            let nextMoviePageBtnTop = document.createElement("div");
            nextMoviePageBtnTop.className = "nextMoviePageBtn" + i;
            nextMoviePageBtnTop.innerHTML = i + 1;
            document.querySelector("[class=moreMoviesBtnsDivTop]").appendChild(nextMoviePageBtnTop);
        }

        for (i = 0; i < numberOfNextPageBtns; i++) {
            /* creates nextMoviePageButton*/
            let nextMoviePageBtn = document.createElement("div");
            nextMoviePageBtn.className = "nextMoviePageBtn" + i;
            nextMoviePageBtn.innerHTML = i + 1;
            document.querySelector("[class=moreMoviesBtnsDiv]").appendChild(nextMoviePageBtn);
        }
    }
}


function increaseCounterOnClick(movies) {
    /* increase likeCounter on thumbsUp click*/
    let allLikeBtns = document.querySelectorAll(".likebutton")
    allLikeBtns.forEach(function (elem) {
        elem.addEventListener("click", function (e) {
            for (i = 0; i < movies.length; i++) {
                if (e.target.id == "likeBtn" + i) {
                    let likeAmountId = "likeAmount" + i;
                    let currentLikeCount = parseInt(movies[i].likeCount);
                    movies[i].likeCount = currentLikeCount + 1;
                    document.getElementById(likeAmountId).innerHTML = movies[i].likeCount;
                    saveToLocalStorage(movies);
                    console.log(movies)
                }
            }
        })
    });
}

function createHomePage(movies) {

    let main = document.querySelector("main"); /* resets main*/
    document.querySelector("main").innerHTML = " ";

    let randomMovie = Math.floor(Math.random() * movies.length) /* creates random index number for randomMovie*/
    let featured = "Featured";

    createOneMovie(randomMovie, featured, movies);
    createLikeButtonFunctionalityForOneMovie(movies);

    let currentPicture = document.getElementById(randomMovie);
    openOneMovieOnClick(currentPicture, movies);
    let contentHeader = document.createElement("div"); /* creates popularHeader and flex box for popularMovies*/
    contentHeader.id = "contentHeader";
    contentHeader.innerHTML = "<h2>Popular Movies</h2>";
    let mainSite = document.getElementById("mainSite");
    let footer = document.getElementById("footer");
    mainSite.insertBefore(main, footer);
    main.appendChild(contentHeader);
    let movieFlexBox = document.createElement("div");
    movieFlexBox.className = "flex";
    movieFlexBox.id = "homeFlex";
    document.querySelector("main").appendChild(movieFlexBox);

    /*createPopularMovies(randomMovie, movies)*/
    let popularMoviesByLikes = movies.slice(0); /*creates ordered by most likes copy of movies and creates 3 div of them*/
    popularMoviesByLikes.sort(function (a, b) {
        return b.likeCount - a.likeCount;
    });
    for (i = 0; i < 3; i++) {
        let movieFlexChildren = document.createElement("div");
        let movieImg = document.createElement("img");
        movieImg.src = popularMoviesByLikes[i].image;
        movieImg.className = "moviePosterLink";
        movieImg.id = i;

        let likeBtnDiv = document.createElement("div");
        likeBtnDiv.className = "likeDiv" + i;
        likeBtnDiv.innerHTML = `<img src="./img/thumbsup.png" class="likebutton" id="likeBtn${i}"> <div id="likeAmount${i}" value="">${popularMoviesByLikes[i].likeCount}</div>`;

        let description = document.createElement("div");
        description.id = "movieTitel" + i;
        description.innerHTML = `<h3>${popularMoviesByLikes[i].name}</h3>Year: ${popularMoviesByLikes[i].productionYear}`;
        description.addEventListener("click", function () {
            scroll(0, 0);
            sortMoviesByName(movies);
        });

        document.querySelector(".flex").appendChild(movieFlexChildren);
        movieFlexChildren.appendChild(description);
        movieFlexChildren.appendChild(movieImg);
        movieFlexChildren.appendChild(likeBtnDiv);
        openOneMovieOnClick(movieImg, popularMoviesByLikes);
    }

    increaseCounterOnClick(popularMoviesByLikes);
}

function createOneMovie(randomMovie, text, movies) {

    let featuredHeader = document.createElement("div"); /* creates featured header and flex box for featuredMovie*/
    featuredHeader.id = "featuredHeader";
    featuredHeader.innerHTML = `<h2>${text}</h2>`;

    let main = document.querySelector("main");
    main.appendChild(featuredHeader);
    let movieFlexBoxRandom = document.createElement("div");
    movieFlexBoxRandom.id = "flexRandom";
    main.appendChild(movieFlexBoxRandom);

    let movieFlexChildren = document.createElement("div"); /* creates featuredMovie div*/
    let movieImg = document.createElement("img");
    movieFlexChildren.id = "randomMovieDiv";
    movieImg.src = movies[randomMovie].image;
    movieImg.id = randomMovie;
    movieImg.className = "randomMovieClass";
    let likeBtnDiv = document.createElement("div");
    likeBtnDiv.className = "likediv";
    likeBtnDiv.innerHTML = `<img src="./img/thumbsup.png" class="likebutton" id="likeBtnRandom"> <div id="likeAmountRandom" value="">${movies[randomMovie].likeCount}</div>`;
    let description = document.createElement("div");
    description.innerHTML = `<h3>${movies[randomMovie].name}</h3>Year: ${movies[randomMovie].productionYear} <br> Genre: ${movies[randomMovie].genre} <br><br> Synopsis:<br>  ${movies[randomMovie].description} `;
    movieFlexBoxRandom.appendChild(movieFlexChildren);
    movieFlexChildren.appendChild(movieImg);
    movieFlexChildren.appendChild(description);
    movieFlexChildren.appendChild(likeBtnDiv);
}


function createLikeButtonFunctionalityForOneMovie(movies) {
    let likeBtnRandom = document.getElementById("likeBtnRandom"); /* makes featuredMovie likeButton able to increase likeAmount of randomMovie*/
    likeBtnRandom.addEventListener("click", function (randomMovie) {
        let likeAmountRandomId = document.getElementById("likeAmountRandom");
        let currentRandomMovie = document.querySelector(".randomMovieClass");
        let current = currentRandomMovie.id;
        let currentLikeCount = parseInt(movies[current].likeCount);
        movies[current].likeCount = currentLikeCount + 1;
        document.getElementById("likeAmountRandom").innerHTML = movies[current].likeCount;
        saveToLocalStorage(movies);
    });
}

function resetNextMoviePageBtnColor() {
    let allNextMoviePageBtns1 = document.querySelectorAll("[class^=nextMoviePageBtn]");
    for (i = 0; i < allNextMoviePageBtns1.length; i++) {
        allNextMoviePageBtns1[i].style.color = "black";
        allNextMoviePageBtns1[i].style.textDecorationColor = "black";
    }
}

function openOneMovieOnClick(currentElement, movies) {
    currentElement.addEventListener("click", function (e) {
        let main = document.querySelector("main"); /* resets main*/
        document.querySelector("main").innerHTML = " ";
        let info = "Information";
        let currentId = e.target.id;
        createOneMovie(currentId, info, movies);
        createLikeButtonFunctionalityForOneMovie(movies);

        let currentRandomMovie = document.querySelector(".randomMovieClass");
        currentRandomMovie.className += " noHoverOnSingleMovie";

    })
}
function sortMoviesByLikesDesc(movieCounter, movies) {

    movies.sort(function (a, b) {
        return b.likeCount - a.likeCount;
    });

    document.querySelector(".flex").innerHTML = " ";
    createMovies(movies, movieCounter);
    increaseCounterOnClick(movies);

    let currentActivePageNumber = movieCounter / 10 - 1;
    let currentBtnClassName = "nextMoviePageBtn" + currentActivePageNumber;
    let bothBtns = document.querySelectorAll(`[class=${currentBtnClassName}]`);
    bothBtns.forEach(function (elem) {
        elem.style.color = "#5591ff";
        elem.style.textDecorationColor = "#5591ff";
    })
}


function sortMoviesByLikesAsc(movieCounter, movies) {

    movies.sort(function (a, b) {
        return a.likeCount - b.likeCount;
    });
    document.querySelector(".flex").innerHTML = " ";
    createMovies(movies, movieCounter);
    increaseCounterOnClick(movies);

    let currentActivePageNumber = movieCounter / 10 - 1;
    let currentBtnClassName = "nextMoviePageBtn" + currentActivePageNumber;
    let bothBtns = document.querySelectorAll(`[class=${currentBtnClassName}]`);
    bothBtns.forEach(function (elem) {
        elem.style.color = "#5591ff";
        elem.style.textDecorationColor = "#5591ff";
    })
}

function sortMoviesByName() {

    movies.sort(function (a, b) {
        var nameA = a.name.toLowerCase(),
            nameB = b.name.toLowerCase();
        if (nameA < nameB)
            return -1;
        if (nameA > nameB)
            return 1;
        return 0;
    });

    document.querySelector("main").innerHTML = " ";
    let contentHeader = document.createElement("div");
    contentHeader.id = "contentHeader"
    contentHeader.innerHTML = `<h2>All Movies</h2><span id="sortBtnAsc">▲</span><span>Sort</span><span id="sortBtnDesc">▼</span>`;
    document.querySelector("main").appendChild(contentHeader);
    createMovieFlexBox()
    createMovies(movies, movieCounter);
    increaseCounterOnClick(movies);

    document.getElementById("sortBtnDesc").addEventListener("click", function () {
        sortMoviesByLikesDesc(movieCounter, movies)
    });
    document.getElementById("sortBtnAsc").addEventListener("click", function () {
        sortMoviesByLikesAsc(movieCounter, movies)
    });
}


function createFooter() {
    let footer = document.createElement("footer");
    footer.id = "footer";
    document.getElementById("mainSite").appendChild(footer);
    let footerHeading = document.createElement("h1");
    footerHeading.innerHTML = "MovieFactory";
    footer.appendChild(footerHeading);
}


function search(movies, movieCounter) {
    let searchInputNormal = document.getElementById("searchInput").value;
    let main = document.querySelector("main");
    main.innerHTML = " ";
    let contentHeader = document.createElement("div");
    contentHeader.id = "contentHeader"
    contentHeader.innerHTML = `<h2>Your Movies</h2><span id="sortBtnAsc">▲</span><span>Sort</span><span id="sortBtnDesc">▼</span>`;
    main.appendChild(contentHeader);

    let searchInput = searchInputNormal.toLowerCase();
    let moviesSortedBySearch = [];

    for (i = 0; i < movies.length; i++) {

        let movieNames = movies[i].name.toLowerCase();
        let productionYear = movies[i].productionYear;
        let movieGenres = movies[i].genre.toLowerCase();

        if (movieNames.indexOf(searchInput) > -1) {

            let y = movieNames.indexOf(searchInput);
            let f = movieNames.lastIndexOf(searchInput, y);

            let newInput = searchInput.slice(1);
            let newMovieNames = movieNames.slice(y + 1);
            if (newInput == "") {
                if (movieNames.lastIndexOf(searchInput, 0) === 0) {
                    let currentMovieObj = movies[i];
                    moviesSortedBySearch.push(currentMovieObj);
                }
                let z = movieNames.indexOf(searchInput, y);
            } else if (newMovieNames.lastIndexOf(newInput, 0) === 0) {

                let currentMovieObj = movies[i];
                moviesSortedBySearch.push(currentMovieObj);
            }

        } else if (productionYear.lastIndexOf(searchInput, 0) === 0) {
            let currentMovieObj = movies[i];
            moviesSortedBySearch.push(currentMovieObj);
        } else if (movieGenres.lastIndexOf(searchInput, 0) === 0) {
            let currentMovieObj = movies[i];
            moviesSortedBySearch.push(currentMovieObj);
        }
    }

    if (moviesSortedBySearch.length == 0) {

        createMovieFlexBox();
        createMovies(movies, movieCounter);
        increaseCounterOnClick(movies);
        alert("No search entries found");

    } else {

        createMovieFlexBox();
        createMovies(moviesSortedBySearch, movieCounter);
        increaseCounterOnClick(movies);
        document.getElementById("sortBtnDesc").addEventListener("click", function () {
            sortMoviesByLikesDesc(movieCounter, moviesSortedBySearch)
        });
        document.getElementById("sortBtnAsc").addEventListener("click", function () {
            sortMoviesByLikesAsc(movieCounter, moviesSortedBySearch)
        });
    }
}

function saveToLocalStorage(movies) {

    localStorage.setItem('movies_data', JSON.stringify(movies));
    console.log(localStorage)
}