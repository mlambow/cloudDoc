'use client';

import {TriangleAlert} from "lucide-react";

interface DeleteModalProps {
    isOpen: boolean;
    fileName: string;
    onClose: () => void;
    onConfirm: () => void;
    isDeleting?: boolean;
}

export default function DeleteModal({
                                        isOpen,
                                        fileName,
                                        onClose,
                                        onConfirm,
                                        isDeleting = false,
                                    }: DeleteModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div
                className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 space-y-4"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header / Icon */}
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
                        <TriangleAlert />
                    </div>
                    <div>
                        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
                            Delete Document Record
                        </h3>
                    </div>
                </div>

                <p className='text-sm text-slate-500 dark:text-slate-400'>
                    You are about to delete this document and all its metadata. <span className='font-semibold text-slate-300 dark:text-slate-200'>This action cannot be undone.</span>
                </p>

                {/* Target File Info */}
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
                    <p className="text-sm text-slate-400">Target File:</p>
                    <p className="truncate text-xs font-medium text-slate-900 dark:text-slate-100 mt-0.5">
                        {fileName}
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isDeleting}
                        className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:cursor-pointer dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-medium text-white hover:bg-rose-700 dark:bg-rose-600 dark:hover:bg-rose-500 transition-colors disabled:opacity-50 hover:cursor-pointer flex items-center gap-1.5"
                    >
                        {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
}