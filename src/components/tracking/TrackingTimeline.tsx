import React, { useEffect, useState, type JSX } from 'react';
import { CheckCircle, Truck, Package, XCircle, ArrowLeft, Search, PackageSearch } from 'lucide-react';
import './TrackingTimeline.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { ParcelStatus, ParcelStep } from '../orders/types';
import { getOrderByTrackingNumber } from '../API/API';
import { transformOrderToSteps } from './transformOrder';
import Loader from '../../UI-elements/loader/Loader';
import useAuth from '../../hooks/useAuth';

interface TrackingTimelineProps {
  steps: ParcelStep[];
  setSteps: React.Dispatch<React.SetStateAction<ParcelStep[]>>;
  setParcelNumber: React.Dispatch<React.SetStateAction<string>>;
}

const statusMap: Record<ParcelStatus, { label: string; color: string; icon: JSX.Element }> = {
  accepted: { label: 'Prijaté', color: '#16a34a', icon: <CheckCircle /> },
  sent: { label: 'Bude odoslané', color: '#f97316', icon: <Truck /> },
  delivered: { label: 'Doručené', color: '#2563eb', icon: <Package /> },
  cancelled: { label: 'Zrušené', color: '#dc2626', icon: <XCircle /> },
};

const TrackingTimeline: React.FC<TrackingTimelineProps> = ({
  steps,
  setParcelNumber,
  setSteps,
}) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const number = searchParams.get('number');

  useEffect(() => {
    const fetchOrder = async () => {
      if (!number) {
        return;
      };

      setLoading(true);
      setNotFound(false);
      try {
        const order = await getOrderByTrackingNumber(number);

        setSteps(transformOrderToSteps(order));
        setParcelNumber(number);
      } catch (err) {
        console.error('Chyba pri načítaní objednávky:', err);
        setSteps([]);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [number, setSteps, setParcelNumber]);

  const goBack = () => {
    setParcelNumber('');
    setSteps([]);
    navigate(isAuthenticated ? '/' : '/ervi-group');
  };

  const foundNumber = steps.find((s) => s.parcelNumber)?.parcelNumber;

  return (
    <div className="timeline-container">
      <div className="timeline-header">
        <button className="back-button" onClick={goBack}>
          <ArrowLeft size={18} /> {isAuthenticated ? 'Späť do aplikácie' : 'Späť na hlavnú stránku'}
        </button>
        {foundNumber && (
          <h2 className="timeline-title">Sledovanie zásielky číslo DL #{foundNumber}</h2>
        )}
      </div>

      {loading ? (
        <Loader />
      ) : !number ? (
        <div className="timeline-empty">
          <Search size={40} />
          <h3>Sledovanie zásielky</h3>
          <p>Zadajte číslo DL do poľa v hornej lište a zobrazí sa vám aktuálny stav vašej zásielky.</p>
        </div>
      ) : notFound ? (
        <div className="timeline-empty timeline-empty--error">
          <PackageSearch size={40} />
          <h3>Zásielka nenájdená</h3>
          <p>Objednávku s číslom DL „{number}“ sa nepodarilo nájsť. Skontrolujte, či je číslo zadané správne.</p>
        </div>
      ) : (
        <div className="timeline">
          {steps.map((step, idx) => (
            <div key={idx} className="timeline-item">
              <div
                className="timeline-marker"
                style={{ color: statusMap[step.status].color }}
              >
                {statusMap[step.status].icon}
              </div>

              {idx < steps.length - 1 && <div className="timeline-line"></div>}

              <div className="timeline-card">
                <h3
                  className="timeline-status"
                  style={{ color: statusMap[step.status].color }}
                >
                  {statusMap[step.status].label}
                </h3>
                <p className="timeline-date">{step.date}</p>
                <p className="timeline-fromto">
                  <strong>Odosielateľ:</strong> {step.sender} <br />
                  <strong>Príjemca:</strong> {step.receiver}
                </p>
                <p className="timeline-location">
                  <strong>Od:</strong> {step.from}
                </p>
                <p className="timeline-location">
                  <strong>Do:</strong> {step.to}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrackingTimeline;
