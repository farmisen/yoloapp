import { Viewer, Worker } from "@react-pdf-viewer/core"
import "@react-pdf-viewer/core/lib/styles/index.css"
import Image from "next/image"
import { type FC } from "react"

import { Input } from "~/components/ui/input"
import { objectUrlMimeType } from "~/lib/utils"

type FileUploadProps = {
  accept?: string
  maxSize?: number
  value: File | null
  previewUrl: string | null
  onChange: (file: File | null) => void
}

const FileUpload: FC<FileUploadProps> = ({
  accept,
  maxSize,
  value,
  previewUrl,
  onChange
}: FileUploadProps) => {
  const mimetype = value?.type ?? (previewUrl ? objectUrlMimeType(previewUrl) : null)

  return (
    <div className="space-y-2">
      <Input
        type="file"
        accept={accept}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (!file) {
            onChange(null)
            return
          }

          if (maxSize && file.size > maxSize) {
            e.target.value = ""
            onChange(null)
            return
          }

          onChange(file)
        }}
      />
      {value && (
        <p className="text-sm text-muted-foreground">Selected file: {value.name}</p>
      )}

      {previewUrl && mimetype?.startsWith("image/") && (
        <div className="mt-2">
          <p className="mb-1 text-sm text-muted-foreground">Preview:</p>
          <Image
            src={previewUrl}
            alt="File preview"
            width={300}
            height={300}
            className="max-h-48 rounded-md border object-contain"
            style={{ width: "auto", height: "auto" }}
          />
        </div>
      )}
      {previewUrl && mimetype === "application/pdf" && (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
          <Viewer fileUrl={previewUrl} />
        </Worker>
      )}
    </div>
  )
}

export default FileUpload
