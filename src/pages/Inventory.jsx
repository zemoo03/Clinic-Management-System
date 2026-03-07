import { useState } from 'react';
import { Package, Plus, Search, Edit3, Trash2, AlertTriangle, TrendingDown, X, BarChart3, Pill } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import SearchBar from '../components/SearchBar';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import StatCard from '../components/StatCard';
import { showToast } from '../components/Toast';
import useLocalStorage from '../hooks/useLocalStorage';

const DEMO_INVENTORY = [
    { id: 'MED001', name: 'Paracetamol 500mg', category: 'Tablet', stock: 240, price: 12, costPrice: 8, manufacturer: 'Cipla', expiry: '2025-12', batchNo: 'B2024-001', minStock: 50 },
    { id: 'MED002', name: 'Amoxicillin 250mg', category: 'Capsule', stock: 180, price: 35, costPrice: 22, manufacturer: 'Sun Pharma', expiry: '2025-08', batchNo: 'B2024-002', minStock: 30 },
    { id: 'MED003', name: 'Azithromycin 500mg', category: 'Tablet', stock: 12, price: 65, costPrice: 42, manufacturer: 'Zydus', expiry: '2025-06', batchNo: 'B2024-003', minStock: 20 },
    { id: 'MED004', name: 'Metformin 500mg', category: 'Tablet', stock: 8, price: 18, costPrice: 10, manufacturer: 'Dr. Reddy\'s', expiry: '2025-10', batchNo: 'B2024-004', minStock: 40 },
    { id: 'MED005', name: 'Cetirizine 10mg', category: 'Tablet', stock: 300, price: 8, costPrice: 4, manufacturer: 'Cipla', expiry: '2026-03', batchNo: 'B2024-005', minStock: 50 },
    { id: 'MED006', name: 'Omeprazole 20mg', category: 'Capsule', stock: 150, price: 22, costPrice: 14, manufacturer: 'Lupin', expiry: '2025-09', batchNo: 'B2024-006', minStock: 30 },
    { id: 'MED007', name: 'Cough Syrup (100ml)', category: 'Syrup', stock: 45, price: 85, costPrice: 55, manufacturer: 'Dabur', expiry: '2025-07', batchNo: 'B2024-007', minStock: 20 },
    { id: 'MED008', name: 'Betadine Ointment', category: 'Ointment', stock: 60, price: 45, costPrice: 28, manufacturer: 'Win Medicare', expiry: '2026-01', batchNo: 'B2024-008', minStock: 15 },
    { id: 'MED009', name: 'ORS Sachets', category: 'Sachet', stock: 200, price: 5, costPrice: 2, manufacturer: 'FDC', expiry: '2026-06', batchNo: 'B2024-009', minStock: 100 },
    { id: 'MED010', name: 'Dolo 650mg', category: 'Tablet', stock: 4, price: 15, costPrice: 9, manufacturer: 'Micro Labs', expiry: '2025-11', batchNo: 'B2024-010', minStock: 50 },
];

const Inventory = () => {
    const [inventory, setInventory] = useLocalStorage('store_inventory', DEMO_INVENTORY);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingMed, setEditingMed] = useState(null);
    const [newMed, setNewMed] = useState({
        name: '', category: 'Tablet', stock: '', price: '', costPrice: '', manufacturer: '', expiry: '', batchNo: '', minStock: 20
    });

    const categories = ['All', 'Tablet', 'Capsule', 'Syrup', 'Ointment', 'Injection', 'Sachet', 'Drops', 'Other'];

    const filtered = inventory.filter(med => {
        const matchesSearch = med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            med.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            med.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'All' || med.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const totalStock = inventory.reduce((sum, m) => sum + m.stock, 0);
    const lowStockItems = inventory.filter(m => m.stock <= m.minStock);
    const totalValue = inventory.reduce((sum, m) => sum + (m.stock * m.costPrice), 0);

    const handleAdd = (e) => {
        e.preventDefault();
        const med = {
            ...newMed,
            id: `MED${String(inventory.length + 1).padStart(3, '0')}`,
            stock: Number(newMed.stock),
            price: Number(newMed.price),
            costPrice: Number(newMed.costPrice),
            minStock: Number(newMed.minStock),
        };
        setInventory([med, ...inventory]);
        showToast(`${med.name} added to inventory`, 'success');
        setIsAddOpen(false);
        setNewMed({ name: '', category: 'Tablet', stock: '', price: '', costPrice: '', manufacturer: '', expiry: '', batchNo: '', minStock: 20 });
    };

    const handleDelete = (id, name) => {
        if (window.confirm(`Remove ${name} from inventory?`)) {
            setInventory(inventory.filter(m => m.id !== id));
            showToast(`${name} removed`, 'info');
        }
    };

    const handleUpdateStock = (id, newStock) => {
        setInventory(inventory.map(m => m.id === id ? { ...m, stock: Math.max(0, Number(newStock)) } : m));
    };

    return (
        <div className="animate-fade-in">
            <PageHeader title="Medicine Inventory" subtitle={`${inventory.length} medicines in stock`}>
                <button className="primary-btn-sm" onClick={() => setIsAddOpen(true)}>
                    <Plus size={15} /> Add Medicine
                </button>
            </PageHeader>

            <div className="stats-grid">
                <StatCard icon={Package} label="Total Stock" value={totalStock.toLocaleString()} variant="luxury" />
                <StatCard icon={Pill} label="Unique Medicines" value={inventory.length} />
                <StatCard icon={AlertTriangle} label="Low Stock" value={lowStockItems.length} />
                <StatCard icon={BarChart3} label="Inventory Value" value={`₹${totalValue.toLocaleString()}`} />
            </div>

            {/* Low Stock Alert */}
            {lowStockItems.length > 0 && (
                <div className="glass p-4 rounded-xl mb-6" style={{ borderLeft: '4px solid var(--amber)' }}>
                    <p className="font-bold text-sm flex items-center gap-2 mb-2">
                        <AlertTriangle size={16} style={{ color: 'var(--amber)' }} /> Low Stock Alert
                    </p>
                    <div className="flex gap-2 flex-wrap">
                        {lowStockItems.map(m => (
                            <span key={m.id} className="tag" style={{ background: 'var(--amber-light)', color: '#92400e' }}>
                                {m.name} ({m.stock} left)
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex gap-3 items-center mb-4">
                <div style={{ flex: 1 }}>
                    <SearchBar
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder="Search by medicine name, manufacturer, or ID..."
                    />
                </div>
                <select
                    className="secondary-btn"
                    value={filterCategory}
                    onChange={e => setFilterCategory(e.target.value)}
                    style={{ minWidth: 130 }}
                >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            <div className="data-table">
                <table>
                    <thead>
                        <tr>
                            <th>Medicine</th>
                            <th>Category</th>
                            <th>Stock</th>
                            <th>MRP (₹)</th>
                            <th>Manufacturer</th>
                            <th>Expiry</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan="8">
                                    <EmptyState
                                        icon={Package}
                                        title="No medicines found"
                                        subtitle="Add medicines to your inventory or adjust filters"
                                    />
                                </td>
                            </tr>
                        ) : (
                            filtered.map(med => {
                                const isLow = med.stock <= med.minStock;
                                const isOut = med.stock === 0;
                                return (
                                    <tr key={med.id}>
                                        <td>
                                            <div>
                                                <p className="font-bold" style={{ fontSize: '0.9rem' }}>{med.name}</p>
                                                <p style={{ fontSize: '0.75rem', color: 'var(--text-faint)' }}>{med.id} • Batch: {med.batchNo}</p>
                                            </div>
                                        </td>
                                        <td><span className="tag">{med.category}</span></td>
                                        <td>
                                            <span className={`font-extrabold ${isOut ? 'text-accent' : isLow ? '' : 'text-emerald'}`}
                                                style={isLow && !isOut ? { color: '#92400e' } : {}}>
                                                {med.stock}
                                            </span>
                                        </td>
                                        <td className="font-bold">₹{med.price}</td>
                                        <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{med.manufacturer}</td>
                                        <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{med.expiry}</td>
                                        <td>
                                            {isOut ? (
                                                <span className="status-badge" style={{ background: 'var(--accent-light)', color: '#9f1239' }}>Out of Stock</span>
                                            ) : isLow ? (
                                                <span className="status-badge status-waiting">Low Stock</span>
                                            ) : (
                                                <span className="status-badge status-active">In Stock</span>
                                            )}
                                        </td>
                                        <td>
                                            <div className="flex gap-1">
                                                <button className="icon-btn primary" title="Edit" style={{ width: 32, height: 32 }}>
                                                    <Edit3 size={14} />
                                                </button>
                                                <button className="icon-btn danger" title="Delete" style={{ width: 32, height: 32 }}
                                                    onClick={() => handleDelete(med.id, med.name)}>
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add Medicine Modal */}
            <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add Medicine to Inventory" size="lg">
                <form onSubmit={handleAdd}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Medicine Name</label>
                            <input required type="text" placeholder="e.g. Paracetamol 500mg" value={newMed.name}
                                onChange={e => setNewMed({ ...newMed, name: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Category</label>
                            <select value={newMed.category} onChange={e => setNewMed({ ...newMed, category: e.target.value })}>
                                {categories.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Manufacturer</label>
                            <input required type="text" placeholder="e.g. Cipla" value={newMed.manufacturer}
                                onChange={e => setNewMed({ ...newMed, manufacturer: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Batch Number</label>
                            <input type="text" placeholder="e.g. B2024-011" value={newMed.batchNo}
                                onChange={e => setNewMed({ ...newMed, batchNo: e.target.value })} />
                        </div>
                    </div>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Stock Quantity</label>
                            <input required type="number" min="0" placeholder="0" value={newMed.stock}
                                onChange={e => setNewMed({ ...newMed, stock: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Minimum Stock Alert</label>
                            <input type="number" min="0" placeholder="20" value={newMed.minStock}
                                onChange={e => setNewMed({ ...newMed, minStock: e.target.value })} />
                        </div>
                    </div>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>MRP (₹)</label>
                            <input required type="number" min="0" step="0.01" placeholder="0.00" value={newMed.price}
                                onChange={e => setNewMed({ ...newMed, price: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Cost Price (₹)</label>
                            <input type="number" min="0" step="0.01" placeholder="0.00" value={newMed.costPrice}
                                onChange={e => setNewMed({ ...newMed, costPrice: e.target.value })} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Expiry Date</label>
                        <input type="month" value={newMed.expiry}
                            onChange={e => setNewMed({ ...newMed, expiry: e.target.value })} />
                    </div>
                    <button type="submit" className="primary-btn mt-4">
                        <Package size={16} /> Add to Inventory
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default Inventory;
