import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../services/api";

export function useProfile() {
  return useQuery({
    queryKey: ["user", "me"],
    queryFn: () =>
      api.get(`/api/auth/me`).then((res) => res.data.data ?? res.data),
  });
}
