import React, { useState } from 'react';
import {
    format,
    addDays,
    startOfWeek,
    endOfWeek,
    isSameDay
} from 'date-fns';
import { ChevronLeft, ChevronRight, Clock, Phone, MapPin } from 'lucide-react';
import '../styles/calendar.css';

const MOCK_APPOINTMENTS = [
    { id: 1, patientName: 'Amit Sharma', time: '10:30 AM', date: new Date(), type: 'Consultation', phone: '+91 98765 00001', room: 'OPD 01' },
    { id: 2, patientName: 'Priya Patel', time: '11:15 AM', date: new Date(), type: 'Follow-up', phone: '+91 98765 00002', room: 'OPD 02' },
    { id: 3, patientName: 'Rajesh Kumar', time: '12:00 PM', date: new Date(), type: 'Check-up', phone: '+91 98765 00003', room: 'Physio' },
    { id: 4, patientName: 'Sneha Rao', time: '02:30 PM', date: addDays(new Date(), 1), type: 'Consultation', phone: '+91 98765 00004', room: 'OPD 01' },
    { id: 5, patientName: 'Vikram Singh', time: '04:00 PM', date: addDays(new Date(), 2), type: 'X-Ray Review', phone: '+91 98765 00005', room: 'Radiology' },
];

const AppointmentCalendar = () => {
    const [anchorDate, setAnchorDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    const start = startOfWeek(anchorDate, { weekStartsOn: 1 });
    const end = endOfWeek(anchorDate, { weekStartsOn: 1 });

    const weekDays = [];
    let day = start;
    while (day <= end) {
        weekDays.push(day);
        day = addDays(day, 1);
    }

    const appointmentsForSelectedDate = MOCK_APPOINTMENTS.filter(app => isSameDay(app.date, selectedDate));

    return (
        <div className="appointment-calendar-container card appointment-calendar-elevated">
            <div className="appointment-calendar-hero">
                <div className="appointment-calendar-overlay">
                    <div className="hero-tag">Live schedule</div>
                    <h3 className="hero-title">
                        Today&apos;s appointments overview
                    </h3>
                    <p className="hero-subtitle">
                        Quick weekly strip on top, clean list of patients on the right –
                        optimised so reception and doctors can scan the queue in seconds.
                    </p>
                    <div className="hero-meta">
                        <span>{format(new Date(), 'EEEE, dd MMM yyyy')}</span>
                        <span>SmartClinic OPD</span>
                    </div>
                </div>
            </div>

            <div className="appointment-calendar-body">
                {/* Left: simple week strip */}
                <div className="week-strip">
                    <div className="week-strip-header">
                        <button
                            className="icon-btn-sm"
                            onClick={() => {
                                const prev = addDays(anchorDate, -7);
                                setAnchorDate(prev);
                                setSelectedDate(prev);
                            }}
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <div className="week-range">
                            {format(start, 'dd MMM')} – {format(end, 'dd MMM')}
                        </div>
                        <button
                            className="icon-btn-sm"
                            onClick={() => {
                                const next = addDays(anchorDate, 7);
                                setAnchorDate(next);
                                setSelectedDate(next);
                            }}
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>

                    <div className="week-days">
                        {weekDays.map(d => {
                            const isToday = isSameDay(d, new Date());
                            const isSelected = isSameDay(d, selectedDate);
                            const count = MOCK_APPOINTMENTS.filter(a => isSameDay(a.date, d)).length;

                            return (
                                <button
                                    key={d.toString()}
                                    className={`week-day-pill ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                                    onClick={() => setSelectedDate(d)}
                                >
                                    <span className="week-day-name">{format(d, 'EEE')}</span>
                                    <span className="week-day-date">{format(d, 'dd')}</span>
                                    {count > 0 && (
                                        <span className="week-day-count">
                                            {count} appt
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Right: appointments list with richer UI */}
                <div className="appointments-panel">
                    <div className="appointments-panel-header">
                        <div>
                            <span className="panel-label">{format(selectedDate, 'EEEE')}</span>
                            <h4 className="panel-title">{format(selectedDate, 'dd MMMM')}</h4>
                        </div>
                        <div className="panel-meta">
                            <span className="pill pill-soft">
                                <Clock size={14} />
                                {appointmentsForSelectedDate.length} appointments
                            </span>
                        </div>
                    </div>

                    <div className="appointments-panel-list">
                        {appointmentsForSelectedDate.length === 0 ? (
                            <div className="empty-appointments-state">
                                <p>No appointments on this day.</p>
                                <span>Choose another date or add a new booking from the queue screen.</span>
                            </div>
                        ) : (
                            appointmentsForSelectedDate.map(app => (
                                <div key={app.id} className="appointment-card">
                                    <div className="appointment-time">
                                        <Clock size={16} />
                                        <span>{app.time}</span>
                                    </div>
                                    <div className="appointment-main">
                                        <div className="appointment-avatar">
                                            {app.patientName.charAt(0)}
                                        </div>
                                        <div className="appointment-text">
                                            <h5>{app.patientName}</h5>
                                            <p>{app.type}</p>
                                            <div className="appointment-meta-row">
                                                <span><Phone size={12} /> {app.phone}</span>
                                                <span><MapPin size={12} /> {app.room}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppointmentCalendar;
