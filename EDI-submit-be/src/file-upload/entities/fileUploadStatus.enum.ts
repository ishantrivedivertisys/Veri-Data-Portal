export enum FileUploadStatus  {
    PENDING = 'pending',
    NOTEMPLATE = 'noTemplate',
    TEMPLATEMISMATCH = 'templateMismatch',
    INVALIDATION = 'invalidation',
    APPROVED = 'approved',
    ERROR = 'error',
    UNMATCHED_COLUMNS = 'unmatchedColumns',
    EMPTY = 'empty'
}