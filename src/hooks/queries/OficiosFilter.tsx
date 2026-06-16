// src/hooks/useOficios.ts
import { useState, useMemo, useCallback } from "react";
import {
  useOficios as useOficiosQuery,
  useUpdateOficioStatus as useUpdateOficioStatusMutation,
} from "./useOficios";

export interface UseOficiosFilters {
  generalSearch: string;
  statusFilter: string;
  authorFilter: string;
  dateFilter: string;
  // origemFilter: string;
}

export function useOficioFilter(itemsPerPage: number = 10) {
  const { data: oficios = [], refetch } = useOficiosQuery();
  const updateStatusMutation = useUpdateOficioStatusMutation();

  const [filters, setFilters] = useState<UseOficiosFilters>({
    generalSearch: "",
    statusFilter: "",
    authorFilter: "",
    dateFilter: "",
    // origemFilter: "",
  });
  const [currentPage, setCurrentPage] = useState(1);

  const filteredOficios = useMemo(() => {
    return oficios.filter((oficio: any) => {
      const matchesGeneral =
        filters.generalSearch === "" ||
        oficio.id
          ?.toString()
          .toLowerCase()
          .includes(filters.generalSearch.toLowerCase()) ||
        oficio.subject
          ?.toLowerCase()
          .includes(filters.generalSearch.toLowerCase());

      const matchesStatus =
        filters.statusFilter === "" ||
        oficio.status?.toLowerCase() === filters.statusFilter.toLowerCase();

      const matchesAuthor =
        filters.authorFilter === "" ||
        oficio.author
          ?.toLowerCase()
          .includes(filters.authorFilter.toLowerCase());

      const matchesDate =
        filters.dateFilter === "" || oficio.date?.includes(filters.dateFilter);

      // const matchesOrigem =
      //   filters.origemFilter === "" ||
      //   (filters.origemFilter === "recebido"
      //     ? oficio.type === "recebido"
      //     : oficio.type !== "recebido");

      return matchesGeneral && matchesStatus && matchesAuthor && matchesDate;
    });
  }, [oficios, filters]);

  const totalPages = Math.ceil(filteredOficios.length / itemsPerPage);

  const paginatedOficios = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOficios.slice(start, start + itemsPerPage);
  }, [filteredOficios, currentPage, itemsPerPage]);

  const getOficioById = useCallback(
    (id: string) => oficios.find((o: any) => o.id === id),
    [oficios],
  );

  const updateOficioStatus = useCallback(
    (id: string, status: string, rejectionInfo?: any) => {
      updateStatusMutation.mutate({ id, status, rejectionInfo });
    },
    [updateStatusMutation],
  );

  return {
    oficios,
    setOficios: () => refetch(), // compatibilidade com código antigo
    updateOficioStatus,
    filters,
    setFilters,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedOficios,
    getOficioById,
  };
}
