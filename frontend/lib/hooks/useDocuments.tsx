'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchAllDocuments, deleteDocument as apiDeleteDocument } from '@/lib/api';
import { DocumentItem } from '@/types/document';

export function useDocuments() {
    const [documents, setDocuments] = useState<DocumentItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const loadDocuments = useCallback(async () => {
        try {
            setErrorMessage('');
            const data = await fetchAllDocuments();
            setDocuments(data);
        } catch (error) {
            console.error('Failed to load documents:', error);
            setErrorMessage('Failed to load documents. Please try again.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadDocuments();
    }, [loadDocuments]);

    const handleDelete = async (id: string) => {
        await apiDeleteDocument(id);
        await loadDocuments(); // Refresh list after deletion
    };

    return {
        documents,
        loading,
        errorMessage,
        refreshDocuments: loadDocuments,
        deleteDocument: handleDelete,
    };
}