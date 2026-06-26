import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../services/api";

// API usa `name`, o frontend usa `title` para o título do template.
function adaptTemplate(apiTemplate: any) {
  return {
    id: apiTemplate.id,
    title: apiTemplate.name,
    content: apiTemplate.content,
  };
}

// GET
export function useTemplates() {
  return useQuery({
    queryKey: ["templates"],
    queryFn: () =>
      api.get("/api/oficio-templates").then((res) => {
        const data = res.data.data ?? res.data;
        return data.map(adaptTemplate);
      }),
  });
}

// POST
export function useAddTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (template: { title: string; content: string }) =>
      api.post("/api/oficio-templates", {
        name: template.title,
        content: template.content,
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["templates"] }),
  });
}

// PUT
export function useUpdateTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      title,
      content,
    }: {
      id: number;
      title: string;
      content: string;
    }) => api.put(`/api/oficio-templates/${id}`, { name: title, content }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["templates"] }),
  });
}
