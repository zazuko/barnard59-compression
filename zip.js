const unzipper = require('unzipper')
const stream = require('readable-stream')
const Core = require('barnard59-core')

function unzip () {
  return unzipper.Parse()
}

function unzipOne (pattern) {
  return unzipper.ParseOne(pattern)
}

class UnzipTransform extends stream.Transform {
  constructor (subPipeline, shouldProcess, log) {
    super({ objectMode: true })

    this.shouldProcess = shouldProcess
    this.subPipeline = subPipeline
    this.log = log
  }

  _transform (entry, e, cb) {
    if (this.shouldProcess && this.shouldProcess(entry.path) === false) {
      this.log.info(`Skipping file ${entry.path}`)
      entry.autodrain()
      cb()
      return
    }

    const nextStream = Core.pipeline(this.subPipeline.node._context[0].dataset, {
      iri: this.subPipeline.node.term,
      basePath: this.subPipeline.basePath,
      context: this.subPipeline.context,
      variables: this.subPipeline.variables
    })
    nextStream.variables.set('csv', entry.path)

    nextStream._init().then(() => {
      this.log.info(`Start processing file ${entry.path}`)
      entry.pipe(nextStream.streams[0]).on('finish', cb)
    })
  }
}

function transform (subPipeline, shouldProcess) {
  return new UnzipTransform(subPipeline, shouldProcess, this.log)
}

module.exports = {
  unzip,
  unzipOne,
  transform
}
