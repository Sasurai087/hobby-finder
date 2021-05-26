const paginate = document.getElementById('paginate');
const $hobbyContainer = $('#hobby-container');

paginate.addEventListener('click', function(e) {
  e.preventDefault();
  fetch(this.href)
    .then(response => response.json())
    .then(data => {
      for(const hobby of data.docs){
        let template = generateHobby(hobby);
        $hobbyContainer.append(template);
      }
      let {nextPage} = data;
      this.href = this.href.replace(/page=\d+/, `page=${nextPage}`);
    })
    .catch(err => console.log('Error', err))
})

function generateHobby(item) {
  let template =
  `<div class="card mb-3">
      <div class="row">
        <div class="col-md-4">
          <img class="img-fluid img-thumbnail" alt="" src="${item.images.length ? item.images[0].url : "https://res.cloudinary.com/sasurai/image/upload/v1621975224/HobbyFinder/BG10_kajoqu.jpg"}">
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">${item.title}</h5>
            <p class="card-text">${item.description}</p>
            <p class="card-text">
              <small class="text-muted">${item.location}</small>
            </p>
            <a class="btn btn-primary" href="hobbies/${item._id}">View ${item.title}</a>
          </div>
        </div>
      </div>
    </div>`
    return template;
}
