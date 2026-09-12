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
} from 'react-icons/hi';
import api from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Modal, ModalHeader, ModalContent, ModalFooter } from '../components/ui/Modal';
import DocumentUploadModal from '../components/DocumentUploadModal';

export default function DocumentVaultPage() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

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
      toast.error('Failed to retrieve vault documents');
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
        <CardContent className="p-4">
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
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-subtle border-b border-border-default text-foreground-muted uppercase tracking-wider font-semibold text-[10px]">
              <tr>
                <th className="py-3 px-4">Document Details</th>
                <th className="py-3 px-4">Classification</th>
                <th className="py-3 px-4">Size</th>
                <th className="py-3 px-4">Audit Status</th>
                <th className="py-3 px-4">Uploader / Timestamp</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-foreground-muted">
                    Loading vault registry...
                  </td>
                </tr>
              ) : filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <HiDocumentText className="w-10 h-10 text-foreground-muted" />
                      <div className="text-sm font-semibold text-foreground">No documents found</div>
                      <div className="text-xs text-foreground-muted">
                        Upload your bills of lading, commercial invoices, and export licenses here.
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => setIsUploadModalOpen(true)}
                      >
                        Upload First Document
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => (
                  <tr key={doc._id} className="hover:bg-surface-hover/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-foreground truncate max-w-xs">{doc.fileName}</div>
                      {doc.metadata?.customsReference && (
                        <div className="text-[11px] text-foreground-muted">
                          Ref: <span className="font-mono">{doc.metadata.customsReference}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-foreground">{doc.documentType}</span>
                    </td>
                    <td className="py-3 px-4 text-foreground-muted">
                      {formatBytes(doc.fileSizeBytes)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <div>{getStatusBadge(doc.status)}</div>
                        {doc.verificationNotes && (
                          <div className="text-[10px] text-foreground-muted italic max-w-xs truncate">
                            Note: {doc.verificationNotes}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-foreground-muted">
                      <div className="truncate max-w-[160px]">{doc.uploadedByEmail}</div>
                      <div className="text-[10px]">{new Date(doc.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(doc)}
                          title="Download Document"
                          disabled={doc.status === 'PendingUpload'}
                        >
                          <HiDownload className="w-3.5 h-3.5" />
                        </Button>

                        {/* Verify / Reject action (visible to admin or demo-admin) */}
                        {(user?.isAdmin || user?.userType === 'demo-admin') && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setReviewDoc(doc);
                              setReviewStatus('Verified');
                              setReviewNotes('');
                            }}
                            title="Review Compliance"
                          >
                            <HiShieldCheck className="w-3.5 h-3.5 text-accent-primary" />
                          </Button>
                        )}

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDocToDelete(doc)}
                          title="Delete Document"
                          className="hover:text-status-danger"
                        >
                          <HiTrash className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

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
    </div>
  );
}
