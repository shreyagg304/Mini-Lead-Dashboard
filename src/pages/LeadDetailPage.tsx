import { useParams, useNavigate } from 'react-router-dom'
import { useLead } from '../features/leads/useLead'
import DataState from '../components/DataState.tsx'
import StatusChip from '../components/StatusChip.tsx';
import { Button } from '@mui/material';
import ConfirmDialog from '../components/ConfirmDialog.tsx';

function LeadDetailPage() {
    
    const {id} = useParams();
    const numericId = Number(id);
    const navigate = useNavigate();

    const query = useLead(numericId);
    
    const response = query.data;

    return (
        <>

            <Button onClick={() => navigate('/leads')}>Back to List</Button>

            <ConfirmDialog numericId={numericId}/>

            <DataState 
                isLoading={query.isLoading}
                isError={query.isError}
                isEmpty={!query.isLoading &&
                    !query.isError &&
                    response == undefined
                }
                refetch = {query.refetch}
                emptyMessage='Lead not found'
            >
                { response && (
                    <div>
                        <h3>Id: {response.id}</h3>
                        <h3>Name: {response.first_name} {response.last_name}</h3>
                        <h3>Email: {response.email}</h3>
                        <h3>Phone: {response.phone}</h3>
                        <h3>Status: <StatusChip status={response.status} /></h3>
                        <h3>Source: {response.source}</h3>
                        <h3>Owner: {response.owner}</h3>
                        <h3>Created_on: {response.created_on}</h3>
                        <div>
                            <h3>Activity Feed</h3>
                            <h4>Status changed to {response.status}</h4>
                            <h4>Email sent on 14-Aug</h4>
                            <h4>Called on 12-Aug</h4>
                            <h4>Assigned to {response.owner}</h4>
                            <h4>Name is {response.first_name}</h4>
                            <h4>Came from {response.source}</h4>
                        </div>
                    </div>
                    )
                }
            </DataState>
        </>
    )
}

export default LeadDetailPage