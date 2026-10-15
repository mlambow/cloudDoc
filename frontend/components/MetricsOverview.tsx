import {Database, File, Zap} from "lucide-react";

export default function MetricsOverview() {
    const metrics = [
        {
            title: 'Total Documents',
            value: '24',
            change: '+4 this week',
            icon: <File />
        },
        {
            title: 'Azure Storage Used',
            value: '18.4 MB',
            change: 'Blob Container: docs',
            icon: <Database />
        },
        {
            title: 'Avg. Extraction Speed',
            value: '1.2s',
            change: 'Azure Function trigger',
            icon: <Zap />
        },
    ]

    return (
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
            {metrics.map((metric) => (
                <div
                    key={metric.title}
                    className='rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900'
                >
                    <div className='flex items-center justify-between'>
                        <span className='text-sm font-medium text-slate-500 dark:text-slate-400'>
                            {metric.title}
                        </span>
                        <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800'>
                            {metric.icon}
                        </div>
                    </div>
                    <div className='mt-2'>
                        <p className='text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50'>
                            {metric.value}
                        </p>
                        <p className='mt-1 text-xs text-slate-500 dark:text-slate-400'>
                            {metric.change}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    )
}