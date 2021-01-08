const myStartButton = document.querySelector("button");
myStartButton.addEventListener("click",  main);

function main(){
  const parameterElements = getParameterElements();
  const displayElements = getDisplayElements();
  parameters = getParameters(parameterElements);
  runTrialVideo(parameters, displayElements);
}
function getParameterElements() {
  const elements = {
    attractorDuration: document.querySelector("#attractor-duration"),
    videoNumber: document.querySelector("#video-number"),
    videoDuration: document.querySelector("#video-duration"),
    videoContainer: document.querySelector("#video-container"),
    flashLocationX: document.querySelector("#flash-location-x"), 
    flashLocationY: document.querySelector("#flash-location-y"), 
    flashTime: document.querySelector("#flash-time"),
    flashDuration: document.querySelector("#flash-duration"),
    dotOpacity: document.querySelector("#dot-opacity"),
  };
  return elements;
}
function getDisplayElements() {
  const elements = {
    inputBoxes: document.querySelector("#input-boxes"),
    attractor: document.querySelector("#attractor"),
    video: document.querySelector("#video"),
    dot: document.querySelector("#dot")
  };
  return elements;
}
function getParameters(userInputElements) {
  rawParameters = getRawParameters(userInputElements);
  return processParameters(rawParameters);
}
function getRawParameters(userInputs) {
  const rawParameters = {
    attractorDuration: parseInt(userInputs.attractorDuration.value),
    videoNumber: parseInt(userInputs.videoNumber.value),
    videoDuration: parseInt(userInputs.videoDuration.value),
    videoWidth: parseInt(userInputs.videoContainer.offsetWidth),
    videoHeight: parseInt(userInputs.videoContainer.offsetHeight),
    flashTime: parseInt(userInputs.flashTime.value),
    flashLocationX: parseFloat(userInputs.flashLocationX.value),
    flashLocationY: parseFloat(userInputs.flashLocationY.value),
    flashDuration: parseInt(userInputs.flashDuration.value),
    dotOpacity: parseFloat(userInputs.dotOpacity.value)
  }
  return rawParameters;
}
function processParameters(parameters) {
  const attractor = {
    show: 0,
    hide: parameters.attractorDuration
  }
  const video = {
    show: attractor.hide,
    start: attractor.hide,
    stop: parameters.videoDuration + attractor.hide,
    hide: parameters.videoDuration + attractor.hide
  }
  const x = parameters.flashLocationX * parameters.videoWidth;
  const y = parameters.flashLocationY * parameters.videoHeight;
  const flashDot = {
    time: parameters.flashTime + video.start,
    duration: parameters.flashDuration,
    opacity: parameters.dotOpacity,
    x: x, 
    y: y
  }
  const processedParameters = {
    attractor: attractor,
    video: video,
    flashDot: flashDot
  }
  return processedParameters;
}
function show(element) {
  element.classList.remove("hide");
}
function hide(element) {
  element.classList.add("hide");
}
function runTrialVideo(parameters, elements) {
  setTimeout(function() {hide(elements.inputBoxes);}, 0);
  setTimeout(function() {show(elements.attractor);}, parameters.attractor.show); 
  setTimeout(function() {hide(elements.attractor);}, parameters.attractor.hide);
  setTimeout(function() {show(elements.video);}, parameters.video.show);
  setTimeout(function() {startVideo(elements.video);}, parameters.video.start);
  setupDot(parameters.flashDot, elements.dot);
  setTimeout(function() {flashDot(elements.dot, parameters.flashDot.duration);}, parameters.flashDot.time);
  setTimeout(function() {stopVideo(elements.video);}, parameters.video.stop);
  setTimeout(function() {hide(elements.video);}, parameters.video.hide);
  setTimeout(function() {show(elements.inputBoxes);}, parameters.video.hide);
}
function startVideo(video) {
  video.currentTime = 0;
  video.play();
}
function stopVideo(video) {
  video.pause();
}
function setupDot(dotParameters, dot) {
  preloadDot(dot);
  setDotLocationAndOpacity(dotParameters, dot);
}
function preloadDot(dot) {
  dot.style.left = "-9999px";
  dot.style.top = "-9999px";
  flashDot(dot, 0);
}
function setDotLocationAndOpacity(dotParameters, dot) {
  dot.style.left = dotParameters.x + "px";
  dot.style.top = dotParameters.y + "px";
  dot.style.opacity = dotParameters.opacity;
}
function flashDot(dot, duration) {
  dot.classList.toggle("hide");
  setTimeout(function() {
    dot.classList.toggle("hide");
    }, duration);
}
