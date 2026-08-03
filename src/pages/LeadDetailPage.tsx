import { useParams } from 'react-router-dom'
import { useLead } from '../features/leads/useLead'
import DataState from '../components/DataState.tsx'

function LeadDetailPage() {
    
    const {id} = useParams();
    const numericId = Number(id);

    const query = useLead(numericId);
    
    const response = query.data;

    return (
        <>
            <DataState 
                isLoading={query.isLoading}
                isError={query.isError}
                isEmpty={!query.isLoading &&
                    !query.isError &&
                    response?.data.length === 0}
                refetch = {query.refetch}
                emptyMessage='Lead not found'
            >
                <h3>{response.id}</h3>
                <h3>{response.first_name}</h3>
                <h3>{response.last_name}</h3>
                <h3>{response.email}</h3>
                <h3>{response.phone}</h3>
                <h3>{response.source}</h3>
                <h3>{response.owner}</h3>
                <h3>{response.created_on}</h3>
            </DataState>
        </>
    )
}

export default LeadDetailPage