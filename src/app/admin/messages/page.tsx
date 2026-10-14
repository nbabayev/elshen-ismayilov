"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  CBadge,
  CButton,
  CFormCheck,
  CFormInput,
  CFormTextarea,
  CSpinner,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilSend, cilTrash } from "@coreui/icons";
import { useSnackbar } from "notistack";
import {
  ConversationSummary,
  ContactMessage,
} from "@/app/services/contacts.api";
import {
  useConversations,
  useDeleteConversations,
  useMarkThreadRead,
  useReplyContact,
  useThread,
} from "@/app/hooks/useContacts";

const MONTHS_AZ = [
  "Yanvar",
  "Fevral",
  "Mart",
  "Aprel",
  "May",
  "İyun",
  "İyul",
  "Avqust",
  "Sentyabr",
  "Oktyabr",
  "Noyabr",
  "Dekabr",
];

function formatDate(value?: string | null) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${d.getDate()} ${MONTHS_AZ[d.getMonth()]} ${d.getFullYear()}, ${hours}:${minutes}`;
}

function formatPhone(phone?: string | null) {
  if (!phone) return null;
  const trimmed = phone.trim();
  if (!trimmed) return null;
  // real nömrədə ən azı bir rəqəm olmalı; "Daxil edilməyib" və oxşar mətnlər gizlədilir
  if (!/\d/.test(trimmed)) return null;
  return trimmed;
}

export default function MessagesPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [checkedEmails, setCheckedEmails] = useState<string[]>([]);
  const [replyText, setReplyText] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const markedReadRef = useRef<Set<string>>(new Set());
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 350);
    return () => clearTimeout(timer);
  }, [search]);

  const { data: conversationsData, isLoading: listLoading } = useConversations(
    debouncedSearch || undefined
  );
  const conversations: ConversationSummary[] = conversationsData?.data || [];

  const { data: threadData, isLoading: threadLoading } =
    useThread(selectedEmail);
  const messages: ContactMessage[] = threadData?.data || [];

  const markRead = useMarkThreadRead();
  const replyMutation = useReplyContact();
  const deleteMutation = useDeleteConversations();

  const selectedConversation = useMemo(
    () => conversations.find((c) => c.email === selectedEmail) || null,
    [conversations, selectedEmail]
  );
  const selectedPhone = formatPhone(selectedConversation?.phone);

  const allChecked =
    conversations.length > 0 &&
    conversations.every((c) => checkedEmails.includes(c.email));

  useEffect(() => {
    if (!selectedEmail) return;
    if (markedReadRef.current.has(selectedEmail)) return;

    const hasUnread = conversations.some(
      (c) => c.email === selectedEmail && c.unreadCount > 0
    );
    if (!hasUnread) return;

    markedReadRef.current.add(selectedEmail);
    markRead.mutate(selectedEmail);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEmail, conversations]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, selectedEmail]);

  const handleSelect = (email: string) => {
    setSelectedEmail(email);
    setReplyText("");
  };

  const toggleChecked = (email: string) => {
    setCheckedEmails((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  const toggleAll = () => {
    if (allChecked) {
      setCheckedEmails([]);
    } else {
      setCheckedEmails(conversations.map((c) => c.email));
    }
  };

  const handleDeleteSelected = () => {
    if (checkedEmails.length === 0) return;
    if (
      !confirm(`${checkedEmails.length} söhbəti silmək istədiyinizə əminsiniz?`)
    ) {
      return;
    }

    deleteMutation.mutate(checkedEmails, {
      onSuccess: (res) => {
        if (res?.success) {
          if (selectedEmail && checkedEmails.includes(selectedEmail)) {
            setSelectedEmail(null);
          }
          setCheckedEmails([]);
          enqueueSnackbar("Söhbətlər silindi", { variant: "success" });
        } else {
          enqueueSnackbar(res?.message || "Xəta baş verdi", {
            variant: "error",
          });
        }
      },
      onError: (error: Error) =>
        enqueueSnackbar("Xəta: " + (error?.message || ""), {
          variant: "error",
        }),
    });
  };

  const handleReply = () => {
    if (!selectedEmail || !replyText.trim()) return;

    replyMutation.mutate(
      { email: selectedEmail, message: replyText.trim() },
      {
        onSuccess: (res) => {
          if (res?.success) {
            setReplyText("");
            enqueueSnackbar("Cavab göndərildi", { variant: "success" });
          } else {
            enqueueSnackbar(res?.message || "Xəta baş verdi", {
              variant: "error",
            });
          }
        },
        onError: (error: Error) =>
          enqueueSnackbar("Xəta: " + (error?.message || ""), {
            variant: "error",
          }),
      }
    );
  };

  return (
    <div className="messages-page">
      <div className="d-flex justify-content-between align-items-center mb-3 gap-2 flex-wrap">
        <h4 className="mb-0 text-body">Mesajlar</h4>
        <span className="text-body-secondary small">
          {conversations.length} söhbət
        </span>
      </div>

      <div className="messages-layout border rounded overflow-hidden">
        <aside className="messages-list border-end">
          <div className="p-3 border-bottom d-flex flex-column gap-2">
            <CFormInput
              type="search"
              placeholder="Axtar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {conversations.length > 0 && (
              <div className="d-flex justify-content-between align-items-center gap-2">
                <CFormCheck
                  id="check-all-chats"
                  label="Hamısını seç"
                  checked={allChecked}
                  onChange={toggleAll}
                />
                {checkedEmails.length > 0 && (
                  <CButton
                    color="danger"
                    variant="outline"
                    size="sm"
                    className="flex-shrink-0"
                    disabled={deleteMutation.isPending}
                    onClick={handleDeleteSelected}
                  >
                    {deleteMutation.isPending ? (
                      <CSpinner size="sm" />
                    ) : (
                      <>
                        <CIcon icon={cilTrash} className="me-1" />
                        Sil ({checkedEmails.length})
                      </>
                    )}
                  </CButton>
                )}
              </div>
            )}
          </div>

          <div className="messages-list-scroll">
            {listLoading ? (
              <div className="d-flex justify-content-center py-5">
                <CSpinner color="primary" />
              </div>
            ) : conversations.length === 0 ? (
              <div className="text-center text-body-secondary py-5 px-3">
                Mesaj yoxdur
              </div>
            ) : (
              conversations.map((item) => {
                const active = item.email === selectedEmail;
                const checked = checkedEmails.includes(item.email);
                return (
                  <div
                    key={item.email}
                    className={`messages-list-item d-flex gap-2 align-items-start border-bottom ${
                      active ? "active" : ""
                    }`}
                  >
                    <CFormCheck
                      checked={checked}
                      onChange={() => toggleChecked(item.email)}
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`${item.name} seç`}
                    />
                    <button
                      type="button"
                      className="messages-list-item-btn flex-grow-1 text-start border-0 bg-transparent p-0 min-w-0"
                      onClick={() => handleSelect(item.email)}
                    >
                      <div className="d-flex justify-content-between gap-2">
                        <strong className="text-truncate">
                          {item.name} {item.lastName}
                        </strong>
                        {item.unreadCount > 0 && (
                          <CBadge color="danger" shape="rounded-pill">
                            {item.unreadCount}
                          </CBadge>
                        )}
                      </div>
                      <div className="small text-body-secondary text-truncate">
                        {item.email}
                      </div>
                      <div className="small text-truncate mt-1">
                        {item.isOwnLast ? "Siz: " : ""}
                        {item.lastMessage}
                      </div>
                      <div className="small text-body-secondary mt-1">
                        {formatDate(item.lastDate)}
                      </div>
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </aside>

        <section className="messages-chat d-flex flex-column">
          {!selectedEmail ? (
            <div className="flex-grow-1 d-flex align-items-center justify-content-center text-body-secondary">
              Söhbət seçin
            </div>
          ) : (
            <>
              <div className="p-3 border-bottom">
                <div className="fw-semibold">
                  {selectedConversation
                    ? `${selectedConversation.name} ${selectedConversation.lastName}`
                    : selectedEmail}
                </div>
                <div className="small text-body-secondary">
                  {selectedEmail}
                  {selectedPhone ? ` · ${selectedPhone}` : ""}
                </div>
              </div>

              <div className="messages-chat-body flex-grow-1 p-3">
                {threadLoading ? (
                  <div className="d-flex justify-content-center py-5">
                    <CSpinner color="primary" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-body-secondary py-5">
                    Mesaj yoxdur
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`messages-bubble-row ${
                        msg.isOwn ? "own" : "visitor"
                      }`}
                    >
                      <div
                        className={`messages-bubble ${
                          msg.isOwn ? "own" : "visitor"
                        }`}
                      >
                        <div className="messages-bubble-text">
                          {msg.message}
                        </div>
                        <div className="small opacity-75 mt-1">
                          {formatDate(msg.createdDate)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="p-3 border-top">
                <div className="d-flex gap-2 align-items-end">
                  <CFormTextarea
                    rows={2}
                    placeholder="Cavab yazın..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleReply();
                      }
                    }}
                  />
                  <CButton
                    color="primary"
                    disabled={!replyText.trim() || replyMutation.isPending}
                    onClick={handleReply}
                  >
                    {replyMutation.isPending ? (
                      <CSpinner size="sm" />
                    ) : (
                      <CIcon icon={cilSend} />
                    )}
                  </CButton>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
