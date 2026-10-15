'use client'

import { DocumentItem } from "@/types/document";
import { FileText, FileX } from "lucide-react";
import Link from "next/link";
import DeleteModal from "@/components/document-detail/DeleteModal";
import {useState} from "react";

interface DocumentTableProps {
    documents?: DocumentItem[];
    onDelete?: (id: string) => void;
}

export default function DocumentTable({ documents = [], onDelete }: DocumentTableProps) {
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [targetDoc, setTargetDoc] = useState<{ id: string; fileName: string } | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const getStatusBadge = (status: DocumentItem['status']) => {
        switch (status) {
            case 'Completed':
                return (
                    <span className='text-xs font-medium text-emerald-700 dark:text-emerald-400'>
                        Completed
                    </span>
                );
            case 'Processing':
                return (
                    <span className='text-xs font-medium text-amber-700 dark:text-amber-400'>
                        Processing
                    </span>
                );
            case 'Failed':
                return (
                    <span className='text-xs font-medium text-rose-700 dark:text-rose-400'>
                        Failed
                    </span>
                );
            default:
                return (
                    <span className='text-xs font-medium text-slate-600 dark:text-slate-400'>
                        Pending
                    </span>
                );
        }
    };

    // Trigger modal
    const promptDelete = (id: string, fileName: string) => {
        setTargetDoc({ id, fileName });
        setDeleteModalOpen(true);
    };

    // Handle confirmation
    const handleConfirmDelete = async () => {
        if (!targetDoc || !onDelete) return;

        setIsDeleting(true);
        try {
            onDelete(targetDoc.id);
            setDeleteModalOpen(false);
            setTargetDoc(null);
        } catch (err) {
            console.error('Failed to delete document:', err);
        } finally {
            setIsDeleting(false);
        }
    };

    const hasDocuments = documents && documents.length > 0;

    return (
        <div className='flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900'>
            {/* Header */}
            <div className='flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800'>
                <div>
                    <h3 className='text-base text-left font-semibold text-slate-900 dark:text-slate-50'>
                        Document Repository
                    </h3>
                    <p className='text-xs text-slate-500 dark:text-slate-400'>
                        Stored files and extracted metadata records from Azure Cosmos DB.
                    </p>
                </div>
                <span className='rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300'>
                    {documents.length} Records
                </span>
            </div>

            {/* Table or Empty State Content */}
            {hasDocuments ? (
                <div className='min-h-0 flex-1 overflow-y-auto overflow-x-auto'>
                    <table className='w-full text-left text-sm text-slate-600 dark:text-slate-300'>
                        <thead className='bg-slate-50 text-xs font-medium uppercase text-slate-500 dark:bg-slate-800/50 dark:text-slate-400'>
                        <tr>
                            <th scope='col' className='px-6 py-3'>File Name</th>
                            <th scope='col' className='px-6 py-3'>Status</th>
                            <th scope='col' className='px-6 py-3'>Size</th>
                            <th scope='col' className='px-6 py-3'>Uploaded</th>
                            <th scope='col' className='px-6 py3'>Tags</th>
                            <th scope='col' className='px-6 py-3 text-right'>Actions</th>
                        </tr>
                        </thead>
                        <tbody className='divide-y divide-slate-200 dark:divide-slate-800'>
                        {documents.map(doc => (
                            <tr
                                key={doc.id}
                                className='hover:bg-slate-50/80 transition-colors dark:hover:bg-slate-800/40'
                            >
                                <td className='px-6 py-4 font-medium text-slate-900 dark:text-slate-100'>
                                    <div className='flex items-center gap-3'>
                                        <span className='h-5 w-5 flex-shrink-0 text-slate-400 dark:text-slate-500'>
                                            <FileText className="h-5 w-5" />
                                        </span>
                                        <div className="flex flex-col">
                                            <Link
                                                href={`/documents/${doc.id}`}
                                                className='hover:underline hover:text-slate-700 dark:text-slate-200 dark:hover:text-white'
                                            >
                                                {doc.fileName}
                                            </Link>
                                            {doc.pageCount && (
                                                <span className='text-[11px] text-slate-400 dark:text-slate-500'>
                                                        {doc.pageCount} Pages Extracted
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </td>

                                <td className='px-6 py-4'>
                                    {getStatusBadge(doc.status)}
                                </td>

                                <td className='px-6 py-4 text-xs text-slate-500 dark:text-slate-400'>
                                    {doc.fileSize}
                                </td>

                                <td className='px-6 py-4 text-xs text-slate-500 dark:text-slate-400'>
                                    {doc.uploadedAt}
                                </td>

                                <td className='px-6 py-4 text-xs text-slate-500 dark:text-slate-400'>
                                    {doc.tags[0]}
                                </td>

                                <td className='px-6 py-4 text-right'>
                                    <div className='flex items-center justify-end gap-3'>
                                        <Link
                                            href={`/documents/${doc.id}`}
                                            className='text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                                        >
                                            View
                                        </Link>
                                        <button
                                            onClick={() => promptDelete(doc.id, doc.fileName)}
                                            className='text-xs font-medium text-rose-600 hover:text-rose-800 dark:text-rose-400 dark:hover:text-rose-300 hover:cursor-pointer'
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <DeleteModal
                        isOpen={deleteModalOpen}
                        fileName={targetDoc?.fileName || ''}
                        onClose={() => setDeleteModalOpen(false)}
                        onConfirm={handleConfirmDelete}
                        isDeleting={isDeleting}
                    />
                </div>
            ) : (
                /* Empty State */
                <div className='flex flex-1 flex-col items-center justify-center p-8 text-center'>
                    <div className='flex h-12 w-12 items-center justify-center rounded-full bg-slate-300 dark:bg-slate-800/80 mb-4 '>
                        <FileX className='h-6 w-6 text-slate-400 dark:text-slate-100' />
                    </div>
                    <h4 className='text-sm font-semibold text-slate-900 dark:text-slate-100'>
                        No documents found
                    </h4>
                    <p className='mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400'>
                        There are no metadata records stored in Azure Cosmos DB yet. Upload a document to get started.
                    </p>
                </div>
            )}
        </div>
    );
}