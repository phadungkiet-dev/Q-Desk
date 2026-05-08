import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export interface Label {
  id: string;
  name: string;
  color: string;
}

export function useLabels() {
  return useQuery({
    queryKey: ["labels"],
    queryFn: async () => {
      const response = await api.get("/labels");
      return response.data.data as Label[];
    },
  });
}
