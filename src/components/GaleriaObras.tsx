import Image from 'next/image'
import type { Obra } from '@/lib/obras'
import { NOTA_CONFIDENCIALIDADE } from '@/lib/obras'

type Props = {
  obras: Obra[]
  /** Número de colunas em ecrã largo. Abaixo de 900px passa a 2, abaixo de 560px a 1. */
  colunas?: 2 | 3 | 4
  /** Mostrar a nota de confidencialidade por baixo da grelha. */
  nota?: boolean
  /** Primeiras N imagens carregadas com prioridade (acima da dobra). */
  prioridade?: number
}

export function GaleriaObras({ obras, colunas = 3, nota = true, prioridade = 0 }: Props) {
  return (
    <div>
      <div className="galeria-obras" data-cols={colunas}>
        {obras.map((o, i) => (
          <figure key={o.src} className="galeria-item">
            <div className="galeria-moldura">
              <Image
                src={o.src}
                alt={o.alt}
                fill
                sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 33vw"
                style={{ objectFit: 'cover' }}
                priority={i < prioridade}
              />
            </div>
            <figcaption className="galeria-legenda">
              <span className="galeria-tag">{o.tag}</span>
              {o.legenda}
            </figcaption>
          </figure>
        ))}
      </div>

      {nota && (
        <p className="galeria-nota">{NOTA_CONFIDENCIALIDADE}</p>
      )}
    </div>
  )
}
