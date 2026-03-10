import { useState, useRef, useCallback } from 'react';
import {
    Camera, Upload, FileText, Image, X, Search, Trash2, Eye,
    FolderOpen, Tag, Calendar, User, Download, ZoomIn, Filter,
    Plus, ScanLine, File, ChevronDown
} from 'lucide-react';
import usePatients from '../hooks/usePatients';
import useLocalStorage from '../hooks/useLocalStorage';
import PageHeader from '../components/PageHeader';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import { showToast } from '../components/Toast';

const DOC_TYPES = [
    { key: 'lab_report', label: 'Lab Report', icon: '🧪', color: '#4f46e5' },
    { key: 'prescription', label: 'Old Prescription', icon: '📝', color: '#0ea5e9' },
    { key: 'xray', label: 'X-Ray / Scan', icon: '🩻', color: '#f59e0b' },
    { key: 'discharge', label: 'Discharge Summary', icon: '🏥', color: '#10b981' },
    { key: 'insurance', label: 'Insurance Document', icon: '🛡️', color: '#8b5cf6' },
    { key: 'other', label: 'Other Document', icon: '📄', color: '#64748b' },
];

const DEMO_DOCUMENTS = [
    {
        id: 'DOC001',
        patientId: 'PAT001',
        patientName: 'Rahul Verma',
        type: 'lab_report',
        title: 'CBC Report - Feb 2024',
        date: '2024-02-15',
        notes: 'All values within normal range. Slight elevation in WBC.',
        thumbnail: null, // Would be base64 in real app
        fileName: 'CBC_Report_Feb2024.pdf',
    },
    {
        id: 'DOC002',
        patientId: 'PAT003',
        patientName: 'Amit Singh',
        type: 'xray',
        title: 'Chest X-Ray - Jan 2024',
        date: '2024-01-20',
        notes: 'No significant findings.',
        thumbnail: null,
        fileName: 'ChestXRay_Jan2024.jpg',
    },
    {
        id: 'DOC003',
        patientId: 'PAT002',
        patientName: 'Sita Rani',
        type: 'prescription',
        title: 'Old Prescription from Apollo Hospital',
        date: '2024-01-10',
        notes: 'Previous doctor had prescribed Augmentin — patient allergic to Penicillin',
        thumbnail: null,
        fileName: 'OldPrescription_Apollo.jpg',
    },
    {
        id: 'DOC004',
        patientId: 'PAT004',
        patientName: 'Priya Desai',
        type: 'lab_report',
        title: 'Pulmonary Function Test',
        date: '2024-02-19',
        notes: 'FEV1 reduced. Consistent with asthma diagnosis.',
        thumbnail: null,
        fileName: 'PFT_Report.pdf',
    },
];

const DocumentScanner = () => {
    const { patients } = usePatients();
    const [documents, setDocuments] = useLocalStorage('scanned_docs', DEMO_DOCUMENTS);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterPatient, setFilterPatient] = useState('all');
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [viewDoc, setViewDoc] = useState(null);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);

    const [uploadForm, setUploadForm] = useState({
        patientId: '',
        type: 'lab_report',
        title: '',
        notes: '',
        file: null,
        fileName: '',
        filePreview: null,
    });

    const filtered = documents.filter(doc => {
        const matchSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.patientName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchType = filterType === 'all' || doc.type === filterType;
        const matchPatient = filterPatient === 'all' || doc.patientId === filterPatient;
        return matchSearch && matchType && matchPatient;
    });

    // Group by patient for overview
    const patientDocCounts = {};
    documents.forEach(d => {
        patientDocCounts[d.patientId] = (patientDocCounts[d.patientId] || 0) + 1;
    });

    const getDocTypeInfo = (type) => DOC_TYPES.find(d => d.key === type) || DOC_TYPES[5];

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (ev) => {
            setUploadForm(prev => ({
                ...prev,
                file: ev.target.result,
                fileName: file.name,
                filePreview: file.type.startsWith('image/') ? ev.target.result : null,
            }));
        };
        reader.readAsDataURL(file);
    };

    const handleCameraCapture = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (ev) => {
            setUploadForm(prev => ({
                ...prev,
                file: ev.target.result,
                fileName: `Scan_${new Date().toISOString().slice(0, 10)}.jpg`,
                filePreview: ev.target.result,
            }));
        };
        reader.readAsDataURL(file);
    };

    const handleUpload = (e) => {
        e.preventDefault();
        const patient = patients.find(p => p.id === uploadForm.patientId);
        if (!patient) {
            showToast('Please select a patient', 'error');
            return;
        }

        const newDoc = {
            id: `DOC${String(Date.now()).slice(-6)}`,
            patientId: uploadForm.patientId,
            patientName: patient.name,
            type: uploadForm.type,
            title: uploadForm.title || `${getDocTypeInfo(uploadForm.type).label} — ${new Date().toLocaleDateString('en-IN')}`,
            date: new Date().toISOString().split('T')[0],
            notes: uploadForm.notes,
            thumbnail: uploadForm.filePreview,
            fileName: uploadForm.fileName,
            fileData: uploadForm.file, // Base64 stored in localStorage
        };

        setDocuments(prev => [newDoc, ...prev]);
        showToast(`Document filed for ${patient.name}`, 'success');
        setIsUploadOpen(false);
        setUploadForm({ patientId: '', type: 'lab_report', title: '', notes: '', file: null, fileName: '', filePreview: null });
    };

    const handleDelete = (docId) => {
        if (window.confirm('Remove this document?')) {
            setDocuments(prev => prev.filter(d => d.id !== docId));
            showToast('Document removed', 'info');
            if (viewDoc?.id === docId) setViewDoc(null);
        }
    };

    return (
        <div className="animate-fade-in">
            <PageHeader title="Document Scanner & Filing" subtitle="Scan, upload, and organize patient documents digitally">
                <button className="primary-btn-sm" onClick={() => setIsUploadOpen(true)}>
                    <Plus size={15} /> Upload / Scan
                </button>
            </PageHeader>

            {/* Stats */}
            <div className="stats-grid">
                <div className="stat-card glass" style={{ cursor: 'default' }}>
                    <div className="icon-circle"><FolderOpen size={20} /></div>
                    <div className="stat-info">
                        <span className="label">Total Documents</span>
                        <span className="value">{documents.length}</span>
                    </div>
                </div>
                {DOC_TYPES.slice(0, 3).map(dt => (
                    <div key={dt.key} className="stat-card glass" style={{ cursor: 'pointer' }} onClick={() => setFilterType(dt.key)}>
                        <div className="icon-circle" style={{ background: `${dt.color}15`, color: dt.color }}>
                            <span style={{ fontSize: '1.2rem' }}>{dt.icon}</span>
                        </div>
                        <div className="stat-info">
                            <span className="label">{dt.label}s</span>
                            <span className="value">{documents.filter(d => d.type === dt.key).length}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex gap-3 mb-4 flex-wrap">
                <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search documents..." />
                <div className="flex gap-2" style={{ flexShrink: 0 }}>
                    <select className="secondary-btn" value={filterType} onChange={e => setFilterType(e.target.value)}>
                        <option value="all">All Types</option>
                        {DOC_TYPES.map(dt => (
                            <option key={dt.key} value={dt.key}>{dt.icon} {dt.label}</option>
                        ))}
                    </select>
                    <select className="secondary-btn" value={filterPatient} onChange={e => setFilterPatient(e.target.value)}>
                        <option value="all">All Patients</option>
                        {patients.map(p => (
                            <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Documents Grid */}
            {filtered.length === 0 ? (
                <EmptyState
                    icon={ScanLine}
                    title="No documents found"
                    subtitle="Upload or scan patient documents to organize them digitally"
                    action={
                        <button className="primary-btn-sm" onClick={() => setIsUploadOpen(true)}>
                            <Camera size={14} /> Scan First Document
                        </button>
                    }
                />
            ) : (
                <div className="doc-grid stagger-children">
                    {filtered.map(doc => {
                        const typeInfo = getDocTypeInfo(doc.type);
                        return (
                            <div key={doc.id} className="doc-card glass" onClick={() => setViewDoc(doc)}>
                                <div className="doc-card-thumb" style={{ background: `${typeInfo.color}10` }}>
                                    {doc.thumbnail ? (
                                        <img src={doc.thumbnail} alt={doc.title} />
                                    ) : (
                                        <span className="doc-type-icon">{typeInfo.icon}</span>
                                    )}
                                    <span className="doc-type-badge" style={{ background: typeInfo.color }}>
                                        {typeInfo.label}
                                    </span>
                                </div>
                                <div className="doc-card-body">
                                    <h4 className="font-bold text-sm">{doc.title}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs text-muted flex items-center gap-1">
                                            <User size={11} /> {doc.patientName}
                                        </span>
                                        <span className="text-xs text-muted flex items-center gap-1">
                                            <Calendar size={11} /> {doc.date}
                                        </span>
                                    </div>
                                    {doc.notes && (
                                        <p className="text-xs text-muted mt-1" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {doc.notes}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Upload / Scan Modal */}
            <Modal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} title="Upload or Scan Document" size="lg">
                <form onSubmit={handleUpload}>
                    {/* Capture Buttons */}
                    <div className="flex gap-3 mb-4">
                        <button
                            type="button"
                            className="scanner-capture-btn"
                            onClick={() => cameraInputRef.current?.click()}
                        >
                            <Camera size={24} />
                            <span>Camera Scan</span>
                        </button>
                        <button
                            type="button"
                            className="scanner-capture-btn"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload size={24} />
                            <span>Upload File</span>
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*,.pdf,.doc,.docx"
                            onChange={handleFileSelect}
                            style={{ display: 'none' }}
                        />
                        <input
                            ref={cameraInputRef}
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={handleCameraCapture}
                            style={{ display: 'none' }}
                        />
                    </div>

                    {/* File Preview */}
                    {uploadForm.filePreview && (
                        <div className="scanner-preview mb-4">
                            <img src={uploadForm.filePreview} alt="Preview" />
                            <button type="button" className="preview-remove" onClick={() => setUploadForm(prev => ({ ...prev, file: null, fileName: '', filePreview: null }))}>
                                <X size={14} />
                            </button>
                        </div>
                    )}

                    {uploadForm.fileName && !uploadForm.filePreview && (
                        <div className="p-3 bg-background rounded-lg mb-4 flex items-center gap-2">
                            <File size={18} className="text-primary" />
                            <span className="text-sm font-bold">{uploadForm.fileName}</span>
                            <button type="button" className="icon-btn danger" style={{ marginLeft: 'auto', width: 28, height: 28 }} onClick={() => setUploadForm(prev => ({ ...prev, file: null, fileName: '', filePreview: null }))}>
                                <X size={12} />
                            </button>
                        </div>
                    )}

                    {/* Form Fields */}
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Patient *</label>
                            <select required value={uploadForm.patientId} onChange={e => setUploadForm(prev => ({ ...prev, patientId: e.target.value }))}>
                                <option value="">Select Patient</option>
                                {patients.map(p => (
                                    <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Document Type *</label>
                            <select value={uploadForm.type} onChange={e => setUploadForm(prev => ({ ...prev, type: e.target.value }))}>
                                {DOC_TYPES.map(dt => (
                                    <option key={dt.key} value={dt.key}>{dt.icon} {dt.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Document Title</label>
                        <input
                            type="text"
                            placeholder="e.g. CBC Report — March 2024"
                            value={uploadForm.title}
                            onChange={e => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                        />
                    </div>

                    <div className="form-group">
                        <label>Notes (Optional)</label>
                        <textarea
                            rows="2"
                            placeholder="Any important observations or context..."
                            value={uploadForm.notes}
                            onChange={e => setUploadForm(prev => ({ ...prev, notes: e.target.value }))}
                        />
                    </div>

                    <button type="submit" className="primary-btn">
                        <ScanLine size={16} /> File Document
                    </button>
                </form>
            </Modal>

            {/* View Document Modal */}
            <Modal isOpen={!!viewDoc} onClose={() => setViewDoc(null)} title={viewDoc?.title || 'Document'} size="lg">
                {viewDoc && (() => {
                    const typeInfo = getDocTypeInfo(viewDoc.type);
                    return (
                        <div>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="doc-type-avatar" style={{ background: `${typeInfo.color}15`, color: typeInfo.color }}>
                                    <span style={{ fontSize: '1.5rem' }}>{typeInfo.icon}</span>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 className="font-bold text-lg">{viewDoc.title}</h3>
                                    <p className="text-sm text-muted">{typeInfo.label} • {viewDoc.fileName}</p>
                                </div>
                            </div>

                            <div className="grid-cols-2 mb-4">
                                <div className="p-3 bg-background rounded-lg">
                                    <p className="text-xs text-muted font-semibold mb-1">PATIENT</p>
                                    <p className="font-bold flex items-center gap-2"><User size={14} /> {viewDoc.patientName}</p>
                                </div>
                                <div className="p-3 bg-background rounded-lg">
                                    <p className="text-xs text-muted font-semibold mb-1">DATE</p>
                                    <p className="font-bold flex items-center gap-2"><Calendar size={14} /> {viewDoc.date}</p>
                                </div>
                            </div>

                            {viewDoc.thumbnail && (
                                <div className="scanner-preview mb-4" style={{ maxHeight: 300 }}>
                                    <img src={viewDoc.thumbnail} alt={viewDoc.title} />
                                </div>
                            )}

                            {viewDoc.notes && (
                                <div className="p-3 bg-background rounded-lg mb-4" style={{ borderLeft: `3px solid ${typeInfo.color}` }}>
                                    <p className="text-xs text-muted font-semibold mb-1">NOTES</p>
                                    <p className="text-sm">{viewDoc.notes}</p>
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button className="secondary-btn flex-1" onClick={() => handleDelete(viewDoc.id)}>
                                    <Trash2 size={14} /> Delete
                                </button>
                                <button className="primary-btn flex-1" onClick={() => showToast('Download feature coming soon', 'info')}>
                                    <Download size={16} /> Download
                                </button>
                            </div>
                        </div>
                    );
                })()}
            </Modal>
        </div>
    );
};

export default DocumentScanner;
