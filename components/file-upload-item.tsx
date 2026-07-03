"use client";

import { useEffect, useState } from "react";
import {
  AlertCircleIcon,
  Cancel01Icon,
  CheckmarkCircle01Icon,
  FileImageIcon,
  Icon,
} from "@/components/ui/icon";

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from "@/components/ui/attachment";
import { Spinner } from "@/components/ui/spinner";
import { ImagePreviewDialog } from "@/components/image-preview-dialog";

export type FileUploadStatus = "pending" | "decoding" | "success" | "failed";

interface FileUploadItemProps {
  fileName: string;
  status: FileUploadStatus;
  error?: string;
  onRemove?: () => void;
  file?: File;
  /** When true, pending items show loading icon (waiting in queue) */
  showLoadingForPending?: boolean;
  /** When true, allow image preview (only after all images finish decoding) */
  allowPreview?: boolean;
}

type AttachmentState = "idle" | "uploading" | "processing" | "error" | "done";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) {
    return kb < 10 ? `${kb.toFixed(1)} KB` : `${Math.round(kb)} KB`;
  }
  const mb = kb / 1024;
  return mb < 10 ? `${mb.toFixed(1)} MB` : `${Math.round(mb)} MB`;
}

function getFileSizeLabel(file: File | undefined): string | null {
  if (!file) return null;
  return formatFileSize(file.size);
}

function getStateDescription(
  state: AttachmentState,
  fileSize: string | null,
  error?: string
): string {
  if (state === "error") return error ?? "Dekod gagal.";

  const labels: Record<Exclude<AttachmentState, "error">, string> = {
    idle: "Sedia",
    uploading: "Mendekod",
    processing: "Memproses",
    done: "Selesai",
  };

  const label = labels[state];
  return fileSize ? `${label} · ${fileSize}` : label;
}

function toAttachmentState(
  status: FileUploadStatus,
  showLoadingForPending: boolean
): AttachmentState {
  switch (status) {
    case "failed":
      return "error";
    case "success":
      return "done";
    case "decoding":
      return "uploading";
    case "pending":
      return showLoadingForPending ? "processing" : "idle";
    default:
      return "idle";
  }
}

function AttachmentMediaContent({
  state,
  imageUrl,
  fileName,
}: {
  state: AttachmentState;
  imageUrl: string | null;
  fileName: string;
}) {
  if (imageUrl) {
    return (
      <AttachmentMedia variant="image">
        <img src={imageUrl} alt={fileName} />
      </AttachmentMedia>
    );
  }

  return (
    <AttachmentMedia>
      {state === "uploading" || state === "processing" ? (
        <Spinner />
      ) : state === "error" ? (
        <Icon icon={AlertCircleIcon} size={16} className="size-4" />
      ) : state === "done" ? (
        <Icon icon={CheckmarkCircle01Icon} size={16} className="size-4" />
      ) : (
        <Icon icon={FileImageIcon} size={16} className="size-4" />
      )}
    </AttachmentMedia>
  );
}

export function FileUploadItem({
  fileName,
  status,
  error,
  onRemove,
  file,
  showLoadingForPending = false,
  allowPreview = true,
}: FileUploadItemProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const attachmentState = toAttachmentState(status, showLoadingForPending);
  const fileSize = getFileSizeLabel(file);
  const stateDescription = getStateDescription(
    attachmentState,
    fileSize,
    error
  );

  const canPreview =
    allowPreview && (status === "success" || status === "failed") && imageUrl;

  useEffect(() => {
    if (file && (status === "success" || status === "failed")) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      return () => {
        URL.revokeObjectURL(url);
        setImageUrl(null);
      };
    }
    setImageUrl(null);
  }, [file, status]);

  return (
    <>
      <Attachment state={attachmentState} className="w-full">
        <AttachmentMediaContent
          state={attachmentState}
          imageUrl={imageUrl}
          fileName={fileName}
        />
        <AttachmentContent>
          <AttachmentTitle title={fileName}>{fileName}</AttachmentTitle>
          <AttachmentDescription>{stateDescription}</AttachmentDescription>
        </AttachmentContent>
        {onRemove && (
          <AttachmentActions>
            <AttachmentAction
              aria-label="Buang fail"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
            >
              <Icon icon={Cancel01Icon} size={16} className="size-4" />
            </AttachmentAction>
          </AttachmentActions>
        )}
        {canPreview && (
          <AttachmentTrigger
            aria-label={`Pratonton ${fileName}`}
            onClick={() => setPreviewOpen(true)}
          />
        )}
      </Attachment>
      <ImagePreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        src={imageUrl}
        alt={fileName}
      />
    </>
  );
}
