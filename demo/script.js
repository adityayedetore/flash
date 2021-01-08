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
    attractorDuration: parseFloat(userInputs.attractorDuration.value),
    videoNumber: parseInt(userInputs.videoNumber.value),
    videoDuration: parseFloat(userInputs.videoDuration.value),
    videoWidth: parseInt(userInputs.videoContainer.offsetWidth),
    videoHeight: parseInt(userInputs.videoContainer.offsetHeight),
    flashTime: parseFloat(userInputs.flashTime.value),
    flashLocationX: parseFloat(userInputs.flashLocationX.value),
    flashLocationY: parseFloat(userInputs.flashLocationY.value),
    flashDuration: parseFloat(userInputs.flashDuration.value),
    dotOpacity: parseFloat(userInputs.dotOpacity.value)
  }
  return rawParameters;
}
function processParameters(parameters) {
  //multplying by 1000 to convert from seconds to milliseconds
  const attractor = {
    show: 0,
    hide: 1000 * parameters.attractorDuration 
  }
  const video = {
    show: attractor.hide,
    start: attractor.hide,
    stop: 1000 * parameters.videoDuration + attractor.hide,
    hide: 1000 * parameters.videoDuration + attractor.hide
  }
  //multplying by 0.1 to convert to proportion
  const x = (0.1 * parameters.flashLocationX) * parameters.videoWidth;
  const y = (0.1 * parameters.flashLocationY) * parameters.videoHeight;
  const flashDot = {
    time: 1000 * parameters.flashTime + video.start,
    duration: 1000 * parameters.flashDuration,
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
  setTimeout(function() {resetVideo(elements.video);}, parameters.video.hide);
  setTimeout(function() {hide(elements.video);}, parameters.video.hide);
  setTimeout(function() {show(elements.inputBoxes);}, parameters.video.hide);
}
function startVideo(video) {
  video.play();
}
function stopVideo(video) {
  video.pause();
}
function resetVideo(video) {
  video.currentTime = 0;
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
