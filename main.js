const API_KEY = "306b5623929742acb0296f7df5b15899";
const menuList = document.querySelectorAll(".menus button");
const sideMenuList = document.querySelectorAll(".side-menu-list button");
const searchButton = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");
let newsList = [];
let inputArea = document.getElementById("input-area");
let url = new URL(
  `https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY}`
);
let totalResults = 0;
let page = 1;
const pageSize = 10;
const groupSize = 5;

menuList.forEach((menu) =>
  menu.addEventListener("click", (event) => {
    getNewsByCategory(event);
  })
);
sideMenuList.forEach((menu) =>
  menu.addEventListener("click", (event) => {
    getNewsByCategory(event);
  })
);
searchInput.addEventListener("keydown", (e) => {
  if (e.keyCode === 13) {
    getNewsBySearch();
  }
});

const getNews = async () => {
  try {
    url.searchParams.set("page", page);
    url.searchParams.set("pageSize", pageSize);
    const response = await fetch(url);
    console.log("response", response);
    const data = await response.json();
    totalResults = data.totalResults;
    console.log("data", data);
    if (response.status === 200) {
      if (data.articles.length == 0) {
        throw new Error("No matches for your search");
      }
      newsList = data.articles;
      render();
      paginationRender();
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    errorRender(error.message);
  }
  console.log("newsList", newsList);
};

const getLatestNews = async () => {
  url = new URL(
    `https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY}`
  );
  getNews();
};

getLatestNews();

const getNewsByCategory = async (event) => {
  const category = event.target.textContent.toLowerCase();
  url = new URL(
    `https://newsapi.org/v2/top-headlines?country=kr&category=${category}&apiKey=${API_KEY}`
  );
  getNews();
};

const getNewsBySearch = async (event) => {
  const keyword = searchInput.value;
  url = new URL(
    `https://newsapi.org/v2/top-headlines?country=kr&q=${keyword}&apiKey=${API_KEY}`
  );
  getNews();
};

function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

function openInput() {
  if (inputArea.style.display == "inline") {
    inputArea.style.display = "none";
  } else {
    inputArea.style.display = "inline";
  }
}

function render() {
  let newsHTML = newsList
    .map((news) => {
      return `<div class="row news">
               <div class="col-lg-4">
                 <img
                   class="news-img-size"
                   src="${
                     news.urlToImage ||
                     "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU%22"
                   }"/>
               </div>
               <div class="col-lg-8">
                 <h2>${news.title}</h2>
                 <p>${
                   news.description == null || news.description == ""
                     ? "내용없음"
                     : news.description.length > 200
                     ? news.description.substring(0, 200) + "..."
                     : news.description
                 }
                 </p>
                 <div>${news.source.name || "no source"} * ${moment(
        news.publishedAt
      ).fromNow()}</div>
               </div>
             </div>`;
    })
    .join("");

  document.getElementById("news-board").innerHTML = newsHTML;
}

const errorRender = (errorMessage) => {
  const errorHTML = `<div class="alert alert-danger" role="alert">
  ${errorMessage}
</div>`;
  document.getElementById("news-board").innerHTML = errorHTML;
};

const paginationRender = () => {
  const totalPages = Math.ceil(totalResults / pageSize);
  const pageGroup = Math.ceil(page / groupSize);
  let lastPage = pageGroup * groupSize;
  if (lastPage > totalPages) {
    lastPage = totalPages;
  }
  let firstPage =
    lastPage - (groupSize - 1) < 1 ? 1 : lastPage - (groupSize - 1);
 
  let paginationHTML = ''

  if(totalPages > 5){
  paginationHTML = `<li class="page-item"><a onclick="moveToPage(${
    1
  })" class="page-link"><span aria-hidden="true">&lt;&lt;</span></a></li><li class="page-item"><a onclick="moveToPage(${
    page - 1
  })" class="page-link"><span aria-hidden="true">&lt;</span></a></li>`;
  } 

  for (i = firstPage; i <= lastPage; i++) {
    paginationHTML += `<li class="page-item ${
      i === page ? "active" : ""
    }"><a onclick="moveToPage(${i})" class="page-link" href="#">${i}</a></li>`;
  }

  if(lastPage < totalPages){
  paginationHTML += `<li class="page-item"><a onclick="moveToPage(${
    page + 1
  })" class="page-link" href="#"><span aria-hidden="true">&gt;</span></a></li><li class="page-item"><a onclick="moveToPage(${
    totalPages
  })" class="page-link" href="#"><span aria-hidden="true">&gt;&gt;</span></a></li>`;
  }

  document.querySelector(".pagination").innerHTML = paginationHTML;
};

const moveToPage = (pageNum) => {
  page = pageNum;
  getNews();
};
