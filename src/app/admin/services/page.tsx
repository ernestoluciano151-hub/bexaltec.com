'use client'
import { EmptyState, PageHeader } from '@/components/ui/shared'

export default function AdminServicesPage() {
  return (
    <div>
      <PageHeader
        supra="CRM Admin"
        title="Gestão de Serviços"
        sub="Serviços e contratos de manutenção"
        action={
          <button className="btn-primary" style={{ fontSize: 13 }} disabled>
            + Novo Serviço
          </button>
        }
      />
      <EmptyState
        ico="🛠️"
        title="Módulo em desenvolvimento"
        sub="A gestão de serviços estará disponível em breve. Os dados serão carregados a partir da base de dados."
      />
    </div>
  )
}
