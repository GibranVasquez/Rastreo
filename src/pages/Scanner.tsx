import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BrowserMultiFormatReader } from '@zxing/browser'
import type { IScannerControls } from '@zxing/browser'

export function Scanner() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const controlsRef = useRef<IScannerControls | null>(null)
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [manualCode, setManualCode] = useState('')

  useEffect(() => {
    const reader = new BrowserMultiFormatReader()
    let cancelled = false

    reader
      .decodeFromConstraints(
        { video: { facingMode: 'environment' } },
        videoRef.current!,
        (result, err) => {
          if (cancelled) return
          if (result) {
            const codigo = result.getText().trim()
            controlsRef.current?.stop()
            navigate(`/material/${encodeURIComponent(codigo)}`)
          } else if (err && err.name !== 'NotFoundException') {
            // ruido normal de frames sin código detectado: se ignora
          }
        },
      )
      .then((controls) => {
        if (cancelled) {
          controls.stop()
          return
        }
        controlsRef.current = controls
      })
      .catch((e: Error) => {
        setError(
          'No se pudo acceder a la cámara: ' +
            e.message +
            '. Revisa los permisos del navegador (necesita HTTPS o localhost).',
        )
      })

    return () => {
      cancelled = true
      controlsRef.current?.stop()
    }
  }, [navigate])

  function goManual(e: React.FormEvent) {
    e.preventDefault()
    if (!manualCode.trim()) return
    controlsRef.current?.stop()
    navigate(`/material/${encodeURIComponent(manualCode.trim())}`)
  }

  return (
    <div className="scanner-page">
      {error ? (
        <div className="card state-card error-card">
          <div className="state-icon error">!</div>
          <h3 style={{ color: 'var(--danger)' }}>Cámara bloqueada</h3>
          <p>{error}</p>
        </div>
      ) : (
        <>
          <h2>Escaneando…</h2>
          <p className="hint">Apunta la cámara al QR o código de barras</p>

          <div className="video-frame">
            <video ref={videoRef} muted playsInline autoPlay />
            <div className="scan-mask" />
            <div className="scan-frame">
              <span />
              <div className="scan-line" />
            </div>
          </div>
        </>
      )}

      <div className="manual-label">¿NO LEE? ESCRÍBELO</div>
      <form className="manual-entry" onSubmit={goManual}>
        <input
          placeholder="Escribe el código a mano…"
          value={manualCode}
          onChange={(e) => setManualCode(e.target.value)}
        />
        <button type="submit">→</button>
      </form>
    </div>
  )
}
