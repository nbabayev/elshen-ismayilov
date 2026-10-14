import {
  ContactMessage,
  ConversationSummary,
  createContact,
  deleteConversations,
  getConversations,
  getThread,
  getUnreadCount,
  markThreadRead,
  replyToContact,
} from "@/app/services/contacts.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type ConversationsResponse = { success: boolean; data: ConversationSummary[] };
type ThreadResponse = { success: boolean; data: ContactMessage[] };
type UnreadResponse = { success: boolean; count: number };

const cacheOpts = {
  staleTime: Infinity,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  retryOnMount: false,
} as const;

export const useUnreadMessages = (enabled = true) =>
  useQuery({
    queryKey: ["contacts", "unread"],
    queryFn: getUnreadCount,
    enabled,
    ...cacheOpts,
    // badge üçün arada bir yenilə
    staleTime: 30_000,
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
  });

export const useConversations = (search?: string) =>
  useQuery({
    queryKey: ["contacts", "conversations", search],
    queryFn: () => getConversations(search),
    ...cacheOpts,
  });

export const useThread = (email: string | null) =>
  useQuery({
    queryKey: ["contacts", "thread", email],
    queryFn: () => getThread(email!),
    enabled: Boolean(email),
    ...cacheOpts,
  });

export const useMarkThreadRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (email: string) => markThreadRead(email),
    onSuccess: (_res, email) => {
      const normalized = email.toLowerCase();

      // unread badge
      queryClient.setQueryData<UnreadResponse>(
        ["contacts", "unread"],
        (old) => {
          if (!old) return old;
          const conversationsQueries = queryClient.getQueriesData<ConversationsResponse>({
            queryKey: ["contacts", "conversations"],
          });
          let removed = 0;
          for (const [, data] of conversationsQueries) {
            const match = data?.data?.find(
              (c) => c.email.toLowerCase() === normalized
            );
            if (match) {
              removed = match.unreadCount;
              break;
            }
          }
          return {
            ...old,
            count: Math.max(0, Number(old.count || 0) - removed),
          };
        }
      );

      // conversation list unread → 0
      queryClient.setQueriesData<ConversationsResponse>(
        { queryKey: ["contacts", "conversations"] },
        (old) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.map((c) =>
              c.email.toLowerCase() === normalized
                ? { ...c, unreadCount: 0 }
                : c
            ),
          };
        }
      );

      // thread messages isRead
      queryClient.setQueryData<ThreadResponse>(
        ["contacts", "thread", email],
        (old) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.map((m) => ({ ...m, isRead: true })),
          };
        }
      );
    },
  });
};

export const useReplyContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, message }: { email: string; message: string }) =>
      replyToContact(email, message),
    onSuccess: (res, { email }) => {
      if (!res?.success || !res.data) return;

      const msg = res.data as ContactMessage;

      queryClient.setQueryData<ThreadResponse>(
        ["contacts", "thread", email],
        (old) => {
          const prev = old?.data || [];
          return { success: true, data: [...prev, msg] };
        }
      );

      queryClient.setQueriesData<ConversationsResponse>(
        { queryKey: ["contacts", "conversations"] },
        (old) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.map((c) =>
              c.email.toLowerCase() === email.toLowerCase()
                ? {
                    ...c,
                    lastMessage: msg.message,
                    lastDate: msg.createdDate || new Date().toISOString(),
                    isOwnLast: true,
                  }
                : c
            ),
          };
        }
      );
    },
  });
};

export const useCreateContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts", "conversations"] });
      queryClient.invalidateQueries({ queryKey: ["contacts", "unread"] });
    },
  });
};

export const useDeleteConversations = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (emails: string[]) => deleteConversations(emails),
    onSuccess: (_res, emails) => {
      const set = new Set(emails.map((e) => e.toLowerCase()));

      queryClient.setQueriesData<ConversationsResponse>(
        { queryKey: ["contacts", "conversations"] },
        (old) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.filter((c) => !set.has(c.email.toLowerCase())),
          };
        }
      );

      for (const email of emails) {
        queryClient.removeQueries({
          queryKey: ["contacts", "thread", email],
        });
      }

      queryClient.invalidateQueries({ queryKey: ["contacts", "unread"] });
    },
  });
};
