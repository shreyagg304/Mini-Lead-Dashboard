import { useMutation } from '@tanstack/react-query'
import { deleteLead } from './leadsApi'

export const useDeleteLead = () => useMutation({
    mutationFn : (id : string) => deleteLead(id),
})