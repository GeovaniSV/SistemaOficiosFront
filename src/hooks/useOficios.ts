import { useState, useMemo, useEffect, useCallback } from 'react';
import { Oficio } from '../types/oficio';
import { useAppStore } from '../store/useAppStore';

export interface UseOficiosFilters {
  generalSearch: string;
  statusFilter: string;
  authorFilter: string;
  dateFilter: string;
  origemFilter: string;
}

export function useOficios(itemsPerPage: number = 10) {
  const globalOficios = useAppStore(state => state.oficios);
  const updateOficioStatusGlobal = useAppStore(state => state.updateOficioStatus);
  const [oficios, setOficios] = useState<Oficio[]>(globalOficios);
  
  // Sync when global changes
  useEffect(() => {
    setOficios(globalOficios);
  }, [globalOficios]);
  const [filters, setFilters] = useState<UseOficiosFilters>({
    generalSearch: '',
    statusFilter: '',
    authorFilter: '',
    dateFilter: '',
    origemFilter: ''
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Handle initial filter from localStorage
  useEffect(() => {
    const checkFilter = () => {
      const filter = localStorage.getItem('oficiosInitialFilter');
      if (filter) {
        setFilters(prev => ({ ...prev, statusFilter: filter }));
        localStorage.removeItem('oficiosInitialFilter');
      }
    };
    
    checkFilter();
    window.addEventListener('oficiosFilterChanged', checkFilter);
    return () => window.removeEventListener('oficiosFilterChanged', checkFilter);
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const filteredOficios = useMemo(() => {
    return oficios.filter(oficio => {
      const matchesGeneral = filters.generalSearch === '' || 
        oficio.id.toLowerCase().includes(filters.generalSearch.toLowerCase()) || 
        oficio.subject.toLowerCase().includes(filters.generalSearch.toLowerCase());
      
      const matchesStatus = filters.statusFilter === '' || oficio.status.toLowerCase() === filters.statusFilter.toLowerCase();
      const matchesAuthor = filters.authorFilter === '' || oficio.author.toLowerCase().includes(filters.authorFilter.toLowerCase());
      const matchesDate = filters.dateFilter === '' || oficio.date.includes(filters.dateFilter);
      const matchesOrigem = filters.origemFilter === '' || 
        (filters.origemFilter === 'recebido' ? oficio.type === 'recebido' : oficio.type !== 'recebido');
      
      return matchesGeneral && matchesStatus && matchesAuthor && matchesDate && matchesOrigem;
    });
  }, [oficios, filters]);

  const totalPages = Math.ceil(filteredOficios.length / itemsPerPage);
  
  const paginatedOficios = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOficios.slice(start, start + itemsPerPage);
  }, [filteredOficios, currentPage, itemsPerPage]);

  const getOficioById = useCallback((id: string) => {
    return oficios.find(o => o.id === id);
  }, [oficios]);

  // Provide a proxy setOficios or update specifically? The app probably uses setOficios for status updates
  const updateOficioStatusLocal = useCallback((id: string, newStatus: string, rejectionInfo?: any) => {
    updateOficioStatusGlobal(id, newStatus, rejectionInfo);
  }, [updateOficioStatusGlobal]);

  return {
    oficios,
    setOficios,
    updateOficioStatus: updateOficioStatusLocal,
    filters,
    setFilters,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedOficios,
    getOficioById
  };
}
