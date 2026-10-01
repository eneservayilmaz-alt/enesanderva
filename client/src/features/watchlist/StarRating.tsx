import { Star } from 'lucide-react'
import { useLanguage } from '../../lib/i18n'

export function StarRating({ name, value = 0, onChange, disabled = false }: { name: string; value?: number; onChange?: (rating: number) => void; disabled?: boolean }) {
  const { t } = useLanguage()
  return <div className="personal-rating"><span>{name}</span><div className="rating-stars" role={onChange ? 'group' : 'img'} aria-label={`${name}: ${value}/5`}>
    {[1, 2, 3, 4, 5].map((rating) => onChange
      ? <button key={rating} type="button" disabled={disabled} aria-label={`${name}: ${rating}/5`} aria-pressed={rating <= value} onClick={() => onChange(rating === value ? 0 : rating)}><Star size={20} fill={rating <= value ? 'currentColor' : 'none'} /></button>
      : <Star key={rating} size={16} aria-hidden="true" fill={rating <= value ? 'currentColor' : 'none'} />)}
  </div><small>{value ? `${value}/5` : t('unrated')}</small></div>
}
