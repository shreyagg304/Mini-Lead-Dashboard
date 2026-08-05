import LeadForm from '../components/LeadForm.tsx'
import { useNavigate } from 'react-router-dom';
import { Button, Typography } from '@mui/material'

function CreateLeadPage() {

    const navigate = useNavigate();

    return (
        <>
            <Button onClick={() => navigate('/leads')}>Back</Button>
            <Typography>Create Lead</Typography>
            <LeadForm/>
        </>
    )
}

export default CreateLeadPage