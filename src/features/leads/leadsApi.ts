import { api } from '../../api/axios.ts'
import type { LeadValues } from './validateLead.ts';

export const getLeads = (page : number, rowPerPage : number, debouncedText : string, status : string, sortBy : string, sortDirection : 'asc' | 'desc') => {
    const params: Record<string, string | number> = {
        _page: page,
        _per_page: rowPerPage,
    };
    if (debouncedText !== '') {
        params['first_name:contains'] = debouncedText;
    }
    if (status !== '') {
        params['status'] = status;
    }
    if (sortBy !== '') {
        params['_sort'] = (
            sortDirection === 'asc' ? sortBy : `-${sortBy}`
        )
    }
    return api.get('/leads', { params })
    .then(axiosBox => axiosBox.data);
}

export const getLead = (id : string) => {
    return api.get(`/leads/${id}`)
    .then(response => response.data)
}

export const deleteLead = (id : string) => {
    return api.delete(`/leads/${id}`)
    .then(response => response.data)
}

export const createLead = async (lead : LeadValues) => {
    const response = await api.post('/leads', lead);
    return response.data;
}