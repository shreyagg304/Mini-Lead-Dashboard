import { useParams, useNavigate } from "react-router-dom";
import { useLead } from "../features/leads/useLead";
import LeadForm from "../components/LeadForm";
import { useUpdateLead } from "../features/leads/useUpdateLead";
import { useQueryClient } from "@tanstack/react-query";
import { Box, Button, Typography } from "@mui/material";

function EditLeadPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    if (!id) {
        return <div>Invalid lead id</div>;
    }

    const query = useLead(id);
    const response = query.data;
    const updateMutation = useUpdateLead();

    if (query.isLoading) {
        return <div>Loading...</div>;
    }

    if (!response) {
        return <div>Lead not found</div>;
    }

    return (
        <>
            <Box sx={{ px: 2, py: 3 }}>
                <Button variant="outlined" onClick={() => navigate(`/leads/${id}`)}>
                    Back
                </Button>
            </Box>

            <Box sx={{ maxWidth: 800, width: "100%", mx: "auto", px: 2,}}>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h4" sx={{fontWeight:'bold'}}>
                        Edit Lead
                    </Typography>
                </Box>

                <LeadForm
                    initialValues={response}
                    buttonText="Save Changes"
                    onSubmit={(values) => {
                        updateMutation.mutate(
                            {
                                id,
                                lead: values,
                            },
                            {
                                onSuccess: () => {
                                    queryClient.invalidateQueries({
                                        queryKey: ["leads"],
                                    });

                                    queryClient.invalidateQueries({
                                        queryKey: ["lead"],
                                    });

                                    navigate(`/leads/${id}`);
                                },
                            }
                        );
                    }}
                />
            </Box>
        </>
    );
}

export default EditLeadPage;