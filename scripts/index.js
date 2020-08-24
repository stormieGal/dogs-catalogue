/*
Requirements:

1. Add this to your GitHub in its own repo (we'll learn how to do that later)
Style it nice using CSS.

2. Show a loading gif (just use an <img />) that shows when you're loading a new doggo and then hide it when you're done.

3. The dog.ceo API allows you to request a list of breeds. Use this list to populate a <select></select>. Then when a user select a dog breed, show a picture of that dog using the the random image by breed API.

*/

const RANDOM = "https://dog.ceo/api/breeds/image/random";

let logo = document.querySelector(".logo");
let img = document.createElement("img");
logo.style.width = "150px";
logo.style.height = "150px";
img.style.width = "inherit";
img.style.height = "inherit";
logo.appendChild(img);
let i = 0;
let timerId = setInterval(() => {
  const promiseRandom = fetch(RANDOM);
  if (i < 1) {
    promiseRandom
      .then(function(response) {
        let processingPromise = response.json();
        return processingPromise;
      })
      .then(function(processedResponse) {
        img.src = processedResponse.message;
        i++;
      });
  }
  // } else {
  //   i--;
  // }
}, 500);

setTimeout(() => {
  clearInterval(timerId);
}, 2000);

/*
3. The dog.ceo API allows you to request a list of breeds. Use this list to populate a <select></select>. Then when a user select a dog breed, show a picture of that dog using the the random image by breed API.

*/

const ALL_BREEDS = "https://dog.ceo/api/breeds/list/all";

const promiseAllBreed = fetch(ALL_BREEDS);

const allBreeds = document.getElementById("all_breeds");

function createNewOption(value) {
  const anOption = document.createElement("option");
  anOption.value = value;
  anOption.innerText = value;
  return anOption;
}

function createNewOptGroup(label, ...options) {
  const hr = document.createElement("hr");
  const optGroup = document.createElement("optgroup");

  optGroup.label = label;
  if (options == false) {
    allBreeds.append(createNewOption(label));
  } else {
    options[0].forEach(el => {
      optGroup.appendChild(el);
    });
    allBreeds.appendChild(optGroup);
  }

  allBreeds.appendChild(hr);
}

promiseAllBreed
  .then(function(response) {
    const processingPromise = response.json();

    return processingPromise;
  })
  .then(function(processedResponse) {
    const breedsArray = Object.keys(processedResponse.message);

    breedsArray.forEach(el => {
      if (processedResponse.message[el] == false) {
        createNewOptGroup(el);
      } else {
        let byBreed = [];
        processedResponse.message[el].forEach(element => {
          byBreed.unshift(createNewOption(element));
        });

        createNewOptGroup(el, byBreed);
      }
    });
  });

let tBodyTag = document.querySelector("tbody");

let numDisplayed = document.getElementById("num_displayed");

let currentNumDisplayed = numDisplayed.value;

numDisplayed.addEventListener("change", function() {
  currentNumDisplayed = this.value;
});

function createNewTableRow(picture, breed, index, subBreed) {
  const tr = document.createElement("tr");
  const description = `dog-${breed}-${subBreed}-${index}`;
  tr.classList.add(description);

  const td1 = document.createElement("td");
  const img = document.createElement("img");
  img.src = picture;
  img.alt = description;
  img.style.width = "100px";
  img.style.height = "100px";
  td1.appendChild(img);
  tr.appendChild(td1);

  const td2 = document.createElement("td");
  td2.innerText = `${breed}`;
  tr.appendChild(td2);

  const td3 = document.createElement("td");
  td3.innerText = `${subBreed}`;
  tr.appendChild(td3);

  tBodyTag.appendChild(tr);
}

allBreeds.addEventListener("change", function() {
  console.log(this.value);
  if (this.value != "") {
    // console.log(this.value)
    currentOptGroup = this[this.selectedIndex].parentElement;
    let ALL_SUBBREEDS;
    var hisBreed;
    if (currentOptGroup.tagName != "OPTGROUP") {
      ALL_SUBBREEDS = `https://dog.ceo/api/breed/${this.value}/images`;
      hisBreed = this.value;
    } else {
      ALL_SUBBREEDS = `https://dog.ceo/api/breed/${currentOptGroup.label}/images`;
      const hisBreed = currentOptGroup;
    }
    fetch(ALL_SUBBREEDS)
      .then(function(response) {
        const processingPromise = response.json();
        return processingPromise;
      })
      .then(function(processedResponse) {
        allSubBreedImages = Object.keys(processedResponse.message);

        let i = 0;

        processedResponse.message.forEach(el => {
          let hisSubbreed = el.substring(el.indexOf("-") + 1);
          hisSubbreed = hisSubbreed.split("/")[0];
          console.log(`My subbreed: ${hisSubbreed}`);

          createNewTableRow(el, hisBreed, i, hisSubbreed);
          i++;
          if (i > numDisplayed) {
            i = 0;
            return;
          }
        });

        // For handling changes
        numDisplayed.addEventListener("change", function() {
          processedResponse.message.forEach(el => {
            let i = 0;
            let hisSubbreed = el.substring(el.indexOf("-") + 1);
            hisSubbreed = hisSubbreed.split("/")[0];
            console.log(`My subbreed: ${hisSubbreed}`);

            createNewTableRow(el, hisBreed, i, hisSubbreed);
            i++;

            if (i > this.value) {
              i = 0;
              return;
            }
          });
        });
      });
  }
});
