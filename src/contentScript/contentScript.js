import debounce from "lodash/debounce";
import getRating from "./api/getRating";

function initializeScript() {

  appendRatings();

  // can't use MutationObserver unfortunately :(
  window.addEventListener("scroll", debounce(appendRatings, 1000));
}

function appendRatings() {
  const wineListItems = document.querySelectorAll(
    'div.card-body'
  );

  wineListItems.forEach((item) => {
    if (!item.parentNode.style.position) {
      appendRating(item);
    }
  });
}

async function appendRating(element) {
  element.parentElement.style.position = "relative";
  const wineName = element.querySelector("h2 > small").innerText + ' ' +element.querySelector("h2 > a").innerText;
  console.log(wineName);

  try {
    const { score, numOfReviews, url } = await getRating(wineName);

    const priceElement = document.createElement("a");
    priceElement.href = url;
    priceElement.innerText = `Vivino score: ${score} (${numOfReviews} reviews)`;
    priceElement.style.position = "absolute";
    priceElement.style.bottom = "14px";
    priceElement.style.right = "14px";

    element.parentElement.appendChild(priceElement);
  } catch (e) {
    console.error(`${wineName} is not found on Vivino`);
  }
}

window.addEventListener("load", initializeScript);
