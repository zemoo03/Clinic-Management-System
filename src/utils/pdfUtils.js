import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generatePrescriptionPDF = ({ clinic, patient, symptoms, diagnosis, medicines, date }) => {
    const doc = new jsPDF();

    // Header
    doc.setFillColor(79, 70, 229);
    doc.rect(0, 0, 210, 35, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(clinic?.name || 'SmartClinic', 14, 18);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(clinic?.address || '', 14, 26);
    doc.text(`Phone: ${clinic?.phone || ''}`, 14, 31);
    doc.text(`Date: ${date || new Date().toLocaleDateString('en-IN')}`, 196, 18, { align: 'right' });
    doc.text(`Doctor: ${clinic?.doctor || 'Dr. Sharma'}`, 196, 26, { align: 'right' });

    // Patient Info Box
    doc.setTextColor(30, 41, 59);
    doc.setFillColor(248, 250, 252);
    doc.rect(14, 42, 182, 22, 'F');
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`Patient: ${patient?.name || ''}`, 20, 50);
    doc.setFont('helvetica', 'normal');
    doc.text(`ID: ${patient?.id || ''}  |  Age: ${patient?.age || ''}  |  Gender: ${patient?.gender || ''}`, 20, 58);

    // Rx Symbol
    let y = 75;
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(79, 70, 229);
    doc.text('℞', 14, y);

    // Symptoms
    y += 10;
    doc.setFontSize(11);
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'bold');
    doc.text('Chief Complaints:', 14, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 41, 59);
    y += 7;
    doc.text(symptoms || 'Not specified', 14, y);

    // Diagnosis
    y += 12;
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'bold');
    doc.text('Diagnosis:', 14, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 41, 59);
    y += 7;
    doc.text(diagnosis || 'Not specified', 14, y);

    // Medicines Table
    y += 15;
    if (medicines && medicines.length > 0) {
        doc.autoTable({
            startY: y,
            head: [['#', 'Medicine', 'Dosage', 'Frequency', 'Duration']],
            body: medicines.map((med, i) => [
                i + 1,
                med.name,
                med.dosage || '-',
                med.frequency || '-',
                med.duration || '-'
            ]),
            styles: {
                fontSize: 10,
                cellPadding: 4,
            },
            headStyles: {
                fillColor: [79, 70, 229],
                textColor: [255, 255, 255],
                fontStyle: 'bold'
            },
            alternateRowStyles: {
                fillColor: [248, 250, 252]
            },
            margin: { left: 14, right: 14 }
        });
    }

    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setDrawColor(226, 232, 240);
    doc.line(14, pageHeight - 30, 196, pageHeight - 30);
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text('This is a computer-generated prescription. No signature required.', 105, pageHeight - 22, { align: 'center' });
    doc.text('Powered by SmartClinic SaaS Platform', 105, pageHeight - 16, { align: 'center' });

    return doc;
};

export const downloadPrescription = (data) => {
    const doc = generatePrescriptionPDF(data);
    doc.save(`Prescription_${data.patient?.name?.replace(/\s/g, '_') || 'patient'}_${Date.now()}.pdf`);
};

export const generateInvoicePDF = ({ clinic, patient, items, invoiceId, date }) => {
    const doc = new jsPDF();

    // Header
    doc.setFillColor(79, 70, 229);
    doc.rect(0, 0, 210, 35, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE', 14, 18);
    doc.setFontSize(10);
    doc.text(`${clinic?.name || 'SmartClinic'}`, 14, 28);
    doc.text(`#${invoiceId || 'INV-0000'}`, 196, 18, { align: 'right' });
    doc.text(`Date: ${date || new Date().toLocaleDateString('en-IN')}`, 196, 28, { align: 'right' });

    // Bill To
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Bill To:', 14, 48);
    doc.setFont('helvetica', 'normal');
    doc.text(`${patient?.name || 'Patient'}`, 14, 55);
    doc.text(`Phone: ${patient?.mobile || ''}`, 14, 62);

    // Items Table
    if (items && items.length > 0) {
        const total = items.reduce((sum, item) => sum + (item.amount || 0), 0);

        doc.autoTable({
            startY: 72,
            head: [['#', 'Description', 'Amount (₹)']],
            body: [
                ...items.map((item, i) => [i + 1, item.description, `₹${item.amount}`]),
                ['', { content: 'TOTAL', styles: { fontStyle: 'bold' } }, { content: `₹${total}`, styles: { fontStyle: 'bold' } }]
            ],
            styles: { fontSize: 10, cellPadding: 5 },
            headStyles: { fillColor: [79, 70, 229] },
            margin: { left: 14, right: 14 }
        });
    }

    return doc;
};
