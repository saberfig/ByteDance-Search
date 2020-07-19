import React from 'react'
import { Route, BrowserRouter } from 'react-router-dom'

import Home from './components/Home'

import './App.css'

const App = () => {
  return (
    <BrowserRouter>
      <script defer src="https://use.fontawesome.com/releases/v5.0.6/js/all.js"></script>
      <Route path='/' exact render={() => <Home />} />
    </BrowserRouter>
  )
}

export default App
