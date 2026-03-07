import { useState } from 'react';
import { Search, Plus, User, Phone, Calendar, ArrowRight, X, Edit3, Trash2, MapPin, Heart } from 'lucide-react';
import usePatients from '../hooks/usePatients';
import Modal from '../components/Modal';
import PageHeader from '../components/PageHeader';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';
import { showToast } from '../components/Toast';

const Patients = () => {
    const {
        filteredPatients,
        searchTerm,
        setSearchTerm,
        addPatient,
        deletePatient,
        totalPatients
    } = usePatients();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [newPatient, setNewPatient] = useState({
        name: '', age: '', gender: 'Male', mobile: '', address: '', history: ''
    });

    const handleAddPatient = (e) => {
        e.preventDefault();
        const patient = addPatient(newPatient);
        showToast(`${patient.name} registered successfully!`, 'success');
        setIsModalOpen(false);
        setNewPatient({ name: '', age: '', gender: 'Male', mobile: '', address: '', history: '' });
    };

    const handleDelete = (id, name) => {
        if (window.confirm(`Remove ${name} from records?`)) {
            deletePatient(id);
            showToast(`${name} removed from records`, 'info');
            if (selectedPatient?.id === id) setSelectedPatient(null);
        }
    };

    return (
        <div className="animate-fade-in">
            <PageHeader title="Patient Directory" subtitle={`${totalPatients} registered patients`}>
                <button className="primary-btn-sm" onClick={() => setIsModalOpen(true)}>
                    <Plus size={16} />
                    <span>New Patient</span>
                </button>
            </PageHeader>

            <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search by name, ID or mobile number..."
            />

            {filteredPatients.length === 0 ? (
                <EmptyState
                    icon={User}
                    title="No patients found"
                    subtitle={searchTerm ? "Try a different search term" : "Register your first patient to get started"}
                    action={
                        !searchTerm && (
                            <button className="primary-btn-sm" onClick={() => setIsModalOpen(true)}>
                                <Plus size={16} /> Add First Patient
                            </button>
                        )
                    }
                />
            ) : (
                <div className="patient-grid stagger-children">
                    {filteredPatients.map(patient => (
                        <div
                            key={patient.id}
                            className="patient-card glass"
                            onClick={() => setSelectedPatient(patient)}
                        >
                            <div className="patient-avatar">
                                {patient.name.charAt(0)}
                            </div>
                            <div className="patient-info">
                                <h3>{patient.name}</h3>
                                <span className="patient-id">{patient.id}</span>
                                <div className="details">
                                    <span><User size={13} /> {patient.age}y, {patient.gender}</span>
                                    <span><Phone size={13} /> {patient.mobile}</span>
                                    {patient.lastVisit && (
                                        <span><Calendar size={13} /> Last: {patient.lastVisit}</span>
                                    )}
                                </div>
                            </div>
                            <button className="view-btn" title="View details">
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* — Add Patient Modal — */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register New Patient">
                <form onSubmit={handleAddPatient}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                required
                                type="text"
                                placeholder="Enter patient name"
                                value={newPatient.name}
                                onChange={e => setNewPatient({ ...newPatient, name: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Mobile Number</label>
                            <input
                                required
                                type="tel"
                                placeholder="+91 XXXXX XXXXX"
                                value={newPatient.mobile}
                                onChange={e => setNewPatient({ ...newPatient, mobile: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Age</label>
                            <input
                                required
                                type="number"
                                placeholder="Age in years"
                                min="0"
                                max="120"
                                value={newPatient.age}
                                onChange={e => setNewPatient({ ...newPatient, age: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Gender</label>
                            <select value={newPatient.gender} onChange={e => setNewPatient({ ...newPatient, gender: e.target.value })}>
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Address</label>
                        <input
                            type="text"
                            placeholder="Street, City"
                            value={newPatient.address}
                            onChange={e => setNewPatient({ ...newPatient, address: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Medical History / Allergies</label>
                        <textarea
                            rows="3"
                            placeholder="Known conditions, allergies, or ongoing treatments..."
                            value={newPatient.history}
                            onChange={e => setNewPatient({ ...newPatient, history: e.target.value })}
                        ></textarea>
                    </div>
                    <button type="submit" className="primary-btn mt-4">
                        <Heart size={16} /> Save Patient Record
                    </button>
                </form>
            </Modal>

            {/* — Patient Detail Modal — */}
            <Modal
                isOpen={!!selectedPatient}
                onClose={() => setSelectedPatient(null)}
                title="Patient Details"
            >
                {selectedPatient && (
                    <div>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="patient-avatar" style={{ width: 56, height: 56, fontSize: '1.4rem' }}>
                                {selectedPatient.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">{selectedPatient.name}</h3>
                                <span className="text-muted text-sm">{selectedPatient.id}</span>
                            </div>
                        </div>

                        <div className="grid-cols-2 mb-4">
                            <div className="p-3 bg-background rounded-lg">
                                <p className="text-xs text-muted font-semibold mb-1">AGE & GENDER</p>
                                <p className="font-bold">{selectedPatient.age}y, {selectedPatient.gender}</p>
                            </div>
                            <div className="p-3 bg-background rounded-lg">
                                <p className="text-xs text-muted font-semibold mb-1">MOBILE</p>
                                <p className="font-bold">{selectedPatient.mobile}</p>
                            </div>
                        </div>

                        {selectedPatient.address && (
                            <div className="p-3 bg-background rounded-lg mb-4">
                                <p className="text-xs text-muted font-semibold mb-1">ADDRESS</p>
                                <p className="font-medium flex items-center gap-2">
                                    <MapPin size={14} /> {selectedPatient.address}
                                </p>
                            </div>
                        )}

                        {selectedPatient.history && (
                            <div className="p-3 bg-background rounded-lg mb-4">
                                <p className="text-xs text-muted font-semibold mb-1">MEDICAL HISTORY</p>
                                <p className="font-medium">{selectedPatient.history}</p>
                            </div>
                        )}

                        <div className="p-3 bg-background rounded-lg mb-6">
                            <p className="text-xs text-muted font-semibold mb-1">LAST VISIT</p>
                            <p className="font-bold">{selectedPatient.lastVisit || 'N/A'}</p>
                        </div>

                        <div className="flex gap-3">
                            <button className="secondary-btn flex-1" onClick={() => setSelectedPatient(null)}>
                                <Edit3 size={14} /> Edit Record
                            </button>
                            <button
                                className="icon-btn danger"
                                onClick={() => handleDelete(selectedPatient.id, selectedPatient.name)}
                                title="Delete"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Patients;
