'use client'

import {useRef, useState} from "react";
import {FileText, Paperclip} from "lucide-react";
import {uploadDocument} from "@/lib/api";

interface FileUploaderProps {
    onUploadSuccess?: () => void
}

export default function FileUploader({onUploadSuccess}: FileUploaderProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [isDragging, setIsDragging] = useState<boolean>(false)
    const [isUploading, setIsUploading] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileSelect = (file: File) => {
        const allowedTypes = ["image/png", "image/jpeg", "application/pdf"]
        if (!allowedTypes.includes(file.type)) {
            setErrorMessage('Please select a PDF, PNG, JPEG file')
            return
        }
        setErrorMessage(null)
        setSelectedFile(file)
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0])
        }
    }

    const handleUpload = async () => {
        if (!selectedFile) return
        setIsUploading(true)
        setErrorMessage(null)
        try{
            await uploadDocument(selectedFile)
            setSelectedFile(null);
            if (onUploadSuccess) onUploadSuccess();
        }catch (error) {
            console.error(error)
            setErrorMessage('Upload failed. Please try again later.')
        }finally {
            setIsUploading(false)
        }
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    return (
        <div className='flex h-full min-h-0 flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900'>
            <div className='mb-8'>
                <h3 className='text-base font-semibold mt-2 text-slate-900 dark:text-slate-50'>
                    Upload Document
                </h3>
                <p className='text-xs text-slate-500 dark:text-slate-400'>
                    Select a PDF or image to store in Azure Blob & process metadata.
                </p>
            </div>

            {errorMessage && (
                <div className='mb-4 rounded-md bg-rose-100 p-2 text-xs text-rose-600 dark:bg-rose-900/50 dark:text-rose-400 '>
                    {errorMessage}
                </div>
            )}

            <input
                type='file'
                ref={fileInputRef}
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                accept='.pdf, .png, .jpg, .jpeg'
                className='hidden'
            />

            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !selectedFile && fileInputRef.current?.click()}
                className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center hover:cursor-pointer transition-colors 
                    ${isDragging 
                        ? 'border-slate-600 bg-slate-50 dark:border-slate-700 dark:bg-slate-950/40'
                        : selectedFile 
                        ? 'border-slate-300 bg-slate-50/50 dark:border-slate-700 dark:bg-slate-950/40' 
                        : 'border-slate-300 hover:border-slate-400 dark:border-slate-800 dark:hover:border-slate-700'
                    }
                `}
            >
                {!selectedFile ? (
                    <>
                        <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:cursor-pointer'>
                            <Paperclip />
                        </div>
                        <p className='text-sm font-medium text-slate-700 dark:text-slate-200'>
                            Drag & drop file here, or <span className='text-slate-900 underline dark:text-slate-50 hover:cursor-pointer'>browse</span>
                        </p>
                        <p className='mt-1 text-xs text-slate-400 dark:text-slate-500'>
                            Supports PDF, PNG, JPG (Max 10MB)
                        </p>
                    </>
                ) : (
                    <div className='w-full space-y-3'>
                        <div className='flex items-center justify-between rounded-lg border border-slate-200 px-4 py-4 bg-white dark:border-slate-800 dark:bg-slate-900'>
                            <div className='flex items-center gap-3 overflow-hidden'>
                                <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'>
                                    <FileText className=''/>
                                </div>
                                <div className='text-left flex flex-col items-start'>
                                    <p className='truncate text-sm font-medium text-slate-800 dark:text-slate-100'>
                                        {selectedFile.name}
                                    </p>
                                    <p className='text-[10px] text-left text-slate-400'>
                                        ({formatFileSize(selectedFile.size)})
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setSelectedFile(null)
                                }}
                                className='text-[10px] ml-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:cursor-pointer'
                            >
                                X
                            </button>
                        </div>

                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                void handleUpload()
                            }}
                            disabled={isUploading}
                            className='w-full rounded-lg py-3 bg-slate-800 text-xs font-medium text-white hover:bg-slate-900 dark:hover:bg-slate-700 dark:hover:bg-slate-600 hover:cursor-pointer transition-colors disabled:opacity-50'
                        >
                            {isUploading ? 'Uploading to Azure' : 'Upload to Cloud'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}