import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { NavBar } from './components/NavBar'
import { Login } from './pages/Login'
import { Scanner } from './pages/Scanner'
import { MaterialForm } from './pages/MaterialForm'
import { Listado } from './pages/Listado'
import { isSupabaseConfigured } from './lib/supabase'

function SetupNeeded() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Falta configurar Supabase</h1>
        <p className="auth-subtitle">
          Copia <code>.env.example</code> a <code>.env</code>, pega tu URL y anon key de Supabase (Project
          Settings → API) y reinicia <code>npm run dev</code>. Revisa el README para el paso a paso completo.
        </p>
      </div>
    </div>
  )
}

export default function App() {
  if (!isSupabaseConfigured) return <SetupNeeded />

  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <NavBar />
          <main className="app-main">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/scanner"
                element={
                  <ProtectedRoute>
                    <Scanner />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/material/:codigo"
                element={
                  <ProtectedRoute>
                    <MaterialForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/listado"
                element={
                  <ProtectedRoute>
                    <Listado />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/scanner" replace />} />
            </Routes>
          </main>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  )
}
