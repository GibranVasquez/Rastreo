import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import type { Material } from '../types'

function saludo() {
  const hora = new Date().getHours()
  if (hora < 12) return 'Buenos días'
  if (hora < 19) return 'Buenas tardes'
  return 'Buenas noches'
}

export function Dashboard() {
  const { session } = useAuth()
  const [loading, setLoading] = useState(true)
  const [totalMateriales, setTotalMateriales] = useState(0)
  const [totalAlmacenes, setTotalAlmacenes] = useState(0)
  const [categorias, setCategorias] = useState(0)
  const [nuevosSemana, setNuevosSemana] = useState(0)
  const [recientes, setRecientes] = useState<Material[]>([])

  useEffect(() => {
    let cancelled = false

    async function load() {
      const haceUnaSemana = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

      const [materialesCount, almacenesCount, semanaCount, categoriasData, recientesData] = await Promise.all([
        supabase.from('materiales').select('*', { count: 'exact', head: true }),
        supabase.from('almacenes').select('*', { count: 'exact', head: true }),
        supabase.from('materiales').select('*', { count: 'exact', head: true }).gte('created_at', haceUnaSemana),
        supabase.from('materiales').select('categoria'),
        supabase.from('materiales').select('*').order('created_at', { ascending: false }).limit(5),
      ])

      if (cancelled) return

      setTotalMateriales(materialesCount.count ?? 0)
      setTotalAlmacenes(almacenesCount.count ?? 0)
      setNuevosSemana(semanaCount.count ?? 0)
      setCategorias(new Set((categoriasData.data ?? []).map((m) => m.categoria).filter(Boolean)).size)
      setRecientes(recientesData.data ?? [])
      setLoading(false)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const nombreUsuario = session?.user.email?.split('@')[0] ?? ''

  return (
    <div className="dashboard-page">
      <div className="dashboard-hero">
        <p className="dashboard-eyebrow">{saludo()}</p>
        <h1>Hola, {nombreUsuario}</h1>
        <p className="hint">Este es el estado de tu inventario hoy.</p>
      </div>

      <div className="stat-grid">
        <div className="card stat-card">
          <span className="stat-value">{loading ? '—' : totalMateriales}</span>
          <span className="stat-label">Materiales</span>
        </div>
        <div className="card stat-card">
          <span className="stat-value">{loading ? '—' : totalAlmacenes}</span>
          <span className="stat-label">Almacenes</span>
        </div>
        <div className="card stat-card">
          <span className="stat-value">{loading ? '—' : categorias}</span>
          <span className="stat-label">Categorías</span>
        </div>
        <div className="card stat-card">
          <span className="stat-value">{loading ? '—' : nuevosSemana}</span>
          <span className="stat-label">Nuevos (7 días)</span>
        </div>
      </div>

      <div className="quick-actions">
        <Link to="/scanner" className="quick-action quick-action-primary">
          <span className="quick-action-icon">⊹</span>
          <span>
            <b>Escanear</b>
            <small>Registra un material nuevo</small>
          </span>
        </Link>
        <Link to="/listado" className="quick-action">
          <span className="quick-action-icon">☰</span>
          <span>
            <b>Listado</b>
            <small>Ver y exportar inventario</small>
          </span>
        </Link>
        <Link to="/almacenes" className="quick-action">
          <span className="quick-action-icon">▣</span>
          <span>
            <b>Almacenes</b>
            <small>Gestionar ubicaciones</small>
          </span>
        </Link>
      </div>

      <div className="dashboard-recent">
        <h3>Últimos registrados</h3>
        {loading ? (
          <p className="hint">Cargando…</p>
        ) : recientes.length === 0 ? (
          <p className="hint">Aún no hay materiales — escanea el primero.</p>
        ) : (
          <div className="recent-list">
            {recientes.map((m) => (
              <Link to={`/material/${encodeURIComponent(m.codigo)}`} className="recent-item" key={m.id}>
                <span className="mono recent-item-code">{m.codigo}</span>
                <span className="recent-item-name">{m.nombre}</span>
                <span className="recent-item-meta">
                  {m.cantidad} {m.unidad}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
