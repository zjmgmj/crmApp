import { NavigationActions } from 'react-navigation'

let _navigate

function setTopLevelNavigator (navRef) {
  _navigate = navRef
}

function navigate (routeName, params) {
  _navigate.dispatch(NavigationActions.navigate({routeName, params}))
}

export default {
  navigate,
  setTopLevelNavigator
}