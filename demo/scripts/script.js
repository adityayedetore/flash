//Requires papaparse be imported through html, uses Papa.parse
//See https://www.papaparse.com/
(function() {
  const myStartButton = document.querySelector("button");
  myStartButton.addEventListener("click",  main);

  function main() {
    runTrial([], 0);
  }
  function runTrial(sawFlashAtOpacities, trialNumber){
    const parameterElements = getParameterElements();
    const displayElements = getDisplayElements();
    parameters = getParameters(parameterElements);
    runTrialVideo(parameters, displayElements, sawFlashAtOpacities, trialNumber);
  }
  function getParameterElements() {
    const elements = {
      attractorDuration: document.querySelector("#attractor-duration"),
      videoNumber: document.querySelector("#video-number"),
      videoDuration: document.querySelector("#video-duration"),
      videoContainer: document.querySelector("#video-container"),
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
    const flashDot = {
      timeForLocCSV: parameters.flashTime, //in seconds 
      time: parameters.flashTime, //in seconds, relative to video start time
      duration: 1000 * parameters.flashDuration,
      opacity: parameters.dotOpacity,
      videoWidth: parameters.videoWidth,
      videoHeight: parameters.videoHeight
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
  function runTrialVideo(parameters, elements, sawFlash, trialNumber) {
    setTimeout(function() {hide(elements.inputBoxes);}, 0);
    setTimeout(function() {show(elements.attractor);}, parameters.attractor.show); 
    setTimeout(function() {hide(elements.attractor);}, parameters.attractor.hide);
    setTimeout(function() {show(elements.video);}, parameters.video.show);
    setTimeout(function() {startVideo(elements.video);}, parameters.video.start);
    getReaction(elements.video, sawFlash, trialNumber, parameters.flashDot.opacity); 
    setupDot(parameters.flashDot, elements.dot);
    setTimeout(function() {flashDotTimer(elements.dot, parameters.flashDot, elements.video);}, parameters.video.start); 
    setTimeout(function() {stopVideo(elements.video);}, parameters.video.stop);
    setTimeout(function() {resetVideo(elements.video);}, parameters.video.hide);
    setTimeout(function() {hide(elements.video);}, parameters.video.hide);
    setTimeout(function() {nextTrial(elements.inputBoxes, sawFlash, trialNumber);}, parameters.video.hide);
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
    const config = {
      download: true, 
      complete: (locationTable) => {
        setDotLocation(locationTable, dotParameters, dot)
      }
    };
    //External function, callback is config.complete
    Papa.parse("../resources/dot-locations/Movie-Test.csv", config);
    setDotOpacity(dotParameters, dot);
  }
  function preloadDot(dot) {
    left = dot.style.left;
    bottom = dot.style.bottom;
    dot.style.left = "-9999px";
    dot.style.bottom = "-9999px";
    dot.classList.toggle("hide");
    dot.classList.toggle("hide");
    dot.style.left = left;
    dot.style.bottom = bottom;
  }
  function setDotLocation(locationTable, dotParameters, dot) {
    const chevronAndBallLocations = locationTable.data.find(element => element[0] > dotParameters.timeForLocCSV);
    // add 0.5 and divide by 15 to convert to proportion (csv units are weird)
    const x = ((parseFloat(chevronAndBallLocations[1]) + 0.5)/15.0) * dotParameters.videoWidth;
    const y = ((parseFloat(chevronAndBallLocations[2]) + 0.5)/15.0) * dotParameters.videoHeight;
    dot.style.left = x + "px";
    dot.style.bottom = y + "px";
  }
  function setDotOpacity(dotParameters, dot) {
    dot.style.opacity = dotParameters.opacity;
  }
  function flashDotTimer(dot, flashDot, video) {
    var id = setInterval(function() {flashDotController(dot,flashDot,video, id);}, 16);
  }
  function flashDotController(dot, flashDot, video, id) {
    if (video.currentTime > flashDot.time) {
      dot.classList.toggle("hide");
      setTimeout(function() {
        dot.classList.toggle("hide");
        }, flashDot.duration);
      clearInterval(id);
    }
  }
  function getReaction(video, sawFlashAtOpacities, trialNumber, opacity) {
    document.addEventListener('keyup', event => {
      if (event.code === "Space") {
        sawFlashAtOpacities[trialNumber] = opacity;
      }
    },
    {once: true});
  }
  function nextTrial(inputBoxes, sawFlashAtOpacities, trialNumber) {
    experimentDone = isExperimentDone(sawFlashAtOpacities, trialNumber);
    if (experimentDone) {
      show(inputBoxes);
    }
    else {
      runTrial(sawFlashAtOpacities, trialNumber + 1);
    }
  }
  function isExperimentDone(sawFlashAtOpacities, trialNumber) {
    //TODO
    return sawFlashAtOpacities.length > 0;
  }
})();
