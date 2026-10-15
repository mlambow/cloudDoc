'use client';

import {useEffect, useState} from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { DocumentItem } from '@/types/document';
import {ArrowLeft, FileText, Loader2, Pencil, Save, Trash, X} from "lucide-react";
import {deleteDocument, fetchDocumentById, updateDocument} from "@/lib/api";
import DeleteModal from "@/components/document-detail/DeleteModal";

export default function DocumentDetailPage() {
    const params = useParams();
    const router = useRouter();
    const docId = params.id as string;

    const [document, setDocument] = useState<DocumentItem | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isEditing, setIsEditing] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [targetDoc, setTargetDoc] = useState<{ id: string; fileName: string } | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [formData, setFormData] = useState({
        fileName: '',
        description: '',
        tags: '',
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        async function loadDocument() {
            try {
                setLoading(true);
                const data = await fetchDocumentById(docId)
                setDocument(data)
                setFormData({
                    fileName: data.fileName,
                    description: data.description || '',
                    tags: (data.tags ?? []).join(', ')
                })
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        if (docId) {
            void loadDocument()
        }
    }, [docId]);

    // Handle UPDATE
    const handleSave = async () => {
        if (!document) return
        setIsSaving(true);
        try {
            const updated = await updateDocument(document.id, {
                fileName: formData.fileName,
                description: formData.description,
                tags: formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
            });
            setDocument(updated);
            setIsEditing(false);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    // Open modal handler
    const promptDelete = (id: string, fileName: string) => {
        setTargetDoc({ id, fileName });
        setDeleteModalOpen(true);
    };

    // Confirm deletion handler
    const handleConfirmDelete = async () => {
        if (!targetDoc) return;
        setIsDeleting(true);
        try {
            await deleteDocument(targetDoc.id);
            setDeleteModalOpen(false);
            setTargetDoc(null);
            router.push('/documents');
        } catch (err) {
            console.error(err);
        } finally {
            setIsDeleting(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-sm text-slate-500">Loading document details...</div>;
    }

    if (!document) {
        return <div className="p-8 text-center text-sm text-slate-500">Document not found.</div>;
    }

    return (
        <div className='space-y-6'>
            <div className='flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400'>
                <Link
                    href='/documents'
                    className='flex items-center hover:underline hover:text-slate-700 dark:hover:text-slate-200'
                >
                    <ArrowLeft className='h-3 w-3 mr-2' />
                    Documents
                </Link>
                <span>/</span>
                <span className='font-medium text-slate-900 dark:text-slate-100'>
                    {document.id}
                </span>
            </div>

            <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                <div className='flex items-center gap-3'>
                    <span className='text-3xl'>
                        <FileText />
                    </span>
                    <div>
                        <h1 className='text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50'>
                            {document.fileName}
                        </h1>
                        <p className='text-xs text-slate-500 dark:text-slate-400'>
                            Uploaded {document.uploadedAt}
                        </p>
                    </div>
                </div>

                <div className='flex items-center gap-3'>
                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className='rounded-lg flex items-center space-x-2 border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors hover:cursor-pointer'
                        >
                            <Pencil className='h-3 w-3'/>
                            <span>Edit Metadata</span>
                        </button>
                    ) : (
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className='rounded-lg flex items-center space-x-2 bg-slate-800 px-3.5 py-2 text-xs font-medium text-white hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors disabled:opacity-50 hover:cursor-pointer'
                        >
                            {isSaving ?
                                <Loader2 className='h-3 w-3 mr-2 animate-spin'/>
                                :
                                <Save className='h-3 w-3 mr-2'/>
                            }
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    )}
                    <button
                        onClick={() => promptDelete(document.id, document.fileName)}
                        className='rounded-lg flex items-center border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-medium text-rose-700 hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:bg-rose-900/60 transition-colors hover:cursor-pointer'
                    >
                        <Trash className='h-3 w-3 mr-2'/>
                        Delete
                    </button>
                </div>
            </div>

            <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
                <div className='lg:col-span-1 space-y-6 h-[427px]'>
                    <div className='rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 h-full overflow-y-auto'>
                        <div className='flex items-center justify-between'>
                            <h3 className='mb-4 text-sm font-semibold text-slate-900 dark:text-slate-50'>
                                Document Properties
                            </h3>

                            {isEditing &&
                                <X
                                    onClick={() => setIsEditing(false)}
                                    className='size-3 dark:text-slate-50 text-slate-900 hover:cursor-pointer dark:hover:text-slate-400 hover:text-slate-600'
                                />
                            }
                        </div>

                        {!isEditing ? (
                            <div className='space-y-4 text-xs'>
                                <div>
                                    <span className='text-slate-400'>Status</span>
                                    <p className='mt-1 font-medium text-emerald-600 dark:text-emerald-400'>
                                        {document.status}
                                    </p>
                                </div>
                                <div>
                                    <span className='text-slate-400'>File Size</span>
                                    <p className='mt-0.5 font-medium text-slate-800 dark:text-slate-200'>
                                        {document.fileSize}
                                    </p>
                                </div>
                                <div>
                                    <span className='text-slate-400'>Pages</span>
                                    <p className='mt-0.5 font-medium text-slate-800 dark:text-slate-200'>
                                        {document.pageCount || 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <span className='text-slate-400'>Tags</span>
                                    <div className='mt-1.5 flex flex-wrap gap-1.5'>
                                        {document.tags.map(tag => (
                                            <span
                                                key={tag}
                                                className='rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <span className='text-slate-400'>Description</span>
                                    <p className='mt-0.5 font-medium text-slate-800 dark:text-slate-200'>
                                        {document.description}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className='space-y-4 text-xs'>
                                <div>
                                    <label className='block text-slate-500 mb-1'>File Name</label>
                                    <input
                                        type='text'
                                        value={formData.fileName}
                                        onChange={(e) => setFormData({...formData, fileName: e.target.value})}
                                        className='w-full rounded-md border border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100'
                                    />
                                </div>
                                <div>
                                    <label className='block text-slate-500 mb-1'>Description</label>
                                    <textarea
                                        rows={6}
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        className='w-full rounded-md border border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100'
                                    />
                                </div>
                                <div>
                                    <label className='block text-slate-500 mb-1'>Tags (comma-seperated)</label>
                                    <input
                                        type='text'
                                        value={formData.tags}
                                        onChange={(e) => setFormData({...formData, tags: e.target.value})}
                                        className='w-full rounded-md border border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100'
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className='lg:col-span-2'>
                    <div className='rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900'>
                        <div className='mb-4 flex items-center justify-between'>
                            <h3 className='text-sm font-semiblod textslate-900 dark:text-slate-50'>
                                Extracted Text Preview (Azure Processing)
                            </h3>
                            <Link
                                href={document.blobUrl ?? ''}
                                target='_blank'
                                rel='noopener'
                                className='text-xs font-medium text-slate-600 hover:underline dark:text-slate-400'
                            >
                                View Raw Blob
                            </Link>
                        </div>

                        <pre className='whitespace-pre-wrap rounded-lg h-[350px] overflow-y-auto border border-slate-200 bg-slate-50 p-4 font-mono text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300'>
                            {document.extractedText || 'No text extracted'}
                        </pre>
                    </div>
                </div>
            </div>

            <DeleteModal
                isOpen={deleteModalOpen}
                fileName={targetDoc?.fileName || ''}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                isDeleting={isDeleting}
            />
        </div>
    )
}