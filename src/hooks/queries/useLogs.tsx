import { useQuery } from "@tanstack/react-query";
import { api } from "@/src/services/api";

export interface WorkerLog {
  id: number;
  correlation_id: string | null;
  code: string;
  message: string;
  status: number; // 1 = sucesso, 0 = falha
  event_type: string;
  queue_name: string;
  user_id: string;
  metadata: {
    attempt: number;
    timestamp: string;
    [key: string]: any;
  };
  created_at: string;
  updated_at: string;
}

export function useWorkerLogs(page: number = 1) {
  return useQuery({
    queryKey: ["worker-logs", page],
    queryFn: () =>
      api.get(`/api/worker-logs?page=${page}`).then((res) => res.data),
  });
}
