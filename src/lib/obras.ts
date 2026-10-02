// Registo fotográfico de obras executadas pela equipa da Bexaltec.
// As instalações dos clientes não são identificadas, por respeito à
// confidencialidade contratada — as fotografias servem de prova do trabalho,
// não de referência nominal.

export type Obra = {
  src: string
  alt: string
  legenda: string
  tag: string
  vertical: boolean
}

export const OBRAS: Obra[] = [
  { src: '/obras/bastidor-producao.jpg', vertical: true, tag: 'Bastidor',
    legenda: 'Bastidor concluído em produção',
    alt: 'Bastidor concluído em produção com painéis identificados, comutadores, painel de fibra e servidores' },
  { src: '/obras/bastidor-instalacao.jpg', vertical: true, tag: 'Bastidor',
    legenda: 'Bastidor de piso durante a instalação',
    alt: 'Bastidor de piso durante a instalação, com esteira vertical a entrar pelo topo e painéis Cat.6 montados' },
  { src: '/obras/paineis-cat6.jpg', vertical: true, tag: 'Cabeamento',
    legenda: 'Conjuntos de patch panels Cat.6',
    alt: 'Conjuntos de patch panels Cat.6 com feixes de cabo organizados em coluna central' },
  { src: '/obras/esteira-curva-descida.jpg', vertical: false, tag: 'Esteira',
    legenda: 'Curva a 90° e descida à área técnica',
    alt: 'Esteira metálica suspensa com mudança de direção a 90 graus e descida vertical até à área técnica' },
  { src: '/obras/esteira-percurso.jpg', vertical: false, tag: 'Esteira',
    legenda: 'Percurso principal acima do teto falso',
    alt: 'Percurso principal em esteira perfurada montada acima do teto falso, ao longo do perímetro do piso' },
  { src: '/obras/painel-terminado.jpg', vertical: false, tag: 'Terminação',
    legenda: 'Patch panel terminado do lado IDC',
    alt: 'Patch panel terminado do lado IDC, com cada cabo ancorado individualmente e identificado' },
  { src: '/obras/gestao-vertical.jpg', vertical: true, tag: 'Bastidor',
    legenda: 'Gestão vertical de cabo',
    alt: 'Gestão vertical de cabo com amarração a intervalos constantes ao longo do montante do bastidor' },
  { src: '/obras/identificacao-paineis.jpg', vertical: false, tag: 'Identificação',
    legenda: 'Painéis identificados por piso e serviço',
    alt: 'Painéis identificados por piso e por tipo de serviço, com numeração sequencial' },
  { src: '/obras/esteira-obra.jpg', vertical: false, tag: 'Esteira',
    legenda: 'Montagem em obra, teto ainda aberto',
    alt: 'Montagem de esteira metálica em obra, com o teto ainda aberto e as derivações posicionadas' },
  { src: '/obras/bastidor-vista-superior.jpg', vertical: true, tag: 'Bastidor',
    legenda: 'Entrada de cabo pelo topo do bastidor',
    alt: 'Vista superior do bastidor com entrada dos cabos pelo topo e chegada ao lado IDC dos painéis' },
  { src: '/obras/terminacao-idc.jpg', vertical: true, tag: 'Terminação',
    legenda: 'Terminação com a rede em serviço',
    alt: 'Terminação de um novo conjunto de cabos em bloco IDC, com a rede existente em serviço' },
  { src: '/obras/manutencao-bastidor.jpg', vertical: true, tag: 'Manutenção',
    legenda: 'Manutenção em bastidor ativo',
    alt: 'Intervenção de manutenção num bastidor em serviço, com os conjuntos tratados um de cada vez' },
  { src: '/obras/bastidor-montagem.jpg', vertical: true, tag: 'Montagem',
    legenda: 'Montagem de bastidor 19″ no local',
    alt: 'Montagem de bastidor de 19 polegadas no local, sobre proteção de chão' },
  { src: '/obras/fornecimento-esteira.jpg', vertical: true, tag: 'Fornecimento',
    legenda: 'Esteira metálica para fornecimento',
    alt: 'Secções de esteira metálica perfurada preparadas para fornecimento' },
  { src: '/obras/logistica-material.jpg', vertical: true, tag: 'Fornecimento',
    legenda: 'Carga de material para entrega em obra',
    alt: 'Levantamento e carga de material importado para entrega em obra' },
  { src: '/obras/rececao-material.jpg', vertical: true, tag: 'Fornecimento',
    legenda: 'Conferência de remessa antes da entrega',
    alt: 'Receção e conferência de uma remessa de keystones e espelhos antes da entrega' },
]

export const NOTA_CONFIDENCIALIDADE =
  'Fotografias de obras executadas pela equipa da Bexaltec. As instalações dos clientes não são identificadas, por respeito à confidencialidade contratada.'

/** Fotografias de infraestrutura e cabeamento — sem as de fornecimento. */
export const OBRAS_INFRA = OBRAS.filter(o => o.tag !== 'Fornecimento')

/** Fotografias de importação, fornecimento e logística. */
export const OBRAS_FORNECIMENTO = OBRAS.filter(o => o.tag === 'Fornecimento')
