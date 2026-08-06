import { useParams, useNavigate } from "react-router-dom";
import { useLead } from "../features/leads/useLead";
import DataState from "../components/DataState";
import StatusChip from "../components/StatusChip";
import ConfirmDialog from "../components/ConfirmDialog";
import { Button, Box, Paper, Typography } from "@mui/material";

function LeadDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const query = useLead(id!);
    const response = query.data;

    return (
        <Box sx={{ maxWidth: 1200, mx: "auto", p: 2,}} >
            <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap",}}>
                <Button variant="outlined" onClick={() => navigate("/leads")}>
                    Back to List
                </Button>

                <Button variant="contained" onClick={() => navigate(`/leads/${id}/edit`)}>
                    Edit
                </Button>

                <ConfirmDialog id={id!} />
            </Box>

            <DataState
                isLoading={query.isLoading}
                isError={query.isError}
                isEmpty={
                    !query.isLoading &&
                    !query.isError &&
                    response === undefined
                }
                refetch={query.refetch}
                emptyMessage="Lead not found"
            >
                {response && (
                    <>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h4" sx={{ mb: 3 , fontWeight: 'bold' }}>
                                Lead Details
                            </Typography>

                            <Typography><strong>ID:</strong> {response.id}</Typography>

                            <Typography sx={{ mt: 2 }}>
                                <strong>Name:</strong> {response.first_name} {response.last_name}
                            </Typography>

                            <Typography sx={{ mt: 2 }}>
                                <strong>Email:</strong> {response.email}
                            </Typography>

                            <Typography sx={{ mt: 2 }}>
                                <strong>Phone:</strong> {response.phone}
                            </Typography>

                            <Typography sx={{ mt: 2 }}>
                                <strong>Status:</strong>{" "}
                                <StatusChip status={response.status} />
                            </Typography>

                            <Typography sx={{ mt: 2 }}>
                                <strong>Source:</strong> {response.source}
                            </Typography>

                            <Typography sx={{ mt: 2 }}>
                                <strong>Owner:</strong> {response.owner}
                            </Typography>

                            <Typography sx={{ mt: 2 }}>
                                <strong>Created On:</strong> {response.created_on}
                            </Typography>
                        </Paper>

                        <Paper sx={{ p: 3, mt: 3 }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold'}}>
                                Activity Feed
                            </Typography>

                            <Typography>Status changed to {response.status}</Typography>
                            <Typography>Email sent on 14-Aug</Typography>
                            <Typography>Called on 12-Aug</Typography>
                            <Typography>Assigned to {response.owner}</Typography>
                            <Typography>Name is {response.first_name}</Typography>
                            <Typography>Came from {response.source}</Typography>
                        </Paper>
                    </>
                )}
            </DataState>
        </Box>
    );
}

export default LeadDetailPage;