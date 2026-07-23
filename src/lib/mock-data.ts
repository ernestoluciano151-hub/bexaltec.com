// ─── MOCK DATA ────────────────────────────────────────────────────────────────
// Substitua com dados reais do Supabase quando estiver pronto.

export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed'
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical'
export type ServiceStatus = 'active' | 'suspended' | 'expired'
export type InvoiceStatus = 'paid' | 'pending' | 'overdue'

export interface Client {
  id: string
  name: string
  company: string
  email: string
  phone: string
  province: string
  size: string
  joinedAt: string
  status: 'active' | 'inactive'
  services: number
  openTickets: number
  totalRevenue: number
}

export interface Ticket {
  id: string
  ref: string
  clientId: string
  clientName: string
  company: string
  subject: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  category: string
  createdAt: string
  updatedAt: string
  assignedTo?: string
}

export interface Service {
  id: string
  clientId: string
  clientName: string
  name: string
  category: string
  status: ServiceStatus
  startDate: string
  endDate: string
  monthlyValue: number
  description: string
}

export interface Invoice {
  id: string
  ref: string
  clientId: string
  service: string
  amount: number
  status: InvoiceStatus
  issueDate: string
  dueDate: string
  paidAt?: string
}

// ── Clients ────────────────────────────────────────────────────────────────────
export const mockClients: Client[] = [
  {
    id: 'c1', name: 'João Manuel Ferreira', company: 'Sonaref Industrial', email: 'joao@sonaref.ao',
    phone: '+244 923 456 789', province: 'Luanda', size: 'Grande (250+)',
    joinedAt: '2023-03-15', status: 'active', services: 3, openTickets: 1, totalRevenue: 4800000,
  },
  {
    id: 'c2', name: 'Ana Paula Teixeira', company: 'Grupo Aguilar & Associados', email: 'ana@aguilar.ao',
    phone: '+244 912 345 678', province: 'Luanda', size: 'Média (50–249)',
    joinedAt: '2023-07-22', status: 'active', services: 2, openTickets: 2, totalRevenue: 2100000,
  },
  {
    id: 'c3', name: 'Miguel António Cardoso', company: 'Benguela Distribuidora', email: 'miguel@bd.ao',
    phone: '+244 934 567 890', province: 'Benguela', size: 'Pequena (10–49)',
    joinedAt: '2024-01-10', status: 'active', services: 1, openTickets: 0, totalRevenue: 750000,
  },
  {
    id: 'c4', name: 'Fátima Neto Rodrigues', company: 'Escola Superior Técnica ESTT', email: 'fneto@estt.ao',
    phone: '+244 945 678 901', province: 'Huíla', size: 'Média (50–249)',
    joinedAt: '2023-11-05', status: 'active', services: 2, openTickets: 1, totalRevenue: 1900000,
  },
  {
    id: 'c5', name: 'Carlos Alberto Mendes', company: 'CAM Supermercados', email: 'carlos@cam.ao',
    phone: '+244 956 789 012', province: 'Luanda', size: 'Média (50–249)',
    joinedAt: '2024-04-18', status: 'inactive', services: 0, openTickets: 0, totalRevenue: 480000,
  },
]

// ── Tickets ────────────────────────────────────────────────────────────────────
export const mockTickets: Ticket[] = [
  {
    id: 't1', ref: 'BX-TKT-2026-0041', clientId: 'c1', clientName: 'João Ferreira',
    company: 'Sonaref Industrial', subject: 'Switch principal com falhas intermitentes',
    description: 'O switch Cisco Catalyst 2960 do rack principal apresenta quedas de conexão aleatórias afetando 30+ utilizadores.',
    status: 'in_progress', priority: 'high', category: 'Infra & Redes',
    createdAt: '2026-07-20T09:15:00Z', updatedAt: '2026-07-22T14:30:00Z', assignedTo: 'Técnico Pedro Alves',
  },
  {
    id: 't2', ref: 'BX-TKT-2026-0040', clientId: 'c2', clientName: 'Ana Teixeira',
    company: 'Grupo Aguilar', subject: 'Configuração VPN para colaboradores remotos',
    description: 'Necessitamos configurar acesso VPN seguro para 15 colaboradores em trabalho remoto.',
    status: 'open', priority: 'medium', category: 'Segurança',
    createdAt: '2026-07-21T11:00:00Z', updatedAt: '2026-07-21T11:00:00Z',
  },
  {
    id: 't3', ref: 'BX-TKT-2026-0039', clientId: 'c4', clientName: 'Fátima Neto',
    company: 'ESTT', subject: 'Atualização sistema gestão escolar',
    description: 'Pedido de atualização do módulo de matrículas para o novo ano letivo 2026/2027.',
    status: 'open', priority: 'medium', category: 'Software',
    createdAt: '2026-07-19T08:30:00Z', updatedAt: '2026-07-19T08:30:00Z',
  },
  {
    id: 't4', ref: 'BX-TKT-2026-0038', clientId: 'c2', clientName: 'Ana Teixeira',
    company: 'Grupo Aguilar', subject: 'Câmera IP sala de reuniões offline',
    description: 'Câmera Hikvision da sala de reuniões principal não aparece no NVR desde ontem.',
    status: 'resolved', priority: 'low', category: 'Segurança Eletr.',
    createdAt: '2026-07-18T15:00:00Z', updatedAt: '2026-07-21T10:00:00Z', assignedTo: 'Técnico Lucas Fonseca',
  },
  {
    id: 't5', ref: 'BX-TKT-2026-0037', clientId: 'c3', clientName: 'Miguel Cardoso',
    company: 'Benguela Distribuidora', subject: 'Instalação novo servidor NAS',
    description: 'Entregamos o equipamento, agendar visita técnica para instalação e configuração.',
    status: 'closed', priority: 'medium', category: 'Infra & Redes',
    createdAt: '2026-07-10T09:00:00Z', updatedAt: '2026-07-17T16:00:00Z', assignedTo: 'Técnico Pedro Alves',
  },
]

// ── Services ───────────────────────────────────────────────────────────────────
export const mockServices: Service[] = [
  {
    id: 's1', clientId: 'c1', clientName: 'Sonaref Industrial',
    name: 'Suporte de Infraestrutura TI', category: 'Infra & Redes',
    status: 'active', startDate: '2023-03-15', endDate: '2027-03-14',
    monthlyValue: 350000, description: 'Manutenção e suporte mensal da infraestrutura de rede (switches, routers, servidores).',
  },
  {
    id: 's2', clientId: 'c1', clientName: 'Sonaref Industrial',
    name: 'Sistema de Vigilância CCTV', category: 'Segurança Eletr.',
    status: 'active', startDate: '2023-06-01', endDate: '2026-05-31',
    monthlyValue: 80000, description: '24 câmeras Hikvision + NVR + monitoramento remoto.',
  },
  {
    id: 's3', clientId: 'c2', clientName: 'Grupo Aguilar',
    name: 'Hospedagem Website Corporativo', category: 'Web & Hosting',
    status: 'active', startDate: '2023-07-22', endDate: '2027-07-21',
    monthlyValue: 45000, description: 'Hospedagem VPS, domínio .ao, SSL, backups diários.',
  },
  {
    id: 's4', clientId: 'c4', clientName: 'ESTT',
    name: 'Sistema de Gestão Escolar', category: 'Software & Dev',
    status: 'active', startDate: '2023-11-05', endDate: '2026-11-04',
    monthlyValue: 120000, description: 'Licença + manutenção do sistema ERP escolar customizado.',
  },
]

// ── Invoices ───────────────────────────────────────────────────────────────────
export const mockInvoices: Invoice[] = [
  {
    id: 'i1', ref: 'FT 2026/0089', clientId: 'c1', service: 'Suporte de Infraestrutura TI',
    amount: 350000, status: 'paid', issueDate: '2026-07-01', dueDate: '2026-07-15', paidAt: '2026-07-12',
  },
  {
    id: 'i2', ref: 'FT 2026/0090', clientId: 'c1', service: 'Sistema de Vigilância CCTV',
    amount: 80000, status: 'pending', issueDate: '2026-07-01', dueDate: '2026-07-31',
  },
  {
    id: 'i3', ref: 'FT 2026/0085', clientId: 'c2', service: 'Hospedagem Website Corporativo',
    amount: 45000, status: 'overdue', issueDate: '2026-06-01', dueDate: '2026-06-15',
  },
  {
    id: 'i4', ref: 'FT 2026/0091', clientId: 'c4', service: 'Sistema de Gestão Escolar',
    amount: 120000, status: 'pending', issueDate: '2026-07-05', dueDate: '2026-07-31',
  },
]

// ── Dashboard KPIs ─────────────────────────────────────────────────────────────
export const adminKPIs = {
  totalClients: 47,
  activeServices: 89,
  openTickets: 12,
  mrr: 8_750_000, // AOA
  newThisMonth: 5,
  avgResponseHours: 3.4,
  mrrGrowth: 12.5,
  ticketsSolvedThisWeek: 8,
}

// ── Demo user ──────────────────────────────────────────────────────────────────
export const demoUser = {
  id: 'c1',
  name: 'João Manuel Ferreira',
  company: 'Sonaref Industrial',
  email: 'joao@sonaref.ao',
  phone: '+244 923 456 789',
  role: 'client' as const,
}

export const demoAdmin = {
  id: 'admin1',
  name: 'Administrador Bexaltec',
  email: 'admin@bexaltec.ao',
  role: 'admin' as const,
}
