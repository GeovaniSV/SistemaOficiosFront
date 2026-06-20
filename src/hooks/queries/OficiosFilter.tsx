// src/hooks/useOficios.ts
import { useState, useMemo, useCallback } from "react";
import { format, isSameDay, parseISO } from "date-fns";
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

const hashStatus: Record<string, string> = {
  APPROVED: "aprovado",
  REJECTED: "rejeitado",
  PENDING: "pendente",
  DRAFT: "rascunho",
  SENT: "enviado",
};

export function useOficioFilter(itemsPerPage: number = 10) {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, refetch } = useOficiosQuery(currentPage);
  const oficios = data?.data ?? [];
  const updateStatusMutation = useUpdateOficioStatusMutation();

  console.log(oficios);
  const [filters, setFilters] = useState<UseOficiosFilters>({
    generalSearch: "",
    statusFilter: "",
    authorFilter: "",
    dateFilter: "",
    // origemFilter: "",
  });

  const filteredOficios = useMemo(() => {
    return oficios.filter((oficio: any) => {
      const oficioDate = format(new Date(oficio.created_at), "dd/MM/yyyy");
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
        hashStatus[oficio.status] === filters.statusFilter.toLowerCase();

      const matchesAuthor =
        filters.authorFilter === "" ||
        oficio.author.name
          ?.toLowerCase()
          .includes(filters.authorFilter.toLowerCase());

      const matchesDate =
        filters.dateFilter === "" ||
        isSameDay(parseISO(oficio.created_at), parseISO(filters.dateFilter));

      // const matchesOrigem =
      //   filters.origemFilter === "" ||
      //   (filters.origemFilter === "recebido"
      //     ? oficio.type === "recebido"
      //     : oficio.type !== "recebido");

      return matchesGeneral && matchesStatus && matchesAuthor && matchesDate;
    });
  }, [oficios, filters]);

  const totalPages = data?.last_page ?? 1;

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
    paginatedOficios: filteredOficios,
    getOficioById,
  };
}
