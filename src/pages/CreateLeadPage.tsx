import LeadForm from '../components/LeadForm.tsx'
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Box } from '@mui/material'
import { useCreateLead } from "../features/leads/useCreateLead";
import { useQueryClient } from "@tanstack/react-query";

function CreateLeadPage() {

    const navigate = useNavigate();

    const emptyLead = {
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        status: 'New',
        owner: '',
        source: '',
        created_on: '',
    };

    const createMutation = useCreateLead();
    const queryClient = useQueryClient();

    return (
        <>
        <Box sx={{ px: 2, py: 3 }}>
            <Button onClick={() => navigate('/leads')} variant='outlined'>Back</Button>
        </Box>
        
            <Box sx={{ maxWidth: 800, width: "100%", mx: "auto", px: 2,}}>

                <Box sx={{padding:2}}>
                    <Typography variant='h4' sx={{ fontWeight: 'bold' }}>Create Lead</Typography>
                </Box>
                
                <LeadForm
                    initialValues={emptyLead}
                    buttonText="Create Lead"
                    onSubmit={(values) => {
                        createMutation.mutate(values, {
                            onSuccess: () => {
                                queryClient.invalidateQueries({
                                    queryKey: ['leads'],
                                });

                                navigate('/leads');
                            },
                        });
                    }}
                />
            </Box>
        </>
    )
}

export default CreateLeadPage