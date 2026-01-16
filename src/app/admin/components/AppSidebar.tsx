'use client'

import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Link from 'next/link'
import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import { AppSidebarNav } from './AppSidebarNav'
import navigation from '../_nav'
import { AdminState } from '../store'

const AppSidebar: React.FC = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state: AdminState) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state: AdminState) => state.sidebarShow)

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible: boolean) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand as={Link} href="/admin" className="m-auto text-decoration-none">
          <span className="sidebar-brand-full fs-5 fw-semibold text-white">
            Admin Panel
          </span>
          <span className="sidebar-brand-narrow fs-5 fw-semibold text-white">
            AP
          </span>
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>
      <AppSidebarNav items={navigation} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
