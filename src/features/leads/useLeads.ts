import { useQuery } from '@tanstack/react-query'
import { getLeads } from './leadsApi'

export const useLeads = (page : number, rowPerPage : number, debouncedText : string, status : string, sortBy : string, sortDirection : 'asc' | 'desc') => useQuery({
    queryKey: ['leads', page, rowPerPage, debouncedText, status, sortBy, sortDirection],
    queryFn: () => getLeads(page, rowPerPage, debouncedText, status, sortBy, sortDirection)
})