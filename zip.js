import unzipper from 'unzipper'
import stream from 'readable-stream'
import Core from 'barnard59-core'

export function unzip () {
  return unzipper.Parse()
}

export function unzipOne (pattern) {
  return unzipper.ParseOne(pattern)
}

class UnzipTransform extends stream.Transform {
  constructor (subPipeline, shouldProcess) {
    super({ objectMode: true })

    this.shouldProcess = shouldProcess
    this.subPipeline = subPipeline
  }

  _transform (entry, e, cb) {
    if (this.shouldProcess && this.shouldProcess(entry.path) === false) {
      console.log(`Skipping file ${entry.path}`)
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
      console.log(`Start processing file ${entry.path}`)
      entry.pipe(nextStream.streams[0]).on('finish', cb)
    })
  }
}

export function transform (subPipeline, shouldProcess) {
  return new UnzipTransform(subPipeline, shouldProcess)
}
