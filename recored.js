var recorderV = (() => {
  const config = {
    width: 1920,
    height: 1080,
    rate: 30,
    video: document.querySelector("video"),
    enc: "video/webm;codecs=h264"
  };

  const chunks = [];
  let frameId = null;
  const canvasElement = document.createElement('canvas')
  canvasElement.width = config.width;
  canvasElement.height = config.height;
  const canvasContext = canvasElement.getContext("2d");
  canvasContext.fillStyle = "deepskyblue";
  canvasContext.fillRect(0, 0, config.width, config.height);
  const stream = canvasElement.captureStream(config.rate);
  console.log('检测enc支持', MediaRecorder.isTypeSupported(config.enc));
  const recorder = new MediaRecorder(stream, {
    mimeType: config.enc
  });
  recorder.ondataavailable = e => {
    chunks.push(e.data);
  };
  function download(c) {
    let blob = new Blob(c);
    let url = window.URL.createObjectURL(blob);
    let link = document.createElement("a");
    link.href = url;
    link.download = new Date().getTime() + ".mp4";
    link.click();
  }
  function start() {
    recorder.start(10);
    drawFrame();
    config.video.play();
  }
  function stop() {
    config.video.pause();
    recorder.stop();
    window.cancelAnimationFrame(frameId);
    download(chunks);
  }
  function drawFrame() {
    canvasContext.drawImage(config.video, 0, 0, config.width, config.height);
    frameId = window.requestAnimationFrame(drawFrame);
  }
  return { start, stop }
})()
