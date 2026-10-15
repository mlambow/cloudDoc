'use client';

import {useState} from 'react';
import DocumentTable from '@/components/DocumentTable';
import {Loader2} from "lucide-react";
import {useDocuments} from "@/lib/hooks/useDocuments";

export default function AllDocumentsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('All');
    const { documents, loading, errorMessage, deleteDocument } = useDocuments();

    // Filter documents based on search query and status tab
    const filteredDocuments = documents.filter((doc) => {
        const matchesSearch =
            doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesStatus =
            statusFilter === 'All' || doc.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                        All Documents
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Manage, search, and inspect all files stored across Azure Blob Storage and Cosmos DB.
                    </p>
                </div>
            </div>

            {/* Filter and Search Controls */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                {/* Search Input */}
                <div className="relative flex max-w-md flex-1">
                    <input
                        type="text"
                        placeholder="Search by file name or tag..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-full border border-slate-200 bg-slate-50 py-3 pl-6 pr-12 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                    />
                </div>

                {/* Status Tabs */}
                <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 py-3 px-4 dark:border-slate-800 dark:bg-slate-950">
                    {['All', 'Completed', 'Processing', 'Failed'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setStatusFilter(tab)}
                            className={`rounded-md px-3 py-2 text-xs font-medium transition-colors hover:cursor-pointer ${
                                statusFilter === tab
                                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-slate-100'
                                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {errorMessage && (
                <div className='mb-4 rounded-md bg-rose-100 p-2 text-xs text-rose-600 dark:bg-rose-900/50 dark:text-rose-400 '>
                    {errorMessage}
                </div>
            )}

            {/* Document Table View */}
            {loading ? (
                <div className="flex h-full w-full py-16 min-h-[60vh] items-center justify-center bg-slate-50 px-6 dark:bg-slate-950">
                    <div className="flex flex-col items-center gap-5 text-center">
                        {/* Loading spinner */}
                        <div className="flex size-20 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <Loader2 className="h-10 w-10 animate-spin text-blue-600 dark:text-blue-400" />
                        </div>

                        {/* Loading message */}
                        <div className="space-y-2">
                            <h1 className="text-xl font-semibold tracking-tight text-slate-800 dark:text-slate-100">
                                Loading your dashboard
                            </h1>

                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Please wait while we get everything ready for you.
                            </p>
                        </div>

                        {/* Animated progress indicator */}
                        <div className="h-1 w-40 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                            <div className="h-full w-1/2 animate-pulse rounded-full bg-blue-600 dark:bg-blue-400" />
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <DocumentTable documents={filteredDocuments} onDelete={deleteDocument} />
                </>
            )}
        </div>
    );
}