import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} from "@/app/services/books.api";

export const useBooks = ({ page = 1, limit = 10 } = {}) => {
  return useQuery({
    queryKey: ["books", page, limit],
    queryFn: () => getBooks(page, limit),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const useBookById = (id, enabled = true) => {
  return useQuery({
    queryKey: ["book", id],
    queryFn: () => getBookById(id),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: enabled && !!id,
  });
};

export const useCreateBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
};

export const useUpdateBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateBook(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["book"] });
    },
  });
};

export const useDeleteBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
};
