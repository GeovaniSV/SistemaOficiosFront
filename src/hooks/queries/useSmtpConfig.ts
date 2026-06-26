import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../services/api";

// GET
export function useSmtpConfig() {
  return useQuery({
    queryKey: ["smtp-config"],
    queryFn: () =>
      api
        .get("/api/settings/smtp")
        .then((res) => res.data.data ?? res.data),
  });
}

// PUT
export function useUpdateSmtpConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      host: string;
      port: number;
      username: string;
      password?: string;
      from_name: string;
      from_email: string;
      use_tls: boolean;
    }) => api.put("/api/settings/smtp", payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["smtp-config"] }),
  });
}
