import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../services/api";

export type AuthorizedSigner = {
  id: number;
  type: "user" | "position";
  signer_id: number;
  name: string;
  cargo?: string | null;
};

// GET
export function useOficioSettings() {
  return useQuery({
    queryKey: ["oficio-settings"],
    queryFn: () =>
      api.get("/api/settings").then((res) => res.data.data ?? res.data),
    retry: false,
  });
}

// PUT
export function useUpdateOficioSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      header: string;
      footer: string;
      signers: { type: "user" | "position"; id: number }[];
    }) => api.put("/api/settings", payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["oficio-settings"] }),
  });
}
