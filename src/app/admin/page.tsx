"use client";

import React from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CWidgetStatsF,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilMediaPlay, cilNotes, cilBook, cilImage } from "@coreui/icons";

export default function AdminDashboard() {
  return (
    <>
      <CRow className="mb-4">
        <CCol sm={6} lg={3}>
          <CWidgetStatsF
            className="mb-4"
            color="primary"
            icon={<CIcon icon={cilMediaPlay} height={24} />}
            value="26"
            title="Videolar"
          />
        </CCol>
        <CCol sm={6} lg={3}>
          <CWidgetStatsF
            className="mb-4"
            color="info"
            icon={<CIcon icon={cilNotes} height={24} />}
            value="12"
            title="Məqalələr"
          />
        </CCol>
        <CCol sm={6} lg={3}>
          <CWidgetStatsF
            className="mb-4"
            color="warning"
            icon={<CIcon icon={cilBook} height={24} />}
            value="8"
            title="Kitablar"
          />
        </CCol>
        <CCol sm={6} lg={3}>
          <CWidgetStatsF
            className="mb-4"
            color="danger"
            icon={<CIcon icon={cilImage} height={24} />}
            value="45"
            title="Qalereya"
          />
        </CCol>
      </CRow>

      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Xoş gəlmisiniz!</strong>
            </CCardHeader>
            <CCardBody>
              <p>
                Admin panelinizə xoş gəlmisiniz. Sol menyudan idarəetmə
                bölmələrinə keçə bilərsiniz.
              </p>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
}
