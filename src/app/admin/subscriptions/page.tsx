"use client";

import { useEffect, useState } from "react";
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CInputGroup,
  CRow,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilMagnifyingGlass, cilTrash } from "@coreui/icons";
import { useSnackbar } from "notistack";
import {
  useDeleteSubscription,
  useSubscriptions,
} from "@/app/hooks/useSubs";
import Pagination from "@/app/admin/components/Pagination";

interface Subscriber {
  id: number;
  email: string;
  isActive: boolean;
  isVerified: boolean;
  createdDate: string;
  lastUpdate: string;
}

export default function SubscriptionPage() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const limit = 10;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data, isLoading, isError } = useSubscriptions({
    page,
    limit,
    search: debouncedSearch || undefined,
  });
  const subscribers: Subscriber[] = data?.data || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);
  const deleteMutation = useDeleteSubscription();
  const { enqueueSnackbar } = useSnackbar();

  const handleDelete = (id: number) => {
    if (!confirm("Abunəçini silmək istədiyinizə əminsiniz?")) return;

    deleteMutation.mutate(id, {
      onSuccess: () =>
        enqueueSnackbar("Abunəçi uğurla silindi!", { variant: "success" }),
      onError: (error: any) =>
        enqueueSnackbar("Xəta baş verdi: " + (error?.message || ""), {
          variant: "error",
        }),
    });
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center p-5">
        <CSpinner color="primary" />
      </div>
    );
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <strong>Abunəçilər</strong>
            <span className="text-body-secondary">Cəmi: {total}</span>
          </CCardHeader>
          <CCardBody>
            <CInputGroup className="mb-3">
              <CFormInput
                type="search"
                placeholder="Email ünvanına görə axtar..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
              <CButton color="secondary" variant="outline">
                <CIcon icon={cilMagnifyingGlass} />
              </CButton>
              {(searchQuery || debouncedSearch) && (
                <CButton
                  color="secondary"
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setDebouncedSearch("");
                    setPage(1);
                  }}
                >
                  Təmizlə
                </CButton>
              )}
            </CInputGroup>

            {isError ? (
              <p className="text-center text-danger">
                Abunəçilər yüklənərkən xəta baş verdi.
              </p>
            ) : (
              <>
                <CTable hover responsive align="middle">
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell scope="col">#</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                      <CTableHeaderCell scope="col">
                        Təsdiq vəziyyəti
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col">
                        Aktivlik
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col">
                        Abunə tarixi
                      </CTableHeaderCell>
                      <CTableHeaderCell scope="col">
                        Əməliyyatlar
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {subscribers.map((subscriber, index) => (
                      <CTableRow key={subscriber.id}>
                        <CTableHeaderCell scope="row">
                          {(page - 1) * limit + index + 1}
                        </CTableHeaderCell>
                        <CTableDataCell>{subscriber.email}</CTableDataCell>
                        <CTableDataCell>
                          <CBadge
                            color={
                              subscriber.isVerified ? "success" : "warning"
                            }
                          >
                            {subscriber.isVerified
                              ? "Təsdiqlənib"
                              : "Təsdiqlənməyib"}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge
                            color={subscriber.isActive ? "success" : "secondary"}
                          >
                            {subscriber.isActive ? "Aktiv" : "Deaktiv"}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell>
                          {subscriber.createdDate
                            ? new Date(
                                subscriber.createdDate
                              ).toLocaleDateString("az-AZ")
                            : "—"}
                        </CTableDataCell>
                        <CTableDataCell>
                          <CButton
                            color="danger"
                            size="sm"
                            onClick={() => handleDelete(subscriber.id)}
                            disabled={deleteMutation.isPending}
                            aria-label={`${subscriber.email} abunəçisini sil`}
                          >
                            <CIcon icon={cilTrash} />
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>

                {subscribers.length === 0 && (
                  <p className="text-center text-body-secondary">
                    Abunəçi tapılmadı.
                  </p>
                )}

                <Pagination
                  totalPages={totalPages}
                  currentPage={page}
                  setCurrentPage={setPage}
                />
              </>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
}
