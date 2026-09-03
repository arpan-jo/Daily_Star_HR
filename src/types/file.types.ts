export interface DownloadProps {
    fullUrl?: string | '',
    fileName?: string | '',
    fileId?: string | '',
    token?: string | ''
}

export interface DownloadResponse {
    status?: boolean | false,
    message?: string | ''
}