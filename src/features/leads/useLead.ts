import { useQuery } from '@tanstack/react-query'
import { getLead } from './leadsApi'

export const useLead = (id : number) => useQuery({
    queryKey : ['lead'],
    queryFn : () => getLead(id),
})