// File Name: Employee.tsx
import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { Employee as EmployeeType } from '../types';
import { FaStar, FaSearch, FaFilter, FaUndo, FaSync } from 'react-icons/fa';
import { useEmployeeSearch } from '../hooks/useEmployeeSearch';
import { useDashboardFilter } from '../hooks/useDashboardFilter';
import { usePagination } from '../hooks/usePagination';
import './Employee.css';

// ==========================================
// LOCAL DIRECTORY FILTER BAR HELPER
// ==========================================
interface DirectoryFilterBarProps {
  onRefresh: () => void;
  onReset: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  deptFilter: string;
  onDeptFilterChange: (value: string) => void;
  locationFilter: string;
  onLocationFilterChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
}

function DirectoryFilterBar({
  onRefresh,
  onReset,
  searchQuery,
  onSearchChange,
  deptFilter,
  onDeptFilterChange,
  locationFilter,
  onLocationFilterChange,
  statusFilter,
  onStatusFilterChange,
  searchInputRef
}: DirectoryFilterBarProps) {
  const departments = ["Engineering", "Operations", "Sales", "HR", "Finance"];
  const locations = ["Chennai", "Coimbatore", "Salem", "Bangalore", "Trichy"];
  const statuses = ["Active", "On Leave", "Inactive"];

  return (
    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
      {/* 1. REFRESH BUTTON */}
      <button
        onClick={onRefresh}
        title="Refresh Dashboard Data"
        style={{
          padding: '7px 10px',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          background: '#f8fafc',
          cursor: 'pointer',
          color: '#475569',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '13px'
        }}
      >
        <FaSync style={{ marginRight: '5px' }} /> Refresh
      </button>

      {/* 2. RESET BUTTON */}
      <button
        onClick={onReset}
        title="Reset All Filters"
        style={{
          padding: '7px 10px',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          background: '#f8fafc',
          cursor: 'pointer',
          color: '#475569',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '13px'
        }}
      >
        <FaUndo style={{ marginRight: '5px' }} /> Reset
      </button>

      {/* 3. SEARCH INPUT BOX */}
      <div style={{ position: 'relative' }}>
        <FaSearch style={{ position: 'absolute', left: '10px', top: '10px', color: '#64748b', fontSize: '13px' }} />
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search Name or ID..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            padding: '7px 10px 7px 30px',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            fontSize: '13px',
            outline: 'none',
            width: '180px'
          }}
        />
      </div>

      {/* 4. DEPARTMENT FILTER SELECT */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <FaFilter style={{ color: '#64748b', fontSize: '11px' }} />
        <select
          value={deptFilter}
          onChange={(e) => onDeptFilterChange(e.target.value)}
          style={{
            padding: '7px',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            fontSize: '12px',
            outline: 'none',
            cursor: 'pointer'
          }}
          aria-label="Filter by department"
        >
          <option value="All">All Departments</option>
          {departments.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {/* 5. LOCATION FILTER SELECT */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <select
          value={locationFilter}
          onChange={(e) => onLocationFilterChange(e.target.value)}
          style={{
            padding: '7px',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            fontSize: '12px',
            outline: 'none',
            cursor: 'pointer'
          }}
          aria-label="Filter by location"
        >
          <option value="All">All Locations</option>
          {locations.map(l => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </div>

      {/* 6. STATUS FILTER SELECT */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          style={{
            padding: '7px',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            fontSize: '12px',
            outline: 'none',
            cursor: 'pointer'
          }}
          aria-label="Filter by status"
        >
          <option value="All">All Statuses</option>
          {statuses.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

// ==========================================
// EMPLOYEE DIRECTORY COMPONENT
// ==========================================
interface EmployeeProps {
  employees: EmployeeType[];
  onRefresh?: () => void;
}

export function Employee({ employees, onRefresh }: EmployeeProps) {
  // 1. Refs for DOM Access & Auto-focus
  const searchInputRef = useRef<HTMLInputElement>(null);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // Auto-focus search input on mount
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  // 2. Custom hooks
  const { searchQuery, setSearchQuery, searchedEmployees } = useEmployeeSearch(employees);
  const {
    deptFilter, setDeptFilter,
    locationFilter, setLocationFilter,
    statusFilter, setStatusFilter,
    filteredEmployees
  } = useDashboardFilter(searchedEmployees);

  const {
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    setPage,
    startIndex,
    endIndex
  } = usePagination(filteredEmployees.length, 5);

  // Paginated subset of filtered employees
  const paginatedEmployees = useMemo(() => {
    return filteredEmployees.slice(startIndex, endIndex);
  }, [filteredEmployees, startIndex, endIndex]);

  // Reset page to 1 when filters or search change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, deptFilter, locationFilter, statusFilter, setPage]);

  // 3. useCallback Event Handlers
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, [setSearchQuery]);

  const handleResetFilters = useCallback(() => {
    setSearchQuery("");
    setDeptFilter("All");
    setLocationFilter("All");
    setStatusFilter("All");
  }, [setSearchQuery, setDeptFilter, setLocationFilter, setStatusFilter]);

  const handleSearchEmployee = useCallback((nameOrId: string) => {
    setSearchQuery(nameOrId);
  }, [setSearchQuery]);

  const handleRefresh = useCallback(() => {
    if (onRefresh) {
      onRefresh();
    }
    // Highlight table container visually for feedback
    if (tableContainerRef.current) {
      tableContainerRef.current.style.opacity = '0.5';
      setTimeout(() => {
        if (tableContainerRef.current) {
          tableContainerRef.current.style.opacity = '1';
        }
      }, 300);
    }
  }, [onRefresh]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return '#22c55e';
      case 'On Leave': return '#f59e0b';
      case 'Inactive': return '#ef4444';
      default: return '#64748b';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Remote': return '#3b82f6';
      case 'Hybrid': return '#8b5cf6';
      case 'On-site': return '#f59e0b';
      default: return '#64748b';
    }
  };

  return (
    <div className="glass-card" style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h2>Employee Directory</h2>
        </div>

        <DirectoryFilterBar
          onRefresh={handleRefresh}
          onReset={handleResetFilters}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          deptFilter={deptFilter}
          onDeptFilterChange={setDeptFilter}
          locationFilter={locationFilter}
          onLocationFilterChange={setLocationFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          searchInputRef={searchInputRef}
        />
      </div>

      {/* Structured Table Container */}
      <div ref={tableContainerRef} style={{ overflowX: 'auto', transition: 'opacity 0.2s ease-in-out' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', fontWeight: 600 }}>
              <th style={{ padding: '12px 10px' }}>ID</th>
              <th style={{ padding: '12px 10px' }}>NAME</th>
              <th style={{ padding: '12px 10px' }}>DEPARTMENT</th>
              <th style={{ padding: '12px 10px' }}>LOCATION</th>
              <th style={{ padding: '12px 10px' }}>WORK TYPE</th>
              <th style={{ padding: '12px 10px' }}>STATUS</th>
              <th style={{ padding: '12px 10px' }}>PERFORMANCE</th>
              <th style={{ padding: '12px 10px', textAlign: 'right' }}>RATING</th>
            </tr>
          </thead>
          <tbody>
            {paginatedEmployees.map((emp) => {
              const initials = emp.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
              
              const gradients = [
                'linear-gradient(135deg, #3b82f6, #8b5cf6)', // Blue to Purple
                'linear-gradient(135deg, #10b981, #14b8a6)', // Emerald to Teal
                'linear-gradient(135deg, #f59e0b, #ef4444)', // Orange to Red
                'linear-gradient(135deg, #6366f1, #ec4899)', // Indigo to Pink
                'linear-gradient(135deg, #06b6d4, #3b82f6)', // Cyan to Blue
                'linear-gradient(135deg, #f43f5e, #fb923c)', // Rose to Orange
                'linear-gradient(135deg, #8b5cf6, #4f46e5)', // Violet to Indigo
                'linear-gradient(135deg, #22c55e, #10b981)'  // Green to Emerald
              ];
              const avatarBackground = gradients[emp.id % gradients.length];

              return (
                <tr key={emp.id} style={{ borderBottom: '1px solid #e2e8f0' }} className="table-row">
                  {/* ID */}
                  <td style={{ padding: '12px 10px', color: '#64748b', fontWeight: 500 }}>
                    #{emp.id}
                  </td>

                  {/* Name & Role */}
                  <td style={{ padding: '12px 10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: avatarBackground,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      color: 'white'
                    }}>
                      {initials}
                    </div>
                    <div>
                      <div 
                        style={{ fontWeight: 600, color: '#0f172a', cursor: 'pointer' }}
                        onClick={() => handleSearchEmployee(emp.name)}
                        title="Click to search this employee"
                      >
                        {emp.name}
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '1px' }}>{emp.role}</div>
                    </div>
                  </td>

                  {/* Department */}
                  <td style={{ padding: '12px 10px', color: '#475569' }}>{emp.department}</td>

                  {/* Location */}
                  <td style={{ padding: '12px 10px', color: '#475569' }}>{emp.location}</td>

                  {/* Work Type */}
                  <td style={{ padding: '12px 10px' }}>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: '12px',
                      background: `${getTypeColor(emp.type)}12`,
                      color: getTypeColor(emp.type),
                      fontSize: '11px',
                      fontWeight: 600
                    }}>
                      {emp.type}
                    </span>
                  </td>

                  {/* Status */}
                  <td style={{ padding: '12px 10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#475569' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: getStatusColor(emp.status) }} />
                      {emp.status}
                    </div>
                  </td>

                  {/* Performance */}
                  <td style={{ padding: '12px 10px' }}>
                    <span style={{
                      fontWeight: 500,
                      color: emp.performance === 'Excellent' ? '#10b981' : emp.performance === 'Good' ? '#6366f1' : '#f59e0b'
                    }}>
                      {emp.performance}
                    </span>
                  </td>

                  {/* Rating */}
                  <td style={{ padding: '12px 10px', textAlign: 'right', fontWeight: 600, color: '#0f172a' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <FaStar style={{ color: '#f59e0b', fontSize: '11px' }} />
                      {emp.rating}%
                    </div>
                  </td>
                </tr>
              );
            })}

            {filteredEmployees.length === 0 && (
              <tr>
                <td colSpan={8} style={{ padding: '30px 0', textAlign: 'center', color: '#64748b' }}>
                  No employees matching the search filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {filteredEmployees.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px', padding: '10px 0', borderTop: '1px solid #f1f5f9', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ fontSize: '13px', color: '#64748b' }}>
            Showing {startIndex + 1} to {endIndex} of {filteredEmployees.length} entries
          </div>
          <div style={{ display: 'flex', gap: '5px' }}>
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              style={{
                padding: '5px 12px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                background: currentPage === 1 ? '#f1f5f9' : 'white',
                color: currentPage === 1 ? '#94a3b8' : '#334155',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                fontSize: '12.5px',
                fontWeight: 500
              }}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setPage(page)}
                style={{
                  padding: '5px 10px',
                  borderRadius: '6px',
                  border: '1px solid',
                  borderColor: currentPage === page ? '#2563eb' : '#cbd5e1',
                  background: currentPage === page ? '#2563eb' : 'white',
                  color: currentPage === page ? 'white' : '#334155',
                  cursor: 'pointer',
                  fontSize: '12.5px',
                  fontWeight: 600
                }}
              >
                {page}
              </button>
            ))}
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              style={{
                padding: '5px 12px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                background: currentPage === totalPages ? '#f1f5f9' : 'white',
                color: currentPage === totalPages ? '#94a3b8' : '#334155',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                fontSize: '12.5px',
                fontWeight: 500
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
