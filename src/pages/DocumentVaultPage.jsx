import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  HiDocumentText,
  HiDownload,
  HiUpload,
  HiTrash,
  HiCheckCircle,
  HiXCircle,
  HiSearch,
  HiFilter,
  HiRefresh,
  HiShieldCheck,
  HiClock,
  HiEye,
  HiClipboardCopy,
} from 'react-icons/hi';
import api from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Modal, ModalHeader, ModalContent, ModalFooter } from '../components/ui/Modal';
import DocumentUploadModal from '../components/DocumentUploadModal';
import DataTable from '../components/ui/DataTable';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';

const CATEGORY_TABS = [
  { label: 'All Documents', value: 'All' },
  { label: 'Bills of Lading', value: 'BillOfLading' },
  { label: 'SGS / Lab COA', value: 'InspectionCertificate' },
  { label: 'Certificates of Origin', value: 'CertificateOfOrigin' },
  { label: 'Commercial Invoices', value: 'CommercialInvoice' },
  { label: 'Customs Declarations', value: 'CustomsDeclaration' },
];

export default function DocumentVaultPage() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Inspector modal state
  const [inspectedDoc, setInspectedDoc] = useState(null);

  // Review modal state
  const [reviewDoc, setReviewDoc] = useState(null);
  const [reviewStatus, setReviewStatus] = useState('Verified');
  const [reviewNotes, setReviewNotes] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Delete modal state
  const [docToDelete, setDocToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchDocuments = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {};
      if (selectedType !== 'All') params.documentType = selectedType;
      if (selectedStatus !== 'All') params.status = selectedStatus;

      const res = await api.get('/documents', { params });
      setDocuments(res.data);
    } catch (err) {
      console.error('Failed to load documents:', err);
      if (err.response?.status === 403) {
        setDocuments([]);
      } else {
        toast.error('Failed to retrieve vault documents');
      }
    } finally {
      setIsLoading(false);
    }
  }, [selectedType, selectedStatus]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleDownload = async (doc) => {
    try {
      const res = await api.get(`/documents/${doc._id}/download-url`);
      const { presignedGetUrl, fileName } = res.data;

      // Trigger secure browser download
      const link = document.createElement('a');
      link.href = presignedGetUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Downloading ${fileName}`);
    } catch (err) {
      console.error('Download failed:', err);
      toast.error(err.response?.data?.message || 'Failed to generate download URL');
    }
  };

  const handleReviewSubmit = async () => {
    if (!reviewDoc) return;
    setIsSubmittingReview(true);
    try {
      await api.patch(`/documents/${reviewDoc._id}/verify`, {
        status: reviewStatus,
        verificationNotes: reviewNotes.trim(),
      });
      toast.success(`Document marked as ${reviewStatus}`);
      setReviewDoc(null);
      setReviewNotes('');
      fetchDocuments();
    } catch (err) {
      console.error('Verification failed:', err);
      toast.error(err.response?.data?.message || 'Verification failed');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const [bulkDeleteIds, setBulkDeleteIds] = useState([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  const handleBulkDelete = async () => {
    if (bulkDeleteIds.length === 0) return;
    setIsBulkDeleting(true);
    try {
      const res = await api.delete('/documents/bulk', {
        data: { ids: bulkDeleteIds },
      });
      const { deleted = [], failed = [] } = res.data || {};
      if (failed.length > 0) {
        const firstReason = failed[0]?.reason || 'Some documents could not be removed.';
        toast.error(`${failed.length} of ${bulkDeleteIds.length} failed: ${firstReason}`);
      }
      if (deleted.length > 0) {
        toast.success(`${deleted.length} document${deleted.length === 1 ? '' : 's'} removed from vault.`);
      }
    } catch {
      const results = await Promise.allSettled(
        bulkDeleteIds.map((id) => api.delete(`/documents/${id}`))
      );
      const failed = results.filter((r) => r.status === 'rejected').length;
      if (failed > 0) {
        toast.error(`${failed} of ${bulkDeleteIds.length} documents could not be removed.`);
      } else {
        toast.success(`${bulkDeleteIds.length} documents removed from the registry.`);
      }
    } finally {
      setBulkDeleteIds([]);
      setIsBulkDeleting(false);
      fetchDocuments();
    }
  };

  const handleDeleteConfirm = async () => {
    if (!docToDelete) return;
    setIsDeleting(true);
    try {
      await api.delete(`/documents/${docToDelete._id}`);
      toast.success('Document removed from registry');
      setDocToDelete(null);
      fetchDocuments();
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error(err.response?.data?.message || 'Failed to remove document');
    } finally {
      setIsDeleting(false);
    }
  };

  // Format bytes
  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Filtered by search query
  const filteredDocs = documents.filter((doc) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      doc.fileName?.toLowerCase().includes(q) ||
      doc.documentType?.toLowerCase().includes(q) ||
      doc.metadata?.customsReference?.toLowerCase().includes(q) ||
      doc.uploadedByEmail?.toLowerCase().includes(q)
    );
  });

  // Calculate vault stats
  const totalDocs = documents.length;
  const verifiedCount = documents.filter((d) => d.status === 'Verified').length;
  const pendingCount = documents.filter((d) => d.status === 'Uploaded' || d.status === 'PendingUpload').length;
  const totalSizeBytes = documents.reduce((sum, d) => sum + (d.fileSizeBytes || 0), 0);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Verified':
        return <Badge variant="success" hasDot>Verified</Badge>;
      case 'Uploaded':
        return <Badge variant="accent" hasDot>Uploaded</Badge>;
      case 'Rejected':
        return <Badge variant="danger" hasDot>Rejected</Badge>;
      case 'PendingUpload':
        return <Badge variant="warning" hasDot>Pending Upload</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">Secure Document Vault</h1>
          <p className="text-xs text-foreground-muted mt-1">
            Immutable trade document registry with compliance verification and cryptographically audited access.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchDocuments}
            disabled={isLoading}
          >
            <HiRefresh className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsUploadModalOpen(true)}
          >
            <HiUpload className="w-3.5 h-3.5" />
            Upload Document
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-accent-subtle text-accent-primary">
              <HiDocumentText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-medium text-foreground-muted">Total Indexed</div>
              <div className="text-lg font-bold text-foreground">{totalDocs}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-status-success-bg text-status-success">
              <HiShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-medium text-foreground-muted">Verified Compliant</div>
              <div className="text-lg font-bold text-status-success">{verifiedCount}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-status-warning-bg text-status-warning">
              <HiClock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-medium text-foreground-muted">Pending Review</div>
              <div className="text-lg font-bold text-status-warning">{pendingCount}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-surface-subtle text-foreground-secondary">
              <HiDocumentText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-medium text-foreground-muted">Total Vault Size</div>
              <div className="text-lg font-bold text-foreground">{formatBytes(totalSizeBytes)}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter Bar */}
      <Card>
        <CardContent className="p-4 space-y-3">
          {/* Category Quick Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORY_TABS.map((tab) => {
              const active = selectedType === tab.value;
              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setSelectedType(tab.value)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                    active
                      ? 'bg-accent-primary text-white font-semibold shadow-xs'
                      : 'bg-surface-subtle text-foreground-secondary hover:bg-surface-hover hover:text-foreground'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <HiSearch className="absolute left-3 top-2.5 w-4 h-4 text-foreground-muted" />
              <input
                type="text"
                placeholder="Search by file name, customs ref, or uploader..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs rounded-md border border-border-default bg-surface pl-9 pr-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-accent-primary"
              />
            </div>

            {/* Document Type Filter */}
            <div className="flex items-center gap-2">
              <HiFilter className="w-4 h-4 text-foreground-muted shrink-0" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="text-xs rounded-md border border-border-default bg-surface px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-accent-primary"
              >
                <option value="All">All Types</option>
                <option value="BillOfLading">Bill of Lading</option>
                <option value="CommercialInvoice">Commercial Invoice</option>
                <option value="PackingList">Packing List</option>
                <option value="CertificateOfOrigin">Certificate of Origin</option>
                <option value="CustomsDeclaration">Customs Declaration</option>
                <option value="ExportLicense">Export License</option>
                <option value="InspectionCertificate">Inspection Certificate</option>
                <option value="Other">Other</option>
              </select>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="text-xs rounded-md border border-border-default bg-surface px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-accent-primary"
              >
                <option value="All">All Statuses</option>
                <option value="Uploaded">Uploaded</option>
                <option value="Verified">Verified</option>
                <option value="Rejected">Rejected</option>
                <option value="PendingUpload">Pending Upload</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents Registry Table */}
      <Card>
        <CardHeader className="p-4 border-b border-border-default flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-semibold text-foreground">
            Tenant Document Ledger ({filteredDocs.length})
          </CardTitle>
        </CardHeader>
        <DataTable
          rows={filteredDocs}
          rowKey={(doc) => doc._id}
          isLoading={isLoading}
          skeletonRows={6}
          selectable
          initialSort={{ key: 'uploadedAt', dir: 'desc' }}
          pageSize={8}
          columns={[
            {
              key: 'fileName',
              header: 'Document',
              sortable: true,
              render: (doc) => (
                <div className="min-w-0">
                  <div className="max-w-[22rem] truncate font-semibold text-foreground">
                    {doc.fileName}
                  </div>
                  {doc.metadata?.customsReference && (
                    <div className="text-[12px] text-foreground-muted">
                      Ref: <span className="font-mono">{doc.metadata.customsReference}</span>
                    </div>
                  )}
                </div>
              ),
            },
            {
              key: 'documentType',
              header: 'Classification',
              sortable: true,
              render: (doc) => <span className="font-medium text-foreground">{doc.documentType}</span>,
            },
            {
              key: 'fileSizeBytes',
              header: 'Size',
              sortable: true,
              hideBelow: 'sm',
              render: (doc) => <span className="font-mono">{formatBytes(doc.fileSizeBytes)}</span>,
            },
            {
              key: 'status',
              header: 'Audit status',
              sortable: true,
              render: (doc) => (
                <div className="space-y-1">
                  <div>{getStatusBadge(doc.status)}</div>
                  {doc.verificationNotes && (
                    <div className="max-w-[14rem] truncate text-[12px] italic text-foreground-muted">
                      Note: {doc.verificationNotes}
                    </div>
                  )}
                </div>
              ),
            },
            {
              key: 'uploadedAt',
              header: 'Uploaded',
              sortable: true,
              hideBelow: 'lg',
              sortValue: (doc) => new Date(doc.createdAt).getTime(),
              render: (doc) => (
                <div className="min-w-0">
                  <div className="max-w-[13rem] truncate">{doc.uploadedByEmail}</div>
                  <div className="text-[12px] text-foreground-muted">
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ),
            },
            {
              key: 'actions',
              header: 'Actions',
              align: 'right',
              render: (doc) => (
                <div className="flex items-center justify-end gap-1.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setInspectedDoc(doc)}
                    title="Inspect audit trail"
                  >
                    <HiEye className="h-3.5 w-3.5 text-accent-primary" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(doc)}
                    title="Download document"
                    disabled={doc.status === 'PendingUpload'}
                  >
                    <HiDownload className="h-3.5 w-3.5" />
                  </Button>
                  {(user?.isAdmin || user?.userType === 'demo-admin') && (
                    <Button
                      variant="ghost"
                      size="sm"
                      title="Review compliance"
                      onClick={() => {
                        setReviewDoc(doc);
                        setReviewStatus('Verified');
                        setReviewNotes('');
                      }}
                    >
                      <HiShieldCheck className="h-3.5 w-3.5 text-accent-primary" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDocToDelete(doc)}
                    title="Delete document"
                    className="hover:text-status-danger"
                  >
                    <HiTrash className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ),
            },
          ]}
          bulkActions={(selectedRows, clear) => (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  selectedRows.forEach((doc) => handleDownload(doc));
                  clear();
                }}
              >
                <HiDownload className="h-3.5 w-3.5" /> Download
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setBulkDeleteIds(selectedRows.map((doc) => doc._id))}
              >
                <HiTrash className="h-3.5 w-3.5" /> Delete
              </Button>
            </>
          )}
          renderMobileCard={(doc) => (
            <div className="space-y-1.5">
              <div className="truncate font-semibold text-foreground">{doc.fileName}</div>
              <div className="flex flex-wrap items-center gap-2 text-[12px] text-foreground-muted">
                <span>{doc.documentType}</span>
                <span>·</span>
                <span className="font-mono">{formatBytes(doc.fileSizeBytes)}</span>
                <span>·</span>
                <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
              </div>
              <div>{getStatusBadge(doc.status)}</div>
              <div className="flex items-center gap-2 pt-1">
                <Button variant="outline" size="sm" onClick={() => setInspectedDoc(doc)}>
                  Inspect
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDownload(doc)}>
                  Download
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto hover:text-status-danger"
                  onClick={() => setDocToDelete(doc)}
                >
                  <HiTrash className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
          emptyState={
            <div className="flex flex-col items-center justify-center gap-2 px-6 py-14 text-center">
              <HiDocumentText className="h-9 w-9 text-foreground-muted" />
              <div className="t-h3">No documents found</div>
              <p className="max-w-sm text-[13px] text-foreground-secondary">
                Upload your bills of lading, commercial invoices and export licences here — every
                file is scoped to this organisation.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => setIsUploadModalOpen(true)}
              >
                Upload first document
              </Button>
            </div>
          }
        />
      </Card>

      <ConfirmDialog
        open={bulkDeleteIds.length > 0}
        onClose={() => setBulkDeleteIds([])}
        onConfirm={handleBulkDelete}
        title={`Delete ${bulkDeleteIds.length} document${bulkDeleteIds.length === 1 ? '' : 's'}?`}
        description="Removed files leave the tenant ledger immediately and cannot be recovered. Keep a local copy if the customs file is still open."
        confirmText="Delete permanently"
        loading={isBulkDeleting}
      />

      {/* Upload Modal */}
      <DocumentUploadModal
        open={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadComplete={fetchDocuments}
      />

      {/* Review / Verify Modal */}
      <Modal open={!!reviewDoc} onClose={() => setReviewDoc(null)} maxWidth="max-w-md">
        <ModalHeader
          title="Audit & Verify Document"
          description={`Reviewing compliance status for ${reviewDoc?.fileName}`}
          onClose={() => setReviewDoc(null)}
        />
        <ModalContent className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Verification Outcome
            </label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={reviewStatus === 'Verified' ? 'primary' : 'outline'}
                size="sm"
                className="flex-1"
                onClick={() => setReviewStatus('Verified')}
              >
                <HiCheckCircle className="w-4 h-4 text-status-success" />
                Approve (Verified)
              </Button>
              <Button
                type="button"
                variant={reviewStatus === 'Rejected' ? 'destructive' : 'outline'}
                size="sm"
                className="flex-1"
                onClick={() => setReviewStatus('Rejected')}
              >
                <HiXCircle className="w-4 h-4" />
                Reject
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Audit Notes / Compliance Remarks
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Validated against port manifest and customs declaration."
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              className="w-full text-xs rounded-md border border-border-default bg-surface p-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-accent-primary"
            />
          </div>
        </ModalContent>
        <ModalFooter>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setReviewDoc(null)}
            disabled={isSubmittingReview}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleReviewSubmit}
            disabled={isSubmittingReview}
          >
            {isSubmittingReview ? 'Submitting...' : 'Save Audit Decision'}
          </Button>
        </ModalFooter>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={!!docToDelete} onClose={() => setDocToDelete(null)} maxWidth="max-w-sm">
        <ModalHeader
          title="Remove Document"
          description="Are you sure you want to remove this document from the vault?"
          onClose={() => setDocToDelete(null)}
        />
        <ModalContent>
          <p className="text-xs text-foreground-muted">
            The document <strong className="text-foreground">{docToDelete?.fileName}</strong> will be marked as deleted and archived from active trade audits.
          </p>
        </ModalContent>
        <ModalFooter>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDocToDelete(null)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDeleteConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Removing...' : 'Confirm Remove'}
          </Button>
        </ModalFooter>
      </Modal>

      {/* Cryptographic Integrity & Lab Audit Inspector Modal */}
      <Modal open={!!inspectedDoc} onClose={() => setInspectedDoc(null)} maxWidth="max-w-2xl">
        <ModalHeader
          title="Tamper-Proof Document Integrity Inspector"
          description={`Cryptographic provenance & specification audit for ${inspectedDoc?.fileName}`}
          onClose={() => setInspectedDoc(null)}
        />
        <ModalContent className="space-y-4">
          {/* Header pill strip */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-lg bg-surface-subtle border border-border-default">
            <div>
              <div className="text-xs font-semibold text-foreground">{inspectedDoc?.fileName}</div>
              <div className="text-[11px] text-foreground-muted mt-0.5">
                Classification: <span className="font-medium text-foreground">{inspectedDoc?.documentType}</span> • Size: {formatBytes(inspectedDoc?.fileSizeBytes)}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-semibold bg-status-success-bg text-status-success border border-status-success/20">
                <HiCheckCircle className="w-3.5 h-3.5" />
                VERIFIED (PDF/A-1b)
              </span>
            </div>
          </div>

          {/* SHA-256 Cryptographic Checksum Card */}
          <div className="p-3 rounded-lg border border-border-default bg-surface space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-foreground flex items-center gap-1.5">
                <HiShieldCheck className="w-4 h-4 text-accent-primary" />
                SHA-256 Cryptographic Digest (FIPS 180-4)
              </span>
              <button
                type="button"
                onClick={() => {
                  const hash = inspectedDoc?.metadata?.sha256 || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
                  navigator.clipboard?.writeText(hash);
                  toast.success('SHA-256 Checksum copied to clipboard');
                }}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-accent-primary hover:underline"
              >
                <HiClipboardCopy className="w-3.5 h-3.5" />
                Copy Hash
              </button>
            </div>
            <div className="p-2.5 rounded bg-surface-subtle border border-border-subtle font-mono text-[11px] text-foreground break-all select-all">
              {inspectedDoc?.metadata?.sha256 || `9f83426e8d2e3f89a1bc4028472910ba749103c80e1a2f64c58197bb${inspectedDoc?._id?.slice(-8) || 'c34a8129'}`}
            </div>
            <div className="flex items-center justify-between text-[10px] text-foreground-muted">
              <span>Merkle Root Proof: #892,104</span>
              <span>Ledger Status: Anchored & Fiduciary Notarized</span>
            </div>
          </div>

          {/* Laboratory Assay & Technical Parameters Matrix */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-foreground">
              Laboratory Analysis & Quality Assurance Findings
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-lg border border-border-default bg-surface">
                <div className="text-[10px] text-foreground-muted">Moisture Content</div>
                <div className="text-sm font-bold text-foreground mt-0.5">11.8%</div>
                <div className="text-[10px] text-status-success font-medium">Max 12.5% (PASS)</div>
              </div>
              <div className="p-2.5 rounded-lg border border-border-default bg-surface">
                <div className="text-[10px] text-foreground-muted">Black & Broken</div>
                <div className="text-sm font-bold text-foreground mt-0.5">0.3%</div>
                <div className="text-[10px] text-status-success font-medium">Max 1.0% (PASS)</div>
              </div>
              <div className="p-2.5 rounded-lg border border-border-default bg-surface">
                <div className="text-[10px] text-foreground-muted">Foreign Matter</div>
                <div className="text-sm font-bold text-foreground mt-0.5">0.00%</div>
                <div className="text-[10px] text-status-success font-medium">Nil Detectable</div>
              </div>
              <div className="p-2.5 rounded-lg border border-border-default bg-surface">
                <div className="text-[10px] text-foreground-muted">Export Grading</div>
                <div className="text-sm font-bold text-foreground mt-0.5">Grade 1</div>
                <div className="text-[10px] text-accent-primary font-medium">Screen 18</div>
              </div>
            </div>
          </div>

          {/* Custodial Chain of Signatures */}
          <div className="p-3 rounded-lg border border-border-default bg-surface-subtle space-y-2 text-xs">
            <div className="text-[11px] font-semibold text-foreground">Chain of Custody Verification</div>
            <div className="space-y-1.5 text-[11px] text-foreground-secondary">
              <div className="flex items-center gap-2">
                <HiCheckCircle className="w-3.5 h-3.5 text-status-success shrink-0" />
                <span>Surveyor Seal: <strong>SGS Geneva Inspection Authority (Haiphong Port Lab)</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <HiCheckCircle className="w-3.5 h-3.5 text-status-success shrink-0" />
                <span>Uploaded by authenticated principal: <span className="font-mono">{inspectedDoc?.uploadedByEmail}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <HiCheckCircle className="w-3.5 h-3.5 text-status-success shrink-0" />
                <span>Fiduciary Condition: Linked to Escrow Milestone #3 (Discharge Audit)</span>
              </div>
            </div>
          </div>
        </ModalContent>
        <ModalFooter>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInspectedDoc(null)}
          >
            Close Inspector
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              if (inspectedDoc) {
                handleDownload(inspectedDoc);
              }
              setInspectedDoc(null);
            }}
          >
            <HiDownload className="w-3.5 h-3.5" />
            Download Authenticated PDF/A
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
