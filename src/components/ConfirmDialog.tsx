import { useState } from "react";
import { Button, DialogContent, DialogTitle, Dialog, DialogContentText, DialogActions, IconButton } from "@mui/material"
import { useDeleteLead } from '../features/leads/useDeleteLead.ts';
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import DeleteOutlineTwoToneIcon from '@mui/icons-material/DeleteOutlineTwoTone';

type ConfirmDialogProp = {
    id : string
}

function ConfirmDialog({id} : ConfirmDialogProp) {

    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const queryClient = useQueryClient();

    const handleClickOpen = () => {
        setErrorMessage('');
        setOpen(true);
    }

    const handleClickClose = () => {
        setOpen(false);
    }

    const handleRefresh = () => {
        queryClient.invalidateQueries({queryKey : ['leads']})
        navigate('/leads')
    }

    const mutation = useDeleteLead();

    return (
        <>
            <IconButton onClick={
                (event) => {
                    event.stopPropagation();
                    handleClickOpen();
                }
            }>
                <DeleteOutlineTwoToneIcon />
            </IconButton>
            <Dialog
                open={open}
                onClose={handleClickClose}
            >
                <DialogTitle>
                    Please Confirm
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Click on delete to confirm the deletion of lead
                    </DialogContentText>
                    {
                        errorMessage && (
                            <DialogContentText color="error">
                                {errorMessage}
                            </DialogContentText>
                        )
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={(event) => {
                        event.stopPropagation();
                        mutation.mutate(id, {
                            onSuccess: handleRefresh,
                            onError: () => setErrorMessage("Failed to delete the lead. Please try again.")
                        })}} >
                        Delete
                    </Button>
                    <Button onClick={
                        (event) => {
                            event.stopPropagation();
                            handleClickClose();
                        }
                    }>Cancel</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default ConfirmDialog