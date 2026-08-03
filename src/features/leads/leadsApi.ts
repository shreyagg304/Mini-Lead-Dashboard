import { api } from '../../api/axios.ts'

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

export const getLead = (id : number) => {
    return api.get(`/leads/${id}`)
    .then(leaddata => leaddata.data)
}