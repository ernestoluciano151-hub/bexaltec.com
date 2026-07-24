'use client'
import { useState } from 'react'

const initialMessages = [
  { from: 'support', name: 'Suporte Bexaltec', text: 'Olá! Como posso ajudar hoje?', time: '09:00' },
  { from: 'user', name: 'Você', text: 'Bom dia! Queria saber o estado da reparação do meu iPhone.', time: '09:02' },
  { from: 'support', name: 'Suporte Bexaltec', text: 'Claro! Referência LAB-2025-0042. O seu iPhone está em fase de diagnóstico da placa. Estimamos concluir em 2 dias úteis.', time: '09:03' },
]

export default function ChatPage() {
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')

  const send = () => {
    if (!input.trim()) return
    setMessages(m => [...m, { from: 'user', name: 'Você', text: input, time: new Date().toLocaleTimeString('pt', { hour: '2-digit', minute: '2-digit' }) }])
    setInput('')
  }

  return (
    <div>
      <h1 className="font-rajdhani font-black" style={{ fontSize: 28, letterSpacing: 1, color: 'var(--text)', marginBottom: '0.5rem' }}>Chat de Suporte</h1>
      <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: '1.5rem' }}>Comunicação direta com a equipa técnica Bexaltec.</p>
      <div className="card-base" style={{ display: 'flex', flexDirection: 'column', height: 500 }}>
        <div style={{ flex: 1, padding: '1.25rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: m.from === 'user' ? 'row-reverse' : 'row', gap: '0.75rem', alignItems: 'flex-end' }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: m.from === 'user' ? 'rgba(0,230,118,0.15)' : 'rgba(66,165,245,0.15)', border: m.from === 'user' ? '1px solid rgba(0,230,118,0.3)' : '1px solid rgba(66,165,245,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: m.from === 'user' ? 'var(--green)' : '#42A5F5', flexShrink: 0 }}>
                {m.name.charAt(0)}
              </div>
              <div style={{ maxWidth: '70%' }}>
                <div style={{ fontSize: 10, color: 'var(--slate)', marginBottom: '0.25rem', textAlign: m.from === 'user' ? 'right' : 'left' }}>{m.name} · {m.time}</div>
                <div style={{ padding: '0.75rem 1rem', borderRadius: 12, fontSize: 13, lineHeight: 1.6, background: m.from === 'user' ? 'rgba(0,230,118,0.08)' : 'var(--card)', border: m.from === 'user' ? '1px solid rgba(0,230,118,0.2)' : '1px solid var(--border)', color: 'var(--silver2)' }}>
                  {m.text}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: '1rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.75rem' }}>
          <input
            className="input-field"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Escreva uma mensagem..."
            style={{ flex: 1 }}
          />
          <button onClick={send} className="btn-primary" style={{ padding: '10px 20px', fontSize: 13 }}>Enviar</button>
        </div>
      </div>
    </div>
  )
}
