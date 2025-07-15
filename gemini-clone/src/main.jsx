import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ContextProvider from './context/context.jsx'

import 'prismjs/themes/prism-okaidia.css'; // A dark theme
// import 'prismjs/themes/prism.css'; // Default light theme
// import 'prismjs/themes/prism-solarizedlight.css'; // Another light theme

import Prism from 'prismjs';

import 'prismjs/components/prism-python'; // For Python code
import 'prismjs/components/prism-javascript'; // For JavaScript code
import 'prismjs/components/prism-markup'; // For HTML/XML
import 'prismjs/components/prism-css'; // For CSS

createRoot(document.getElementById('root')).render(
  <ContextProvider>
    <App />
  </ContextProvider>
)
