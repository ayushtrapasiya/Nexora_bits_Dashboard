import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Router from './Router/Router.jsx'
import { AppProvider } from './Context/AppContext.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Provider } from 'react-redux'
import store from './Store/store.js'


createRoot(document.getElementById('root')).render(
   <Provider store={store}>
  <AppProvider>
    <Router />
  </AppProvider>
  </Provider>
)