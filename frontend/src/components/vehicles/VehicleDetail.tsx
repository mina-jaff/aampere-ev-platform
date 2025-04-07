import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './VehicleDetail.css';

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  range_km: number;
  color: string;
  condition: string;
  battery_capacity_kWh: number;
  charging_speed_kW: number;
  seats: number;
  drivetrain: string;
  location: string;
  autopilot: boolean;
  kilometer_count: number;
  accidents: boolean;
  accident_description?: string;
  images: string[];
}

const VehicleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  useEffect(() => {
    const fetchVehicleDetail = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:3000/api/vehicles/${id}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch vehicle: ${response.statusText}`);
        }
        
        const data = await response.json();
        setVehicle(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleDetail();
  }, [id]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', { 
      style: 'currency', 
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return <div className="loading-container">Loading vehicle details...</div>;
  }

  if (error) {
    return <div className="error-container">Error: {error}</div>;
  }

  if (!vehicle) {
    return <div className="not-found-container">Vehicle not found</div>;
  }

  return (
    <div className="vehicle-detail-container">
      <div className="detail-header">
        <Link to="/" className="back-button">← Back</Link>
        <h1>{vehicle.brand} {vehicle.model} ({vehicle.year})</h1>
      </div>

      <div className="detail-content">
        <div className="image-gallery">
          {vehicle.images && vehicle.images.length > 0 ? (
            <>
              <div className="main-image">
                <img 
                  src={vehicle.images[activeImageIndex]} 
                  alt={`${vehicle.brand} ${vehicle.model}`} 
                />
              </div>
              
              {vehicle.images.length > 1 && (
                <div className="thumbnail-container">
                  {vehicle.images.map((image, index) => (
                    <div 
                      key={index} 
                      className={`thumbnail ${index === activeImageIndex ? 'active' : ''}`}
                      onClick={() => setActiveImageIndex(index)}
                    >
                      <img src={image} alt={`Thumbnail ${index + 1}`} />
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="no-image">No images available</div>
          )}
        </div>

        <div className="vehicle-info-detailed">
          <div className="price-section">
            <span className="price">{formatCurrency(vehicle.price)}</span>
            <span className="condition">{vehicle.condition}</span>
          </div>

          <div className="specs-grid">
            <div className="spec-item">
              <div className="spec-label">Range</div>
              <div className="spec-value">{vehicle.range_km} km</div>
            </div>
            <div className="spec-item">
              <div className="spec-label">Battery Capacity</div>
              <div className="spec-value">{vehicle.battery_capacity_kWh} kWh</div>
            </div>
            <div className="spec-item">
              <div className="spec-label">Charging Speed</div>
              <div className="spec-value">{vehicle.charging_speed_kW} kW</div>
            </div>
            <div className="spec-item">
              <div className="spec-label">Drivetrain</div>
              <div className="spec-value">{vehicle.drivetrain}</div>
            </div>
            <div className="spec-item">
              <div className="spec-label">Color</div>
              <div className="spec-value">{vehicle.color}</div>
            </div>
            <div className="spec-item">
              <div className="spec-label">Seats</div>
              <div className="spec-value">{vehicle.seats}</div>
            </div>
            <div className="spec-item">
              <div className="spec-label">Autopilot</div>
              <div className="spec-value">{vehicle.autopilot ? 'Yes' : 'No'}</div>
            </div>
            <div className="spec-item">
              <div className="spec-label">Kilometer Count</div>
              <div className="spec-value">{vehicle.kilometer_count.toLocaleString()} km</div>
            </div>
          </div>

          <div className="location-section">
            <h3>Location</h3>
            <p>{vehicle.location}</p>
          </div>

          {vehicle.accidents && (
            <div className="accident-section">
              <h3>Accident History</h3>
              <p>{vehicle.accident_description || 'This vehicle has been in an accident.'}</p>
            </div>
          )}

          <div className="action-buttons">
            <button className="btn-contact">Contact Seller</button>
            <button className="btn-test-drive">Schedule Test Drive</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetail;
