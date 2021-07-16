(async () => {
  const stream = await navigator.mediaDevices.getDisplayMedia({
    audio: true,
    video: true
  })
  console.log(stream);
  console.log(stream.getAudioTracks());
})()
//无法获取audio轨道