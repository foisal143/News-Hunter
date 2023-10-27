let AllDatas = [];
// const noNewsMassage = document.getElementById('massage');

const loadCatagory = () => {
  const newsCatagory = `https://openapi.programming-hero.com/api/news/categories`;
  fetch(newsCatagory)
    .then(res => res.json())
    .then(data => showCatagory(data.data.news_category))
    .catch(er => console.log(er));
};

const showCatagory = catagory => {
  catagory.forEach(element => {
    const { category_name, category_id } = element;
    const catagoryContainer = document.getElementById('catagoryContainer');
    catagoryContainer.innerHTML += `<p onclick="loadNews('${category_id}', '${category_name}')">${category_name}</p>`;
  });
};

const loadNews = (category_id, name) => {
  const newsId = ` https://openapi.programming-hero.com/api/news/category/${category_id}`;
  document.getElementById('loader').classList.remove('d-none');

  fetch(newsId)
    .then(res => res.json())
    .then(data => {
      AllDatas = data.data;
      showNews(data.data, name);
    })
    .catch(er => console.log(er));
};

const showNews = (data, name) => {
  const newsContainer = document.getElementById('newsContainer');

  document.getElementById('newsFind').innerText = data.length;
  document.getElementById('newsName').innerText = name;
  newsContainer.innerHTML = '';
  if (data.length === 0) {
    console.log('data not found');
    document.getElementById('loader').classList.add('d-none');
    newsContainer.innerHTML = `
    <div class="text-center my-3 fs-1 text-danger">
      <p>No news found</p>
    </div>
    `;
    return;
  }
  data.forEach(element => {
    const { _id, details, image_url, rating, title, total_view, author } =
      element;
    console.log(element);
    const star = createStar(rating.number);
    newsContainer.innerHTML += `
    <div class="card mb-3" >
  <div class="row g-0">
    <div class="col-md-4">
      <img src="${image_url}" class="img-fluid h-100 rounded-start" alt="...">
    </div>
    <div class="col-md-8 d-flex flex-column justify-content-between">
      <div class="card-body">
        <h5 class="card-title">${title}</h5>
        <p class="card-text">
        ${details.slice(0, 200)}... 
        </p>
        <p class="mt-4 mb-0"> ...${details.slice(-100)} </p>
      </div>
       <div class="card-footer mt-0">
        <div class="d-flex justify-content-center align-items-center g-2 ">
        <div class="col d-flex justify-content-center align-items-center">
           <img class="rounded-circle me-2" style="width: 40px; height: 40px;" src="${
             author?.img
           }" alt="">
         <div>
           <p class="m-0">${author.name ? author.name : 'No data Found'}</p>
           <p class="m-0">${
             author.published_date
               ? author.published_date.slice(0, 10)
               : 'No data found'
           }</p>
        </div>
        </div>
        <div class="col text-center">
         <i class="fa-regular fa-eye"></i> <span>${
           total_view ? total_view : 'No data available'
         } </span>
        </div>
        <div class="col text-center">
        ${star}
        <span> ${rating.number} </span>
        </div>
        <div class="col text-end details">
        <i onclick="loadDetails('${_id}')" class="fa-solid fa-arrow-right" data-bs-toggle="modal" data-bs-target="#exampleModal"></i>
        </div>
      </div>
        
      </div>
    </div>
  </div>
</div>
    `;
    document.getElementById('loader').classList.add('d-none');
  });
};

// show trending
document.getElementById('trending').addEventListener('click', () => {
  const newData = AllDatas.filter(e => e.others_info?.is_trending === true);

  const name = document.getElementById('newsName').innerText;
  showNews(newData, name);
});

// show pick day news
document.getElementById('todyPick').addEventListener('click', () => {
  const picData = AllDatas.filter(
    data => data.others_info.is_todays_pick === true
  );

  const name = document.getElementById('newsName').innerText;
  showNews(picData, name);
});

// load details
const loadDetails = id => {
  const newsDetail = `https://openapi.programming-hero.com/api/news/${id}`;
  fetch(newsDetail)
    .then(res => res.json())
    .then(data => showDetails(data.data))
    .catch(er => console.log(er));
};
//show details in a modal
const showDetails = data => {
  console.log(data);
  data.forEach(element => {
    const { _id, details, image_url, rating, title, total_view, author } =
      element;
    const star = createStar(rating.number);
    document.getElementById('modalBody').innerHTML = `
      <div class="card mb-3" >
    <div class="row g-0">
      <div class="col-md-12">
        <img src="${image_url}" class="img-fluid h-100 rounded-start" alt="...">
      </div>
      <div class="col-md-12 d-flex flex-column justify-content-between">
        <div class="card-body">
          <h5 class="card-title">${title}</h5>
          <p class="card-text">
          ${details}...
          </p>
          
        </div>
         <div class="card-footer mt-0">
          <div class="d-flex justify-content-center align-items-center g-2 ">
          <div class="col d-flex justify-content-center align-items-center">
             <img class="rounded-circle me-2" style="width: 40px; height: 40px;" src="${
               author?.img
             }" alt="">
           <div>
             <p class="m-0">${author.name ? author.name : 'No data Found'}</p>
             <p class="m-0">${
               author.published_date
                 ? author.published_date.slice(0, 10)
                 : 'No data found'
             }</p>
          </div>
          </div>
          <div class="col text-center">
           <i class="fa-regular fa-eye"></i> <span>${total_view} </span>
          </div>
          <div class="col text-center">
        ${star}
        <span> ${rating.number} </span>
        </div>
          
        </div>

        </div>
      </div>
    </div>
  </div>
      `;
  });
};

// compare function for sorting
const compareName = (a, b) => {
  const nameOfa = a.author.name?.toLowerCase();
  const nameOfb = b.author.name?.toLowerCase();

  if (nameOfa < nameOfb) {
    return -1;
  } else if (nameOfa > nameOfb) {
    return 1;
  } else {
    return 0;
  }
};
// compare function for number
const compareNumber = (a, b) => {
  const x = Math.round(a.rating.number);
  const y = Math.round(b.rating.number);

  return y - x;
};
// sorting the news
document.getElementById('sortNews').addEventListener('change', e => {
  const value = e.target.value;
  const name = document.getElementById('newsName').innerText;
  if (value === 'Name') {
    const sortName = AllDatas.sort(compareName);
    showNews(sortName, name);
  } else if (value === 'Review') {
    const sortReview = AllDatas.sort(compareNumber);
    console.log('i am here');
    showNews(sortReview, name);
  } else {
    showDetails(AllDatas, name);
  }
});

// reveiw section
function createStar(rate) {
  const rating = Math.floor(rate);
  let star = '';
  for (let i = 0; i < rating; i++) {
    star += `<i class="fa-solid fa-star"></i>`;
  }
  if (rate - rating > 0) {
    star += `<i class="fa-solid fa-star-half"></i>`;
  }

  return star;
}

loadNews('08', 'All news');
