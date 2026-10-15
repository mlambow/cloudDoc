export interface DocumentItem {
    id: string;
    fileName: string;
    fileSize: string;
    status: 'Pending' | 'Processing' | 'Completed' | 'Failed';
    mimeType: string;
    uploadedAt: string;
    description?: string;
    pageCount?: number;
    extractedText?: string;
    blobUrl?: string;
    tags: string[];
}