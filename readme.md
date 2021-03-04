# barnard59-compression

Handling compression streams in barnard59 pipelines

## Unzip a compressed stream

Transforms a compressed zip stream into a new stream where each chunk is a stream of a file's contents

### Step

```
<> a p:Step;
  code:implementedBy [ a code:EcmaScript;
  code:link <node:barnard59-compression/zip.js#unzip>
].
```

## Unzips first file from a compressed stream

Transforms a compressed zip stream into a stream of the first file found in the compresed input matching a pattern

### Step

```
<> a p:Step;
  code:implementedBy [ a code:EcmaScript;
  code:link <node:barnard59-compression/zip.js#unzipOne>
].
```

## Process uncompressed files with sub pipeline

Use in combination with #unzip to process every file using the given sub pipeline. Optionally, provide a second argument to decide whether any given file should be skipped

### Step

```
<> a p:Step;
  code:implementedBy [ a code:EcmaScript;
  code:link <node:barnard59-compression/zip.js#transform>
].
```
