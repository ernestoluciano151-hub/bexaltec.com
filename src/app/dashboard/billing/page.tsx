'use client'
import { mockInvoices } from '@/lib/mock-data'
import type { InvoiceStatus } from '@/lib/mock-data'

const statusBadge: Record<InvoiceStatus, string> = { paid: 'badge-green', pending: 'badge-yellow', overdue: 'badge-red' }
const statusLabel: Record<InvoiceStatus, string> = { paid: 'Pago', pending: 'Pendente', overdue: 'Em Atraso' }

export default function BillingPage() {
  const myInvoices = mockInvoices.filter(i => i.clientId === 'c1')
  const totalPaid = myInvoices.filter(i => i.status === 'paid').reduce((a, i) => a + i.amount, 0)
  const totalPending = myInvoices.filter(i => i.status === 'pending').reduce((a, i) => a + i.amount, 0)
  const totalOverdue = myInvoices.filter(i => i.status === 'overdue').reduce((a, i) => a + i.amount, 0)

  const summaryCards = [
    { label: 'Total Pago', value: totalPaid, color: '#00E676', ico: '✅' },
    { label: 'Pendente', value: totalPending, color: '#FFC107', ico: '⏳' },
    { label: 'Em Atraso', value: totalOverdue, color: '#EF5350', ico: '⚠️' },
  ]

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontSize: 11, color: 'var(--slate)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Portal do Cliente</div>
        <h1 className="font-rajdhani font-black" style={{ fontSize: 28, color: 'var(--text)', letterSpacing: 1 }}>Faturação</h1>
        <p style={{ fontSize: 13, color: 'var(--slate)', marginTop: 4 }}>{myInvoices.length} faturas · Histórico completo</p>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {summaryCards.map((c, i) => (
          <div key={i} className="card-base" style={{ padding: '1.25rem', textAlign: 'center' }}>
            <div style={{ fontSize: 24, marginBottom: '0.5rem' }}>{c.ico}</div>
            <div style={{ fontSize: 10, color: 'var(--slate)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: '0.35rem' }}>{c.label}</div>
            <div className="font-rajdhani font-black" style={{ fontSize: 24, color: c.color, lineHeight: 1 }}>
              {c.value.toLocaleString('pt-AO')}
            </div>
            <div style={{ fontSize: 10, color: 'var(--slate)', marginTop: 2 }}>Kwanzas (AOA)</div>
          </div>
        ))}
      </div>

      {/* Invoices table */}
      <div className="card-base" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
          <div className="font-rajdhani font-semibold" style={{ fontSize: 16, color: 'var(--text)' }}>Histórico de Faturas</div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Referência</th>
                <th>Serviço</th>
                <th>Valor</th>
                <th>Emissão</th>
                <th>Vencimento</th>
                <th>Estado</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {myInvoices.map(invoice => (
                <tr key={invoice.id}>
                  <td>
                    <span className="font-mono" style={{ fontSize: 12, color: 'var(--green2)' }}>{invoice.ref}</span>
                  </td>
                  <td style={{ color: 'var(--silver2)', fontSize: 12 }}>{invoice.service}</td>
                  <td>
                    <span className="font-rajdhani font-semibold" style={{ color: 'var(--text)', fontSize: 13 }}>
                      {invoice.amount.toLocaleString('pt-AO')} <span style={{ fontSize: 10, color: 'var(--slate)' }}>Kz</span>
                    </span>
                  </td>
                  <td style={{ fontSize: 12 }}>{new Date(invoice.issueDate).toLocaleDateString('pt-AO')}</td>
                  <td style={{ fontSize: 12, color: invoice.status === 'overdue' ? '#EF5350' : 'var(--text2)' }}>
                    {new Date(invoice.dueDate).toLocaleDateString('pt-AO')}
                  </td>
                  <td><span className={`badge ${statusBadge[invoice.status]}`}>{statusLabel[invoice.status]}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button style={{ fontSize: 11, padding: '3px 10px', borderRadius: 6, background: 'rgba(0,230,118,0.07)', border: '1px solid rgba(0,230,118,0.18)', color: 'var(--green2)', cursor: 'pointer' }}>
                        📥 PDF
                      </button>
                      {invoice.status === 'pending' && (
                        <button style={{ fontSize: 11, padding: '3px 10px', borderRadius: 6, background: 'rgba(66,165,245,0.07)', border: '1px solid rgba(66,165,245,0.2)', color: '#42A5F5', cursor: 'pointer' }}>
                          Pagar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment info */}
      <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="card-base" style={{ padding: '1.25rem' }}>
          <div className="font-rajdhani font-semibold" style={{ fontSize: 15, color: 'var(--text)', marginBottom: '0.75rem' }}>💳 Formas de Pagamento</div>
          <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 2 }}>
            • Transferência Bancária (BAI, BFA, BPC)<br/>
            • Multicaixa Express<br/>
            • PayByLink (cartão Visa/Mastercard)<br/>
            • Dinheiro (escritório)
          </div>
        </div>
        <div className="card-base" style={{ padding: '1.25rem' }}>
          <div className="font-rajdhani font-semibold" style={{ fontSize: 15, color: 'var(--text)', marginBottom: '0.75rem' }}>📞 Suporte de Faturação</div>
          <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 2 }}>
            📧 faturacao@bexaltec.ao<br/>
            📞 +244 9XX XXX XXX<br/>
            💬 WhatsApp Business<br/>
            🕐 Seg–Sex 08h–17h
          </div>
        </div>
      </div>
    </div>
  )
}
