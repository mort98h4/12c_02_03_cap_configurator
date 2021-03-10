"use strict";

// The model of all features
const features = {
  drinksholder: false,
  led: false,
  propeller: false,
  shield: false,
  solarfan: false
};

window.addEventListener("DOMContentLoaded", start);

function start() {
  console.log("start");
  // register toggle-clicks
  document.querySelectorAll(".option").forEach(option => option.addEventListener("click", toggleOption));
}

function toggleOption(event) {
  const target = event.currentTarget;
  const feature = target.dataset.feature;
  const list = document.querySelector("#selected ul");
  console.log(feature);

  // Toggle feature in "model"
  if (features[feature]) {
    features[feature] = false;
  } else {
    features[feature] = true;
  }
  
  if (features[feature]) {
    // feature added
    console.log(`Feature ${feature} is turned on!`);

    // If feature is (now) turned on:
    // - mark target as chosen (add class "chosen")
    target.classList.add("chosen");

    // - un-hide the feature-layer(s) in the #product-preview;
    document.querySelectorAll(`#product-preview [data-feature=${feature}]`).forEach(layer => {
      layer.classList.remove("hide");
    });

    // - create featureElement and append to #selected ul
    const chosenFeature = createFeatureElement(feature);
    list.append(chosenFeature);

    // - create FLIP-animation to animate featureElement from img in target, to
    //   its intended position. Do it with normal animation or transition class!

    // Find the start position
    const start = document.querySelector(`#options [data-feature=${feature}]`).getBoundingClientRect();
    // Find the end position
    const end = chosenFeature.getBoundingClientRect();
    // Translate the element to the start position
    const diffX = start.x - end.x;
    const diffY = start.y - end.y;
    chosenFeature.style.setProperty("--diffX", diffX);
    chosenFeature.style.setProperty("--diffY", diffY);
    
    // Animate the element
    chosenFeature.classList.add("animate-feature-in");

  } else {
    // feature removed
    console.log(`Feature ${feature} is turned off!`);

    // Else - if the feature (became) turned off:
    // - no longer mark target as chosen
    target.classList.remove("chosen");

    // - hide the feature-layer(s) in the #product-preview
    document.querySelectorAll(`#product-preview [data-feature=${feature}]`).forEach(layer => {
      layer.classList.add("hide");
    });

    // - find the existing featureElement in #selected ul
    const removeFeature = document.querySelector(`#selected [data-feature=${feature}]`);
    
    // - create FLIP-animation to animate featureElement to img in target
    // - when animation is complete, remove featureElement from the DOM

    // Find the start position
    const start = removeFeature.getBoundingClientRect();
    // Find the end position
    const end = document.querySelector(`#options [data-feature=${feature}]`).getBoundingClientRect();
    // Calculate the translation
    const diffX = end.x - start.x;
    const diffY = end.y - start.y;
    removeFeature.style.setProperty("--diffX", diffX);
    removeFeature.style.setProperty("--diffY", diffY);
    // Animate the element
    removeFeature.classList.add("animate-feature-out");
    removeFeature.addEventListener("animationend", removeThisFeature);
    
    // Remove the element from the DOM
    function removeThisFeature() {
      removeFeature.removeEventListener("animationend", removeThisFeature);
      list.removeChild(removeFeature);
    }
  }
}

// Create featureElement to be appended to #selected ul - could have used a <template> instead
function createFeatureElement(feature) {
  const li = document.createElement("li");
  li.dataset.feature = feature;

  const img = document.createElement("img");
  img.src = `images/feature_${feature}.png`;
  img.alt = capitalize(feature);

  li.append(img);

  return li;
}

function capitalize(text) {
  return text.substring(0, 1).toUpperCase() + text.substring(1).toLowerCase();
}