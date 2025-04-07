import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './VehicleList.css';

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

interface FilterState {
  brand: string;
  minPrice: string;
  maxPrice: string;
  condition: string;
  location: string;
}

const VehicleList: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    brand: '',
    minPrice: '',
    maxPrice: '',
    condition: '',
    location: ''
  });

  const fetchVehicles = async (filterParams = {}) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filterParams).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString());
      });

      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
      const response = await fetch(`http://localhost:3000/api/vehicles${queryString}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      setVehicles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    fetchVehicles(filters);
  };

  const resetFilters = () => {
    setFilters({
      brand: '',
      minPrice: '',
      maxPrice: '',
      condition: '',
      location: ''
    });
    fetchVehicles();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', { 
      style: 'currency', 
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="vehicle-list-container">
      
      <div className="filter-section">
        <h2>Filter Vehicles</h2>
        <form onSubmit={applyFilters}>
          <div className="filter-row">
            <div className="filter-group">
              <label htmlFor="brand">Brand</label>
              <input 
                type="text" 
                id="brand" 
                name="brand" 
                value={filters.brand} 
                onChange={handleFilterChange} 
                placeholder="Tesla, Nissan, etc." 
              />
            </div>
            
            <div className="filter-group">
              <label htmlFor="location">Location</label>
              <input 
                type="text" 
                id="location" 
                name="location" 
                value={filters.location} 
                onChange={handleFilterChange} 
                placeholder="City name" 
              />
            </div>
            
            <div className="filter-group">
              <label htmlFor="condition">Condition</label>
              <select 
                id="condition" 
                name="condition" 
                value={filters.condition} 
                onChange={handleFilterChange}
              >
                <option value="">All</option>
                <option value="New">New</option>
                <option value="Used">Used</option>
              </select>
            </div>
          </div>
          
          <div className="filter-row">
            <div className="filter-group">
              <label htmlFor="minPrice">Min Price (€)</label>
              <input 
                type="number" 
                id="minPrice" 
                name="minPrice" 
                value={filters.minPrice} 
                onChange={handleFilterChange} 
                placeholder="Min price" 
                min="0" 
              />
            </div>
            
            <div className="filter-group">
              <label htmlFor="maxPrice">Max Price (€)</label>
              <input 
                type="number" 
                id="maxPrice" 
                name="maxPrice" 
                value={filters.maxPrice} 
                onChange={handleFilterChange} 
                placeholder="Max price"
                min="0" 
              />
            </div>
          </div>
          
          <div className="filter-buttons">
            <button type="submit" className="btn-primary">Apply Filters</button>
            <button type="button" className="btn-secondary" onClick={resetFilters}>Reset</button>
          </div>
        </form>
      </div>
      
      {loading && <div className="loading">Loading vehicles...</div>}
      {error && <div className="error">Error: {error}</div>}
      
      {!loading && !error && (
        <>
          <div className="results-count">Found {vehicles.length} vehicles</div>
          
          {vehicles.length === 0 ? (
            <div className="no-results">No vehicles found matching your criteria.</div>
          ) : (
            <div className="vehicle-grid">
              {vehicles.map(vehicle => (
                <div key={vehicle.id} className="vehicle-card">
                  <Link to={`/vehicles/${vehicle.id}`} className="vehicle-link">
                    <div className="vehicle-image">
                      {vehicle.images && vehicle.images.length > 0 ? (
                        <img src={vehicle.images[0]} alt={`${vehicle.brand} ${vehicle.model}`} />
                      ) : (
                        <div className="no-image">No Image</div>
                      )}
                      <div className="vehicle-condition">{vehicle.condition}</div>
                    </div>
                    
                    <div className="vehicle-info">
                      <h3>{vehicle.brand} {vehicle.model}</h3>
                      <div className="vehicle-price">{formatCurrency(vehicle.price)}</div>
                      
                      <div className="vehicle-details">
                        <div className="detail">
                          <span className="detail-label">Year:</span> {vehicle.year}
                        </div>
                        <div className="detail">
                          <span className="detail-label">Range:</span> {vehicle.range_km} km
                        </div>
                        <div className="detail">
                          <span className="detail-label">Battery:</span> {vehicle.battery_capacity_kWh} kWh
                        </div>
                        <div className="detail">
                          <span className="detail-label">Location:</span> {vehicle.location}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VehicleList;
