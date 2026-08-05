import React, {useState} from "react"
import { Box, Stack, TextField, FormControl, Select, InputLabel, MenuItem, type SelectChangeEvent, Button, FormHelperText } from '@mui/material'
import { validateLead, normalisePhone } from "../features/leads/validateLead"
import { type LeadValues, type LeadErrors } from "../features/leads/validateLead" 
import { useCreateLead } from "../features/leads/useCreateLead"
import { useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"

type FormData = {
    values : LeadValues,
    errors : LeadErrors,
    submitError : string | null,
}

function LeadForm() {

    const [formData, setFormData] = useState<FormData>({

        values : {
            first_name : '',
            last_name : '',
            email : '',
            phone : '',
            status: 'New',
            owner : '',
            source : '',
            created_on: ''
        },

        errors : {},

        submitError : null
    })

    const queryClient = useQueryClient();

    const mutation = useCreateLead();

    const navigate = useNavigate();

    const handleChange = (event : React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        setFormData((prev) => ({
            ...prev,
            values : {
                ...prev.values,
                [name] : value,
            }
        }));
    }

    const handleStatusChange = (event : SelectChangeEvent ) => {
        const {name, value} = event.target;
        setFormData((prev) => ({
            ...prev,
            values : {
                ...prev.values,
                [name] : value,
            }
        }))
    }

    const handleSubmit = (event : React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const errorObject = validateLead(formData.values);
        setFormData((prev) => ({
            ...prev,
            errors : errorObject
        }))
        if(Object.keys(errorObject).length > 0) {
            return;
        }
        mutation.mutate(
            {
                ...formData.values,
                phone: normalisePhone(formData.values.phone),
                created_on: new Date().toISOString().split("T")[0]
            },
            {
                onSuccess : () => {
                    queryClient.invalidateQueries({queryKey : ['leads']}),
                    navigate('/leads')
                },
                onError: () => {
                    setFormData((prev) => ({
                        ...prev,
                        submitError : "Failed to create lead. Please try again"
                    }))
                }
            }
        );
    }

    return (
        <>
            <Box>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        <div>
                            <TextField
                                id="outlined-multiline-flexible"
                                label="First Name"
                                value={formData.values.first_name}
                                name="first_name"
                                onChange={handleChange}
                                helperText={formData.errors.first_name}
                                error={Boolean(formData.errors.first_name)}
                                autoFocus
                            />
                            <TextField
                                id="outlined-multiline-flexible"
                                label="Last Name"
                                value={formData.values.last_name}
                                name="last_name"
                                onChange={handleChange}
                                helperText={formData.errors.last_name}
                                error={Boolean(formData.errors.last_name)}
                            />
                        </div>
                        <div>
                            <TextField
                                id="outlined-multiline-flexible"
                                label="Email"
                                type="email"
                                value={formData.values.email}
                                name="email"
                                onChange={handleChange}
                                helperText={formData.errors.email}
                                error={Boolean(formData.errors.email)}
                            />
                            <TextField
                                id="outlined-multiline-flexible"
                                label="Phone"
                                type="tel"
                                value={formData.values.phone}
                                name="phone"
                                onChange={handleChange}
                                helperText={formData.errors.phone}
                                error={Boolean(formData.errors.phone)}
                            />
                            <FormControl sx={{ minWidth: 120 }}>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={formData.values.status}
                                    label="Status"
                                    name="status"
                                    onChange={handleStatusChange}
                                >
                                    <MenuItem value="New">New</MenuItem>
                                    <MenuItem value="Contacted">Contacted</MenuItem>
                                    <MenuItem value="Qualified">Qualified</MenuItem>
                                    <MenuItem value="Lost">Lost</MenuItem>
                                    <MenuItem value="Won">Won</MenuItem>
                                </Select>
                                <FormHelperText>{formData.errors.status}</FormHelperText>
                            </FormControl>
                        </div>
                        <div>
                            <TextField
                                id="outlined-multiline-flexible"
                                label="Owner"
                                value={formData.values.owner}
                                name="owner"
                                onChange={handleChange}
                                helperText={formData.errors.owner}
                                error={Boolean(formData.errors.owner)}
                            />
                            <TextField
                                id="outlined-multiline-flexible"
                                label="Source"
                                value={formData.values.source}
                                name="source"
                                onChange={handleChange}
                            />
                        </div>
                    </Stack>
                    {
                        formData.submitError && (
                            <FormHelperText>
                                {formData.submitError}
                            </FormHelperText>
                        )
                    }
                    <Button type="submit" disabled={mutation.isPending}>Create Lead</Button>
                </form>
            </Box>
        </>
    )
}

export default LeadForm