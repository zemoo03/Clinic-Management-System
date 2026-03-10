import { useState } from 'react';
import {
    Apple, Baby, Heart, AlertTriangle, Copy, Download, Printer,
    ChevronDown, ChevronUp, Search, BookOpen, Utensils, Ban, CheckCircle2,
    Thermometer, Droplets, Moon
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import SearchBar from '../components/SearchBar';
import Modal from '../components/Modal';
import { showToast } from '../components/Toast';

const DIET_TEMPLATES = [
    {
        id: 'dt001',
        ageGroup: 'Infant (0-6 months)',
        ageRange: '0-6m',
        icon: '👶',
        color: '#ec4899',
        recommended: [
            { item: 'Breast milk (exclusive)', details: 'On demand, 8-12 times/day', priority: 'essential' },
            { item: 'Formula milk (if needed)', details: 'As per pediatrician advice', priority: 'optional' },
        ],
        avoid: [
            { item: 'Honey', reason: 'Risk of infant botulism' },
            { item: 'Cow\'s milk', reason: 'Not suitable for infants under 1 year' },
            { item: 'Solid foods', reason: 'Digestive system not ready' },
            { item: 'Sugar / Salt', reason: 'Kidneys too immature to process' },
            { item: 'Fruit juices', reason: 'No nutritional benefit for infants' },
        ],
        homecare: [
            { tip: 'Burp the baby after every feed', icon: '🍼' },
            { tip: 'Keep the baby upright 15-20 min after feeding', icon: '👶' },
            { tip: 'Watch for signs of dehydration: dry diapers, sunken fontanelle', icon: '💧' },
            { tip: 'Maintain room temperature 26-28°C', icon: '🌡️' },
            { tip: 'Use cotton clothing, avoid synthetic fabrics', icon: '👕' },
        ],
    },
    {
        id: 'dt002',
        ageGroup: 'Infant (6-12 months)',
        ageRange: '6-12m',
        icon: '🍼',
        color: '#f97316',
        recommended: [
            { item: 'Breast milk / Formula', details: 'Continue alongside solids', priority: 'essential' },
            { item: 'Rice cereal / Ragi porridge', details: 'Start with 1-2 tbsp, gradually increase', priority: 'essential' },
            { item: 'Mashed banana, apple, pear', details: 'Introduce one fruit at a time', priority: 'recommended' },
            { item: 'Mashed dal / khichdi', details: 'Well-cooked, mashed consistency', priority: 'recommended' },
            { item: 'Boiled and mashed vegetables', details: 'Carrot, potato, sweet potato, pumpkin', priority: 'recommended' },
            { item: 'Curd / Yogurt', details: 'Small quantities, plain/unflavored', priority: 'optional' },
        ],
        avoid: [
            { item: 'Honey', reason: 'Risk of botulism until 1 year' },
            { item: 'Whole nuts / Seeds', reason: 'Choking hazard' },
            { item: 'Cow\'s milk as main drink', reason: 'Not suitable as replacement' },
            { item: 'Processed / Packaged food', reason: 'High sodium and preservatives' },
            { item: 'Spicy food', reason: 'Can cause stomach irritation' },
        ],
        homecare: [
            { tip: 'Introduce one new food every 3-5 days to watch for allergies', icon: '🔍' },
            { tip: 'Continue breastfeeding alongside solid foods', icon: '🍼' },
            { tip: 'Tummy time: 30 min/day to strengthen muscles', icon: '💪' },
            { tip: 'Establish sleep routine: 12-14 hours total', icon: '😴' },
            { tip: 'Keep small objects away — everything goes in mouth', icon: '⚠️' },
        ],
    },
    {
        id: 'dt003',
        ageGroup: 'Toddler (1-3 years)',
        ageRange: '1-3y',
        icon: '🧒',
        color: '#10b981',
        recommended: [
            { item: 'Whole milk / Buffalo milk', details: '2 cups per day', priority: 'essential' },
            { item: 'Roti / Rice / Chapati', details: 'Age-appropriate portions', priority: 'essential' },
            { item: 'Dal / Lentils', details: 'Good protein source, daily', priority: 'essential' },
            { item: 'Fruits (banana, apple, mango, papaya)', details: '2-3 servings daily', priority: 'recommended' },
            { item: 'Eggs (boiled/scrambled)', details: '1 per day, excellent protein', priority: 'recommended' },
            { item: 'Green vegetables (palak, beans, broccoli)', details: 'Finely chopped', priority: 'recommended' },
            { item: 'Ghee / Butter', details: 'Small amounts for healthy fats', priority: 'optional' },
            { item: 'Dry fruits powder (in milk)', details: 'Almonds, walnuts — powdered form', priority: 'optional' },
        ],
        avoid: [
            { item: 'Candy / Chocolates / Toffees', reason: 'Dental caries and sugar addiction' },
            { item: 'Chips / Packaged snacks', reason: 'High sodium, artificial flavors' },
            { item: 'Carbonated drinks', reason: 'No nutritional value, harmful' },
            { item: 'Tea / Coffee', reason: 'Caffeine not suitable for toddlers' },
            { item: 'Whole grapes / Cherry tomatoes', reason: 'Choking hazard — cut into quarters' },
            { item: 'Raw salads', reason: 'Difficult to digest, risk of contamination' },
        ],
        homecare: [
            { tip: 'Regular meal times: Breakfast, Lunch, Snack, Dinner', icon: '🕐' },
            { tip: 'Limit screen time to 30 min/day', icon: '📱' },
            { tip: '1-2 hours outdoor play daily', icon: '🏃' },
            { tip: 'Brush teeth twice daily with pea-sized fluoride toothpaste', icon: '🦷' },
            { tip: 'Hand washing before meals and after play', icon: '🧼' },
            { tip: 'Ensure vaccinations are up to date', icon: '💉' },
        ],
    },
    {
        id: 'dt004',
        ageGroup: 'Child (3-6 years)',
        ageRange: '3-6y',
        icon: '👦',
        color: '#4f46e5',
        recommended: [
            { item: 'Milk / Curd / Paneer', details: '2-3 servings for calcium', priority: 'essential' },
            { item: 'Roti / Rice with dal', details: 'Balanced meals 3 times/day', priority: 'essential' },
            { item: 'Seasonal fruits', details: '2-3 servings daily', priority: 'essential' },
            { item: 'Eggs / Chicken / Fish', details: 'Protein source, 3-4 times/week', priority: 'recommended' },
            { item: 'Green leafy vegetables', details: 'Palak, methi, broccoli', priority: 'recommended' },
            { item: 'Whole grains (daliya, oats)', details: 'Good for fiber and energy', priority: 'recommended' },
            { item: 'Sprouts / Chana', details: 'Excellent protein for vegetarians', priority: 'optional' },
        ],
        avoid: [
            { item: 'Junk food (pizza, burgers, fries)', reason: 'Empty calories, poor nutrition' },
            { item: 'Sugary drinks / Fruit juices', reason: 'Prefer whole fruits instead' },
            { item: 'Excess sweets / Mithai', reason: 'Risk of obesity and dental issues' },
            { item: 'Instant noodles (Maggi etc.)', reason: 'High sodium, maida-based' },
            { item: 'Street food', reason: 'Hygiene concerns, heavy oils' },
        ],
        homecare: [
            { tip: 'Ensure 10-12 hours of sleep', icon: '😴' },
            { tip: 'Active play outside for 1-2 hours', icon: '⚽' },
            { tip: 'Read books together for 15-20 min daily', icon: '📚' },
            { tip: 'Limit gadget screen time to 1 hour/day', icon: '📱' },
            { tip: 'Teach handwashing, personal hygiene', icon: '🧼' },
            { tip: 'Regular eye & dental checkups every 6 months', icon: '👁️' },
        ],
    },
    {
        id: 'dt005',
        ageGroup: 'Child (6-12 years)',
        ageRange: '6-12y',
        icon: '🧑',
        color: '#0ea5e9',
        recommended: [
            { item: 'Balanced meals with all food groups', details: 'Carbs + Protein + Fats + Vitamins', priority: 'essential' },
            { item: 'Milk / Dairy products', details: 'For bone growth, 2-3 servings', priority: 'essential' },
            { item: 'Iron-rich foods (spinach, jaggery, dry fruits)', details: 'Prevents anemia', priority: 'recommended' },
            { item: 'Protein (eggs, pulses, fish, paneer)', details: 'For growth and development', priority: 'recommended' },
            { item: 'Nuts and seeds', details: 'Almonds, walnuts, flax seeds', priority: 'recommended' },
            { item: 'Water — 6-8 glasses daily', details: 'Hydration is crucial', priority: 'essential' },
        ],
        avoid: [
            { item: 'Cola / Soft drinks', reason: 'Leads to obesity, tooth decay' },
            { item: 'Excess bread / Maida products', reason: 'Low nutrition, constipation risk' },
            { item: 'Skipping breakfast', reason: 'Impacts concentration and energy' },
            { item: 'Energy drinks', reason: 'High caffeine, not for children' },
            { item: 'Excessive fried food', reason: 'Increases cholesterol risk' },
        ],
        homecare: [
            { tip: 'Mandatory breakfast before school', icon: '🍳' },
            { tip: 'Pack nutritious lunch box (roti/rice, sabzi, fruit)', icon: '🍱' },
            { tip: 'Encourage sports / physical activity', icon: '🏏' },
            { tip: '9-10 hours of sleep', icon: '😴' },
            { tip: 'Regular medical checkups', icon: '🏥' },
            { tip: 'Limit social media / phone usage', icon: '📵' },
        ],
    },
];

const FEVER_HOMECARE = [
    { tip: 'Give Paracetamol as prescribed (dose based on weight)', icon: '💊' },
    { tip: 'Sponge bath with lukewarm water (NOT cold water)', icon: '🛁' },
    { tip: 'Keep child lightly dressed, avoid heavy blankets', icon: '👕' },
    { tip: 'Push fluids: ORS, coconut water, dal ka paani, juices', icon: '💧' },
    { tip: 'Monitor temperature every 4-6 hours', icon: '🌡️' },
    { tip: 'Visit doctor if fever persists beyond 3 days or exceeds 103°F', icon: '🏥' },
];

const GENERAL_HOMECARE = [
    { tip: 'Ensure adequate hydration throughout the day', icon: '💧' },
    { tip: 'Maintain a fixed schedule for meals and sleep', icon: '🕐' },
    { tip: 'Keep the environment clean and well-ventilated', icon: '🪟' },
    { tip: 'Wash hands frequently, especially before meals', icon: '🧼' },
    { tip: 'Encourage eating at the dining table, not in front of TV', icon: '🍽️' },
];

const DietTemplates = () => {
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showHomecare, setShowHomecare] = useState(null); // 'fever' | 'general' | null
    const [expandedSection, setExpandedSection] = useState('recommended');

    const filtered = DIET_TEMPLATES.filter(t =>
        t.ageGroup.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCopyTemplate = (template) => {
        const text = [
            `🍽️ DIET PLAN — ${template.ageGroup}`,
            '',
            '✅ RECOMMENDED FOODS:',
            ...template.recommended.map(r => `• ${r.item}: ${r.details}`),
            '',
            '❌ FOODS TO AVOID:',
            ...template.avoid.map(a => `• ${a.item}: ${a.reason}`),
            '',
            '🏠 HOMECARE TIPS:',
            ...template.homecare.map(h => `${h.icon} ${h.tip}`),
        ].join('\n');

        navigator.clipboard?.writeText(text);
        showToast('Diet plan copied to clipboard', 'success');
    };

    const handlePrintTemplate = (template) => {
        const printWindow = window.open('', '_blank', 'width=500,height=700');
        if (!printWindow) {
            showToast('Please allow popups to print', 'error');
            return;
        }

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Diet Plan - ${template.ageGroup}</title>
                <style>
                    body { font-family: 'Segoe UI', sans-serif; padding: 24px; color: #333; max-width: 480px; margin: 0 auto; }
                    .header { text-align: center; border-bottom: 2px solid #4f46e5; padding-bottom: 12px; margin-bottom: 16px; }
                    .header h2 { color: #4f46e5; margin: 0; }
                    .header p { font-size: 0.85rem; color: #666; margin: 4px 0 0; }
                    h3 { font-size: 1rem; margin-top: 16px; padding-bottom: 6px; border-bottom: 1px dotted #ddd; }
                    h3.green { color: #059669; }
                    h3.red { color: #dc2626; }
                    h3.blue { color: #2563eb; }
                    .item { padding: 4px 0; font-size: 0.85rem; }
                    .item strong { font-size: 0.9rem; }
                    .item span { color: #666; }
                    .tip { padding: 3px 0; font-size: 0.85rem; }
                    .footer { margin-top: 24px; text-align: center; font-size: 0.75rem; color: #999; border-top: 1px solid #eee; padding-top: 12px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h2>🍽️ Diet & Homecare Plan</h2>
                    <p>${template.ageGroup}</p>
                    <p>SmartClinic • Dr. Payal Patel</p>
                </div>
                <h3 class="green">✅ Recommended Foods</h3>
                ${template.recommended.map(r => `<div class="item"><strong>• ${r.item}</strong> — <span>${r.details}</span></div>`).join('')}
                <h3 class="red">❌ Foods to Avoid</h3>
                ${template.avoid.map(a => `<div class="item"><strong>• ${a.item}</strong> — <span>${a.reason}</span></div>`).join('')}
                <h3 class="blue">🏠 Homecare Tips</h3>
                ${template.homecare.map(h => `<div class="tip">${h.icon} ${h.tip}</div>`).join('')}
                <div class="footer">
                    <p>This diet plan should be followed as per doctor's advice.</p>
                    <p>Generated on ${new Date().toLocaleDateString('en-IN')}</p>
                </div>
                <script>window.onload = function() { window.print(); }</script>
            </body>
            </html>
        `;

        printWindow.document.write(html);
        printWindow.document.close();
        showToast('Printing diet plan...', 'info');
    };

    return (
        <div className="animate-fade-in">
            <PageHeader title="Diet Templates & Homecare" subtitle="Pre-built diet plans and homecare advice for children by age group">
                <div className="flex gap-2">
                    <button className="secondary-btn" onClick={() => setShowHomecare('fever')}>
                        <Thermometer size={14} /> Fever Homecare
                    </button>
                    <button className="secondary-btn" onClick={() => setShowHomecare('general')}>
                        <Heart size={14} /> General Tips
                    </button>
                </div>
            </PageHeader>

            <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search by age group..." />

            {/* Age Group Cards */}
            <div className="diet-template-grid stagger-children">
                {filtered.map(template => (
                    <div
                        key={template.id}
                        className="diet-template-card glass"
                        onClick={() => setSelectedTemplate(template)}
                        style={{ '--template-color': template.color }}
                    >
                        <div className="diet-card-header">
                            <span className="diet-icon">{template.icon}</span>
                            <div>
                                <h3 className="font-bold">{template.ageGroup}</h3>
                                <p className="text-xs text-muted">
                                    {template.recommended.length} foods • {template.avoid.length} restrictions • {template.homecare.length} tips
                                </p>
                            </div>
                        </div>

                        <div className="diet-card-preview">
                            <div className="diet-preview-section">
                                <span className="text-xs font-bold" style={{ color: 'var(--emerald)' }}>✅ Top Recommended</span>
                                {template.recommended.slice(0, 3).map((r, i) => (
                                    <p key={i} className="text-xs text-muted">• {r.item}</p>
                                ))}
                            </div>
                            <div className="diet-preview-section">
                                <span className="text-xs font-bold" style={{ color: 'var(--accent)' }}>❌ Key Restrictions</span>
                                {template.avoid.slice(0, 2).map((a, i) => (
                                    <p key={i} className="text-xs text-muted">• {a.item}</p>
                                ))}
                            </div>
                        </div>

                        <button className="primary-btn-sm mt-3" style={{ '--btn-color': template.color }}>
                            <BookOpen size={14} /> View Full Plan
                        </button>
                    </div>
                ))}
            </div>

            {/* Template Detail Modal */}
            <Modal
                isOpen={!!selectedTemplate}
                onClose={() => setSelectedTemplate(null)}
                title={`${selectedTemplate?.icon || ''} ${selectedTemplate?.ageGroup || ''}`}
                size="lg"
            >
                {selectedTemplate && (
                    <div>
                        {/* Section Tabs */}
                        <div className="emr-tabs mb-4">
                            <button className={`emr-tab ${expandedSection === 'recommended' ? 'active' : ''}`} onClick={() => setExpandedSection('recommended')}>
                                <CheckCircle2 size={14} /> Recommended ({selectedTemplate.recommended.length})
                            </button>
                            <button className={`emr-tab ${expandedSection === 'avoid' ? 'active' : ''}`} onClick={() => setExpandedSection('avoid')}>
                                <Ban size={14} /> Avoid ({selectedTemplate.avoid.length})
                            </button>
                            <button className={`emr-tab ${expandedSection === 'homecare' ? 'active' : ''}`} onClick={() => setExpandedSection('homecare')}>
                                <Heart size={14} /> Homecare ({selectedTemplate.homecare.length})
                            </button>
                        </div>

                        {/* Recommended Foods */}
                        {expandedSection === 'recommended' && (
                            <div className="diet-detail-list">
                                {selectedTemplate.recommended.map((item, i) => (
                                    <div key={i} className="diet-detail-item">
                                        <div className={`priority-dot priority-${item.priority}`} />
                                        <div style={{ flex: 1 }}>
                                            <p className="font-bold text-sm">{item.item}</p>
                                            <p className="text-xs text-muted">{item.details}</p>
                                        </div>
                                        <span className={`tag tag-${item.priority}`}>{item.priority}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Foods to Avoid */}
                        {expandedSection === 'avoid' && (
                            <div className="diet-detail-list">
                                {selectedTemplate.avoid.map((item, i) => (
                                    <div key={i} className="diet-avoid-item">
                                        <Ban size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                                        <div>
                                            <p className="font-bold text-sm">{item.item}</p>
                                            <p className="text-xs text-muted">{item.reason}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Homecare Tips */}
                        {expandedSection === 'homecare' && (
                            <div className="diet-detail-list">
                                {selectedTemplate.homecare.map((item, i) => (
                                    <div key={i} className="homecare-tip-item">
                                        <span className="tip-icon">{item.icon}</span>
                                        <p className="text-sm">{item.tip}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3 mt-6">
                            <button className="primary-btn flex-1" onClick={() => handlePrintTemplate(selectedTemplate)}>
                                <Printer size={16} /> Print Plan
                            </button>
                            <button className="secondary-btn flex-1" onClick={() => handleCopyTemplate(selectedTemplate)}>
                                <Copy size={14} /> Copy Text
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Fever Homecare Modal */}
            <Modal isOpen={showHomecare === 'fever'} onClose={() => setShowHomecare(null)} title="🌡️ Fever Homecare Guide">
                <div className="diet-detail-list">
                    {FEVER_HOMECARE.map((item, i) => (
                        <div key={i} className="homecare-tip-item">
                            <span className="tip-icon">{item.icon}</span>
                            <p className="text-sm">{item.tip}</p>
                        </div>
                    ))}
                </div>
                <div className="p-3 bg-background rounded-lg mt-4" style={{ borderLeft: '3px solid var(--accent)' }}>
                    <p className="text-xs font-bold text-accent mb-1">⚠️ IMPORTANT</p>
                    <p className="text-xs text-muted">
                        If fever exceeds 103°F or lasts more than 3 days, or child shows signs of
                        dehydration, breathing difficulty, or rashes — seek immediate medical attention.
                    </p>
                </div>
            </Modal>

            {/* General Homecare Modal */}
            <Modal isOpen={showHomecare === 'general'} onClose={() => setShowHomecare(null)} title="🏠 General Homecare Tips">
                <div className="diet-detail-list">
                    {GENERAL_HOMECARE.map((item, i) => (
                        <div key={i} className="homecare-tip-item">
                            <span className="tip-icon">{item.icon}</span>
                            <p className="text-sm">{item.tip}</p>
                        </div>
                    ))}
                </div>
            </Modal>
        </div>
    );
};

export default DietTemplates;
