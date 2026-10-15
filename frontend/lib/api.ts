import {DocumentItem} from "@/types/document";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function fetchAllDocuments(): Promise<DocumentItem[]> {
    const response = await fetch(`${API_BASE_URL}/documents`, {cache: 'no-cache'});
    if (!response.ok) throw new Error('Failed to fetch all documents');
    return response.json();
}

export async function fetchDocumentById(id: string): Promise<DocumentItem> {
    const response = await fetch(`${API_BASE_URL}/documents/${id}`, {cache: 'no-cache'});
    if (!response.ok) throw new Error('Failed to fetch document');
    return response.json();
}

export async function uploadDocument(file: File): Promise<DocumentItem> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_BASE_URL}/documents/upload`, {
        method: 'POST',
        body: formData,
    });
    if (!response.ok) throw new Error('Failed to upload document');
    return response.json();
}

export async function uploadMultipleDocuments(files: File[]): Promise<DocumentItem[]> {
    const formData = new FormData();
    files.forEach((file) => {
        formData.append('files', file);
    });

    const res = await fetch(`${API_BASE_URL}/documents/upload-batch`, {
        method: 'POST',
        body: formData,
    });

    if (!res.ok) throw new Error('Failed to upload files batch');
    return res.json();
}

export async function updateDocument(id: string, updatedData: Partial<DocumentItem>): Promise<DocumentItem> {
    const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(updatedData),
    })
    if (!response.ok) throw new Error('Failed to update document');
    return response.json();
}

export async function deleteDocument(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
        method: 'DELETE',
    })
    if (!response.ok) throw new Error('Failed to delete document');
    return response.json();
}