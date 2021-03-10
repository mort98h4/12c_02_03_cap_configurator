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
    const start = document.querySelector(`#options [data-feature=${feature}]`).getBoundingClientRect();
    const end = chosenFeature.getBoundingClientRect();
    const diffX = start.x - end.x;
    const diffY = start.y - end.y;

    chosenFeature.style.transform = `translate(${diffX}px, ${diffY}px)`;
    chosenFeature.offsetHeight;

    requestAnimationFrame(function() {
      chosenFeature.style.transition = "transform 3s";
      chosenFeature.style.transform = "translate(0,0)";
    })
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
    const start = removeFeature.getBoundingClientRect();
    const end = document.querySelector(`#options [data-feature=${feature}]`).getBoundingClientRect();
    const diffX = end.x - start.x;
    const diffY = end.y - start.y;

    removeFeature.style.transform = "translate(0,0)";
    removeFeature.offsetHeight;
    
    requestAnimationFrame(function() {
      removeFeature.style.transition = "transform 3s";
      removeFeature.style.transform = `translate(${diffX}px, ${diffY}px)`;
      setTimeout(removeThisFeature, 3000);
      //removeFeature.addEventListener("animationiteration", removeThisFeature);
    })
    function removeThisFeature() {
      //removeFeature.removeEventListener("animationiteration", removeThisFeature);
      list.removeChild(removeFeature);
    }
    
    
    // TODO: More code

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