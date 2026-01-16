import { legacy_createStore as createStore } from 'redux'

export interface AdminState {
  sidebarShow: boolean
  sidebarUnfoldable: boolean
  theme: 'light' | 'dark' | 'auto'
}

interface SetAction {
  type: 'set'
  sidebarShow?: boolean
  sidebarUnfoldable?: boolean
  theme?: 'light' | 'dark' | 'auto'
}

type AdminAction = SetAction

const initialState: AdminState = {
  sidebarShow: true,
  sidebarUnfoldable: false,
  theme: 'light',
}

const changeState = (state = initialState, action: AdminAction): AdminState => {
  switch (action.type) {
    case 'set':
      const { type, ...rest } = action
      return { ...state, ...rest }
    default:
      return state
  }
}

const store = createStore(changeState)
export default store
