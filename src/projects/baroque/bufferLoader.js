export default class BufferLoader {
  constructor(contextPm, arrUrlPm, functionFinishedPm, onfinishedFile) {
    // audio context
    this.context = contextPm
    // array of file url paths
    this.arrUrl = arrUrlPm
    // a function
    this.functionFinished = functionFinishedPm
    // array of buffers which I create
    this.arrBuffer = new Array()
    // which file are we on
    this.ind = 0
    this.onfinishedFile = onfinishedFile
  }

  load = () => {
    this.loadFile(0)
  }

  loadFile = indPm => {
    var request = new XMLHttpRequest()
    var url = this.arrUrl[indPm]
    request.open('GET', url, true)
    request.responseType = 'arraybuffer'
    var context = this.context
    var that = this

    // Decode asynchronously
    request.onload = function() {
      // when it's done
      context.decodeAudioData(
        request.response,
        theBuffer => {
          that.onfinishedFile()
          that.finishedFile(theBuffer)
        },
        error => console.log('error!', error)
      )
    }
    request.send()
  }

  finishedFile = bufferPm => {
    this.arrBuffer.push(bufferPm)
    // is that the last one?
    if (this.ind >= this.arrUrl.length - 1) {
      // done, call the finished function and return the array of buffers
      this.functionFinished(this.arrBuffer)
    } else {
      this.ind++
      // load the next one
      this.loadFile(this.ind)
    }
  }
}
