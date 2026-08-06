import { useMutation } from '@tanstack/react-query';
import { updateLead } from './leadsApi';

export const useUpdateLead = () => useMutation({
    mutationFn: updateLead,
});