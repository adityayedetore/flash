const myElements = {
  inputBoxes: window.document.querySelector("#input-boxes"),
  attractorDuration: window.document.querySelector("#attractor-duration"),
  videoNumber: window.document.querySelector("#video-number"),
  videoDuration: window.document.querySelector("#video-duration"),
  videoContainer: window.document.querySelector("#video-container"),
  flashLocationX: window.document.querySelector("#flash-location-x"), 
  flashLocationY: window.document.querySelector("#flash-location-y"), 
  flashTime: window.document.querySelector("#flash-time"),
  flashDuration: window.document.querySelector("#flash-duration"),
  dotOpacity: window.document.querySelector("#dot-opacity"),
  attractor: window.document.querySelector("#attractor"),
  video: window.document.querySelector("#video"),
  dot: window.document.querySelector("#dot")
}
const myStartButton = window.document.querySelector("button");
myStartButton.addEventListener("click", function() {main(myElements);});
/*
 * Retrives the video parameters set by the user in the input fields, then hides the input boxes and plays a flash dot video based on those parameters. When the video is over, the input boxes are shown again. 
 * Pre: in the input boxes, the video duration must be an integer between 0 and 10000, flash time an integer between 0 and 8000, flash duration an integer between 0 and 2000, video number an integer between 0 and 9, flash location for x and y an decimal number between 0.0 and 1.0 (inclusive), and dot opacity a dec imal number between 0.0 and 1.0 (exclusive). 
 * Post: this method returns the display to state before function call after a number of milliseconds equal to the attractor duration plus the video duration. 
 */
function main(myElements){
  unprocessedParams = getParamsValues(myElements);
  processedParams = processParams(unprocessedParams);
  hideElement(myElements.inputBoxes);
  runDemoTrial(processedParams);
  showElement(myElements.inputBoxes);
}
/*
 * Gets the parametrs inputed by the user.
 TODO: update pre
 * Pre: requires the inputs with ids attractor-duration, video-number, video-duration, flash-location-x, flash-location-y, flash-time, flash-duration, and dot-opacity to be filled. 
 * Post: Gets the parameters inputted by the user, and stores them in a object, and returns them.
 */
function getParamsValues(userInputs) {
  const unprocessedParams = {attractorDuration: parseInt(userInputs.attractorDuration.value),
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
  return unprocessedParams;
}
/*
   TODO: update this comment with the returned variable
 * Describe: Calculates the reletive time offests in milliseconds at which the attractor, video, and dot flash events should start and stop, and returns the information needed to run the demo experiment. 
 * Pre: takes an object with attributes int attractorDuration, int videoNumber, int videoDuration, float flashLocationX, float flashLocationY, flashTime, flashDuration
 * Pre: requires the inputs with ids attractor-duration, video-number, video-dur
 ation, flash-location-x, flash-location-y, flash-time, flash-duration, and dot-
 opacity to be filled. 
 * Post: returns an object containing three other objects. The attractor object contains the milliseconds after which the attractor should be shown (always 0) and hidden. The video object contains the time in milliseconds after the attractor is shown when the video should be shown and started, and paused and hidden. The dot object contains the reletive time the the dot should be flashed, the dot's flash's duration, the dot's location, the dot's opacity. 
 */
function processParams(params) {
  const attractor = {
    show: 0,
    hide: params.attractorDuration
  }
  const video = {
    show: attractor.hide,
    start: attractor.hide,
    stop: params.videoDuration + attractor.hide,
    hide: params.videoDuration + attractor.hide
  }
  //TODO: need to calculate and return the x and y pixels of the top left corner for the flashdot
  const x = params.flashLocationX * params.videoWidth;
  const y = params.flashLocationY * params.videoHeight;
  const flashDot = {
    dot: myElements.dot,
    time: params.flashTime + video.start,
    duration: params.flashDuration,
    opacity: params.dotOpacity,
    x: x, 
    y: y
  }
  const processedParams = {
    attractor: attractor,
    video: video,
    flashDot: flashDot
  }
  return processedParams;
}
/*
 * Show the unique element matched by the input string.
 * Pre: requires the existance of a element that matches the input string.
 * Post: The element that matches the input string will be shown. 
 */
// TODO: consider collapsing this and the function below
// TODO: yes collapse them
// 
function showElement(element) {
  element.classList.remove("hide");
}
/*
 * Hide the unique element matched by the input string.
 * Pre: requires the existance of a element that matches the input string.
 * Post: The element that matches the input string will be hidden. 
 */
// TODO: consider collapsing this and the function above
function hideElement(element) {
  element.classList.add("hide");
}

/*
 * Run the demo trial. Displays the attractor, the video, the flash, then hides the video, with the times and parameters requested. 
 * Pre: the trialParams parameter should contain objects attractor, video, and dot. The attractor object should contain integer attributes show and hide. The video object should contain integer attributes show, start, stop, and hide. The dot object should contain integers flash duration, x, and y, and decimal opacity which should be greater than 0 and less than or equal to 1. 
 * Post: Returns the display to how it started. 
 */
function runDemoTrial(trialParams) {
  setTimeout(function() {hideElement(myElements.inputBoxes);}, 0);
  setTimeout(function() {showElement(myElements.attractor);}, trialParams.attractor.show); 
  setTimeout(function() {hideElement(myElements.attractor);}, trialParams.attractor.hide);
  setTimeout(function() {showElement(myElements.video);}, trialParams.video.show);
  setTimeout(function() {startVideo(myElements.video);}, trialParams.video.start);
  prepareDot(trialParams.flashDot);
  setTimeout(function() {flashDot(trialParams.flashDot);}, trialParams.flashDot.time);
  setTimeout(function() {stopVideo(myElements.video);}, trialParams.video.stop);
  setTimeout(function() {hideElement(myElements.video);}, trialParams.video.hide);
  setTimeout(function() {showElement(myElements.inputBoxes);}, trialParams.video.hide);
}
/*
 * Plays the video. 
 TODO: describe this in more detail
 */
function startVideo(video) {
  video.currentTime = 0;
  video.play();
}
/*
 * Pauses the video. 
 * TODO: describe this better.
 */
function stopVideo(video) {
  video.pause();
}
/*
 * Prepare the dot 
 */
function prepareDot(dotParams) {
  dotParams.dot.style.left = dotParams.x + "px";
  dotParams.dot.style.top = dotParams.y + "px";
  dotParams.dot.style.opacity = dotParams.opacity;
}
/*
 * Flash the dot
 * TODO: describe this better.
 */
function flashDot(flashDotParams) {
  flashDotParams.dot.classList.toggle("hide");
  setTimeout(function() {
    flashDotParams.dot.classList.toggle("hide");
    }, flashDotParams.duration);
}
