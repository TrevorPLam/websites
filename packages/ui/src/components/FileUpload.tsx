'use client';

// File: packages/ui/src/components/FileUpload.tsx  [TRACE:FILE=packages.ui.components.FileUpload]
// Purpose: File upload with drag-and-drop and preview.
//          Provides accessible file selection with drag-and-drop support.
//
// Relationship: Depends on @repo/utils (cn), Progress component.
// System role: Form primitive (Layer L2 @repo/ui).
// Assumptions: Used for file selection. File handling only, no actual upload implementation.
//
// Exports / Entry: FileUpload, FileUploadProps
// Used by: Forms requiring file uploads
//
// Invariants:
// - File handling only (no actual upload implementation)
// - Drag-and-drop support
// - File preview support
//
// Status: @public
// Features:
// - [FEAT:UI] File selection
// - [FEAT:UI] Drag-and-drop support
// - [FEAT:UI] File preview
// - [FEAT:UI] Progress indicator

import * as React from 'react';
import { Upload, X, File } from 'lucide-react';
import { cn } from '@repo/utils';
import { Progress } from './Progress';
import { Button } from './Button';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface FileUploadProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Accepted file types */
  accept?: string;
  /** Maximum file size in bytes */
  maxSize?: number;
  /** Maximum number of files */
  maxFiles?: number;
  /** Callback when files are selected */
  onFilesChange?: (files: File[]) => void;
  /** Whether to show preview */
  showPreview?: boolean;
  /** Upload progress (0-100) */
  progress?: number;
  /** Whether upload is disabled */
  disabled?: boolean;
}

// ─── Component ───────────────────────────────────────────────────────────────

export const FileUpload = React.forwardRef<HTMLDivElement, FileUploadProps>(
  (
    {
      className,
      accept,
      maxSize,
      maxFiles = 1,
      onFilesChange,
      showPreview = true,
      progress,
      disabled,
      ...props
    },
    ref
  ) => {
    const [files, setFiles] = React.useState<File[]>([]);
    const [isDragging, setIsDragging] = React.useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFiles = (newFiles: FileList | null) => {
      if (!newFiles) return;

      const fileArray = Array.from(newFiles);
      const validFiles = fileArray.filter((file) => {
        if (maxSize && file.size > maxSize) return false;
        return true;
      });

      const updatedFiles =
        maxFiles === 1 ? validFiles.slice(0, 1) : [...files, ...validFiles].slice(0, maxFiles);
      setFiles(updatedFiles);
      onFilesChange?.(updatedFiles);
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled) return;
      handleFiles(e.dataTransfer.files);
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) setIsDragging(true);
    };

    const handleDragLeave = () => {
      setIsDragging(false);
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files);
    };

    const removeFile = (index: number) => {
      const updatedFiles = files.filter((_, i) => i !== index);
      setFiles(updatedFiles);
      onFilesChange?.(updatedFiles);
    };

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            'relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors',
            isDragging && 'border-primary bg-accent',
            disabled && 'cursor-not-allowed opacity-50',
            !disabled && 'hover:border-primary/50'
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            multiple={maxFiles > 1}
            onChange={handleFileInputChange}
            disabled={disabled}
            className="hidden"
            title="Select files to upload"
            aria-label="Select files to upload"
          />
          <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
          <p className="text-sm font-medium text-foreground">
            Drag and drop files here, or click to select
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {accept && `Accepted: ${accept}`}
            {maxSize && ` • Max size: ${(maxSize / 1024 / 1024).toFixed(2)} MB`}
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-4"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
          >
            Select Files
          </Button>
        </div>

        {progress !== undefined && progress > 0 && (
          <div className="mt-4">
            <Progress value={progress} />
          </div>
        )}

        {showPreview && files.length > 0 && (
          <div className="mt-4 space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-md border border-border p-3"
              >
                <div className="flex items-center gap-2">
                  <File className="h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{file.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(2)} KB
                    </span>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="small"
                  onClick={() => removeFile(index)}
                  disabled={disabled}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);
FileUpload.displayName = 'FileUpload';
