import { useState, useRef } from 'react'

// SVG Icon components
const UploadIcon = ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
)

const AlertCircleIcon = ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
)

export function FileDropzone({
    onFileSelect,
    acceptedFileTypes = ['application/pdf'],
    maxSize = 5 * 1024 * 1024,
    disabled = false,
}) {
    const [isDragging, setIsDragging] = useState(false)
    const [error, setError] = useState('')
    const fileInputRef = useRef(null)

    const validateFile = (file) => {
        setError('')

        if (!acceptedFileTypes.includes(file.type)) {
            const errorMsg = `Invalid file type. Please upload ${acceptedFileTypes.join(', ')} files.`
            setError(errorMsg)
            return false
        }

        if (file.size > maxSize) {
            const maxSizeMB = (maxSize / 1024 / 1024).toFixed(1)
            setError(`File size exceeds ${maxSizeMB}MB limit. Please compress or choose a smaller file.`)
            return false
        }

        return true
    }

    const handleFileChange = (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (validateFile(file)) {
            onFileSelect?.(file)
        } else {
            e.target.value = ''
        }
    }

    const handleDragOver = (e) => {
        e.preventDefault()
        if (!disabled) {
            setIsDragging(true)
        }
    }

    const handleDragLeave = (e) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setIsDragging(false)

        if (disabled) return

        const file = e.dataTransfer.files?.[0]
        if (!file) return

        if (validateFile(file)) {
            onFileSelect?.(file)
        }
    }

    const handleClick = () => {
        if (!disabled) {
            fileInputRef.current?.click()
        }
    }

    const maxSizeMB = (maxSize / 1024 / 1024).toFixed(1)
    const acceptedTypesText = acceptedFileTypes.map(type => type.replace('application/', '').toUpperCase()).join(', ')

    return (
        <div className="space-y-2">
            <div
                onClick={handleClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
          transition-all duration-200
          ${isDragging
                        ? 'border-aegean-500 bg-aegean-50'
                        : 'border-cloud hover:border-aegean-300 hover:bg-cloud/30'
                    }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={acceptedFileTypes.join(',')}
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={disabled}
                />

                <div className="flex flex-col items-center gap-2">
                    <div className={`
            p-3 rounded-full transition-colors
            ${isDragging ? 'bg-aegean-100' : 'bg-cloud'}
          `}>
                        <UploadIcon className={isDragging ? 'text-aegean-600' : 'text-muted'} />
                    </div>

                    <div>
                        <p className="text-sm font-medium text-midnight">
                            {isDragging ? 'Drop your file here' : 'Drag and drop your PDF file here'}
                        </p>
                        <p className="text-xs text-muted mt-1">
                            or click to browse • {acceptedTypesText} • Max {maxSizeMB}MB
                        </p>
                    </div>
                </div>
            </div>

            {error && (
                <div className="p-2 bg-coral-50 rounded-lg text-sm text-coral-500 flex items-center gap-2">
                    <AlertCircleIcon />
                    {error}
                </div>
            )}
        </div>
    )
}