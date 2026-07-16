export interface Material {
  id: string
  codigo: string
  nombre: string
  cantidad: number
  unidad: string | null
  ubicacion: string | null
  categoria: string | null
  notas: string | null
  registrado_por: string | null
  created_at: string
  updated_at: string
}

export type MaterialInput = Omit<Material, 'id' | 'created_at' | 'updated_at'>
