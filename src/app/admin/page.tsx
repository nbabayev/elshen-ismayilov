"use client";

import React from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CWidgetStatsA,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilArrowTop,
  cilMediaPlay,
  cilNotes,
  cilBook,
  cilImage,
} from "@coreui/icons";

export default function AdminDashboard() {
  return (
    <>
      <CRow className="mb-4">
        <CCol sm={6} lg={3}>
          <CWidgetStatsA
            className="mb-4"
            color="primary"
            value="26"
            title="Videolar"
            chart={<CIcon icon={cilMediaPlay} height={36} />}
          />
        </CCol>
        <CCol sm={6} lg={3}>
          <CWidgetStatsA
            className="mb-4"
            color="info"
            value="12"
            title="Meqaleler"
            chart={<CIcon icon={cilNotes} height={36} />}
          />
        </CCol>
        <CCol sm={6} lg={3}>
          <CWidgetStatsA
            className="mb-4"
            color="warning"
            value="8"
            title="Kitablar"
            chart={<CIcon icon={cilBook} height={36} />}
          />
        </CCol>
        <CCol sm={6} lg={3}>
          <CWidgetStatsA
            className="mb-4"
            color="danger"
            value="45"
            title="Qalereya"
            chart={<CIcon icon={cilImage} height={36} />}
          />
        </CCol>
      </CRow>

      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Xos gelmisiniz!</strong>
            </CCardHeader>
            <CCardBody>
              <p>
                Admin panelinize xos gelmisiniz. Sol menuden idareetme
                bolmelerine kece bilersiniz.
              </p>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
}
