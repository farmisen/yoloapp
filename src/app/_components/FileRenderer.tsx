import Image from "next/image"
import { type FC } from "react"

import { pdfToPng } from "~/server/utils/converters"

type FileRendererProps = {
  mimeType: string
  base64Data: string
  alt: string
}

const FileRenderer: FC<FileRendererProps> = async ({ mimeType, base64Data, alt }) => {
  let objectUrl
  if (mimeType.startsWith("image/")) {
    objectUrl = `data:${mimeType};base64,${base64Data}`
  }

  if (mimeType === "application/pdf") {
    const pdfBuffer = Buffer.from(base64Data, "base64")
    const imgBuffer = await pdfToPng(pdfBuffer)
    objectUrl = imgBuffer
      ? `data:image/png;base64,${imgBuffer.toString("base64")}`
      : undefined
  }

  if (objectUrl) {
    return (
      <div className="relative h-full w-full">
        <Image alt={alt} src={objectUrl} fill className="object-cover" />
      </div>
    )
  }

  return <div>{`Unsupported file type:${mimeType}`}</div>
}

export default FileRenderer
