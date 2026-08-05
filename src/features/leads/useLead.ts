import { useQuery } from '@tanstack/react-query'
import { getLead } from './leadsApi'

export const useLead = (id : string) => useQuery({
    queryKey : ['lead'],
    queryFn : () => getLead(id),
})