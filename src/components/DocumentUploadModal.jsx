import React, { useState, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { HiUpload, HiDocumentText, HiX, HiExclamationCircle } from 'react-icons/hi';
import api from '../utils/api';
import { Modal, ModalHeader, ModalContent, ModalFooter } from './ui/Modal';
import { Button } from './ui/Button';

const DOCUMENT_TYPES = [
  { value: 'BillOfLading', label: 'Bill of Lading (B/L)' },
  { value: 'CommercialInvoice', label: 'Commercial Invoice' },
  { value: 'PackingList', label: 'Packing List' },
  { value: 'CertificateOfOrigin', label: 'Certificate of Origin (COO)' },
  { value: 'CustomsDeclaration', label: 'Customs Declaration' },
  { value: 'ExportLicense', label: 'Export License' },
  { value: 'InsuranceCertificate', label: 'Insurance Certificate' },
  { value: 'InspectionCertificate', label: 'Inspection Certificate' },
  { value: 'PhytosanitaryCertificate', label: 'Phytosanitary Certificate' },
  { value: 'Other', label: 'Other Trade Document' },
];

const ALLOWED_EXTENSIONS = ['.pdf', '.png', '.jpg', '.jpeg', '.xlsx'];
const MAX_SIZE_BYTES = 25 * 1024 * 1024; // 25MB

export default function DocumentUploadModal({ open, onClose, onUploadComplete }) {
  const [file, setFile] = useState(null);
  const [documentType, setDocumentType] = useState('BillOfLading');
  const [customsRef, setCustomsRef] = useState('');
  const [issuer, setIssuer] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);

  const resetForm = () => {
    setFile(null);
    setDocumentType('BillOfLading');
    setCustomsRef('');
    setIssuer('');
    setUploadProgress(0);
    setErrorMessage('');
    setIsUploading(false);
  };

  const handleClose = () => {
    if (isUploading) return;
    resetForm();
    onClose();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate size
    if (selectedFile.size > MAX_SIZE_BYTES) {
      setErrorMessage(`File size (${(selectedFile.size / (1024 * 1024)).toFixed(1)}MB) exceeds maximum limit of 25MB`);
      setFile(null);
      return;
    }

    // Validate extension
    const ext = '.' + selectedFile.name.split('.').pop().toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setErrorMessage(`Invalid file format. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`);
      setFile(null);
      return;
    }

    setErrorMessage('');
    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setErrorMessage('Please select a document file to upload');
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);
    setErrorMessage('');

    try {
      // Step 1: Request presigned upload URL from backend
      const presignedRes = await api.post('/documents/presigned-upload', {
        fileName: file.name,
        mimeType: file.type || 'application/pdf',
        fileSizeBytes: file.size,
        documentType,
        metadata: {
          customsReference: customsRef.trim(),
          issuer: issuer.trim(),
        },
      });

      const { documentId, presignedPutUrl } = presignedRes.data;
      setUploadProgress(40);

      // Step 2: Upload file binary directly to presigned storage endpoint
      // Using axios without global interceptors to avoid sending auth tokens to S3/R2
      await axios.put(presignedPutUrl, file, {
        headers: {
          'Content-Type': file.type || 'application/pdf',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 40) / progressEvent.total);
            setUploadProgress(40 + percent); // 40% to 80%
          }
        },
      });

      setUploadProgress(85);

      // Step 3: Confirm upload with backend
      await api.post(`/documents/${documentId}/confirm-upload`);
      setUploadProgress(100);

      toast.success('Document uploaded and indexed successfully');
      resetForm();
      onUploadComplete?.();
      onClose();
    } catch (err) {
      console.error('Document upload error:', err);
      const serverErr = err.response?.data?.message || err.message || 'Failed to upload document';
      setErrorMessage(serverErr);
      toast.error(serverErr);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} maxWidth="max-w-md">
      <ModalHeader
        title="Upload Trade Document"
        description="Encrypted and cryptographically tracked in your tenant document vault"
        onClose={isUploading ? undefined : handleClose}
      />

      <form onSubmit={handleSubmit}>
        <ModalContent className="space-y-4">
          {errorMessage && (
            <div className="flex items-center gap-2 p-3 text-xs rounded-md bg-status-danger-bg text-status-danger border border-status-danger/20">
              <HiExclamationCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* File Picker */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              File Attachment <span className="text-status-danger">*</span>
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-colors ${
                file
                  ? 'border-accent-primary bg-accent-subtle/20'
                  : 'border-border-default hover:border-accent-primary hover:bg-surface-subtle'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.xlsx"
                onChange={handleFileChange}
                className="hidden"
                disabled={isUploading}
              />
              <div className="flex flex-col items-center justify-center gap-2">
                {file ? (
                  <>
                    <HiDocumentText className="w-8 h-8 text-accent-primary" />
                    <div className="text-xs font-semibold text-foreground truncate max-w-xs">{file.name}</div>
                    <div className="text-[11px] text-foreground-muted">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </div>
                  </>
                ) : (
                  <>
                    <HiUpload className="w-7 h-7 text-foreground-muted" />
                    <div className="text-xs font-medium text-foreground">Click to browse or drag file here</div>
                    <div className="text-[11px] text-foreground-muted">
                      PDF, PNG, JPG, or XLSX (up to 25MB)
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Document Type Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Document Classification <span className="text-status-danger">*</span>
            </label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              disabled={isUploading}
              className="w-full text-xs rounded-md border border-border-default bg-surface px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-accent-primary"
            >
              {DOCUMENT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Optional Metadata */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Customs / Ref #</label>
              <input
                type="text"
                placeholder="e.g. BL-2026-9918"
                value={customsRef}
                onChange={(e) => setCustomsRef(e.target.value)}
                disabled={isUploading}
                className="w-full text-xs rounded-md border border-border-default bg-surface px-3 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-accent-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Issuing Authority</label>
              <input
                type="text"
                placeholder="e.g. Chamber of Commerce"
                value={issuer}
                onChange={(e) => setIssuer(e.target.value)}
                disabled={isUploading}
                className="w-full text-xs rounded-md border border-border-default bg-surface px-3 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-accent-primary"
              />
            </div>
          </div>

          {/* Progress bar during upload */}
          {isUploading && (
            <div className="space-y-1 pt-2">
              <div className="flex justify-between text-[11px] text-foreground-muted">
                <span>Uploading encrypted artifact...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-1.5 bg-surface-subtle rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent-primary transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </ModalContent>

        <ModalFooter>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClose}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={!file || isUploading}
          >
            {isUploading ? 'Securing & Indexing...' : 'Upload Document'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
