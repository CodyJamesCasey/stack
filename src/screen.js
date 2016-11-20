const aspectRatio = {
  width: 9,
  height: 16,
};

const setNewCanvasScreen = () => {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  let newCanvasHeight = null;
  let newCanvasWidth = null;
  const windowAspectRatio = windowWidth / windowHeight;
  if (windowAspectRatio > aspectRatio.width / aspectRatio.height) {
    newCanvasHeight = windowHeight;
    newCanvasWidth = windowHeight * aspectRatio.width / aspectRatio.height;
  } else {
    newCanvasWidth = windowWidth;
    newCanvasHeight = windowWidth * aspectRatio.height / aspectRatio.width;
  }

  size.width = newCanvasWidth;
  size.height = newCanvasHeight;
};

const size = {};
setNewCanvasScreen();

export default {
  size,
  setNewCanvasScreen,
}
