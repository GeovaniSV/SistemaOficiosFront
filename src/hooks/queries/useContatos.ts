import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../services/api";
import { ContatoType } from "../../types/contato";

// GET
export function useContatos() {
  return useQuery({
    queryKey: ["contatos"],
    queryFn: () =>
      api.get("/api/contacts", {}).then((res) => res.data.data ?? res.data),
  });
}

export function useContato(id: number) {
  return useQuery<ContatoType>({
    queryKey: ["contato", id],
    queryFn: () =>
      api.get(`/api/contacts/${id}`).then((res) => res.data.data ?? res.data),
  });
}

// POST
export function useAddContato() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (contato: any) => {
      return api.post("/api/contacts", contato);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["contatos"] }),
  });
}

// PUT
export function useUpdateContato() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...contato }: ContatoType) =>
      api.put(`/api/contacts/${id}`, contato),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["contatos"] }),
  });
}

// DELETE
export function useDeleteContato() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, param }: { id: number; param: boolean }) =>
      api.delete(`/api/contacts/${id}`, {
        data: {
          activate: param,
        },
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["contatos"] }),
  });
}
