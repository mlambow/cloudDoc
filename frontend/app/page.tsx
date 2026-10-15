'use client'

import MetricsOverview from "@/components/MetricsOverview";
import FileUploader from "@/components/FileUploader";
import DocumentTable from "@/components/DocumentTable";
import {Loader2} from "lucide-react";
import {useDocuments} from "@/lib/hooks/useDocuments";

export default function DashboardPage() {
    const { documents, loading, errorMessage, refreshDocuments, deleteDocument } = useDocuments();


    return (
        <div className='space-y-6'>
            <div>
                <h1 className='text-2xl font-bold tracking-tight text-slate-700 dark:text-slate-50'>
                    Document Overview
                </h1>
                <p className='text-sm text-slate-500 dark:text-slate-400'>
                    Monitor uploaded file, storage metrics and background processing status.
                </p>
            </div>

            {errorMessage && (
                <div className='mb-4 rounded-md bg-rose-100 p-2 text-xs text-rose-600 dark:bg-rose-900/50 dark:text-rose-400 '>
                    {errorMessage}
                </div>
            )}

            {loading ? (
                <div className="flex min-h-[70vh] h-full w-full items-center justify-center bg-slate-50 px-6 dark:bg-slate-950">
                    <div className="flex flex-col items-center gap-5 text-center">
                        {/* Loading spinner */}
                        <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <Loader2 className="size-10 animate-spin text-blue-600 dark:text-blue-400" />
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
                    <MetricsOverview />

                    <div className='grid grid-cols-1 gap-8 lg:grid-cols-3 lg:h-[350px]'>
                        <div className='lg:col-span-1 h-full rounded-xl border border-dashed border-slate-300 p-4 dark:border-slate-800 text-center text-slate-400 text-sm'>
                            <FileUploader onUploadSuccess={refreshDocuments}/>
                        </div>
                        <div className='lg:col-span-2 h-full min-h-0 rounded-xl border border-dashed border-slate-300 p-4 dark:border-slate-800 text-center text-slate-400 text-sm'>
                            <DocumentTable documents={documents} onDelete={deleteDocument}/>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}