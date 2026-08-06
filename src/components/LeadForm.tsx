import React, {useState} from "react"
import { Stack, TextField,
     FormControl, Select, InputLabel, MenuItem, type SelectChangeEvent, Button, FormHelperText, Paper,Box } from '@mui/material'
import { validateLead, normalisePhone } from "../features/leads/validateLead"
import { type LeadValues, type LeadErrors } from "../features/leads/validateLead" 
import { useEffect } from "react"

type FormData = {
    values : LeadValues,
    errors : LeadErrors,
    submitError : string | null,
}

type LeadFormProps = {
    initialValues: LeadValues;
    onSubmit: (values: LeadValues) => void;
    buttonText: string;
}

function LeadForm({initialValues, onSubmit, buttonText} : LeadFormProps) {

    const [formData, setFormData] = useState<FormData>({
        values : initialValues,
        errors : {},
        submitError : null
    })

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
        onSubmit({
            ...formData.values,
            phone:normalisePhone(formData.values.phone),
            created_on: new Date().toISOString().split("T")[0],
        })
    }

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            values: initialValues,
        }));
    }, [initialValues]);

    return (
        <>
        <Paper sx={{ padding: 4}}>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        <div style={{ display: 'flex', gap: "16px"}}>
                            <TextField
                                fullWidth
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
                                fullWidth
                                id="outlined-multiline-flexible"
                                label="Last Name"
                                value={formData.values.last_name}
                                name="last_name"
                                onChange={handleChange}
                                helperText={formData.errors.last_name}
                                error={Boolean(formData.errors.last_name)}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: "16px"}}>
                            <TextField
                                fullWidth
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
                                fullWidth
                                id="outlined-multiline-flexible"
                                label="Phone"
                                type="tel"
                                value={formData.values.phone}
                                name="phone"
                                onChange={handleChange}
                                helperText={formData.errors.phone}
                                error={Boolean(formData.errors.phone)}
                            />
                            <FormControl fullWidth>
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
                                <FormHelperText error>{formData.errors.status}</FormHelperText>
                            </FormControl>
                        </div>
                        <div style={{ display: 'flex', gap: "16px"}}>
                            <TextField
                                fullWidth
                                id="outlined-multiline-flexible"
                                label="Owner"
                                value={formData.values.owner}
                                name="owner"
                                onChange={handleChange}
                                helperText={formData.errors.owner}
                                error={Boolean(formData.errors.owner)}
                            />
                            <TextField
                                fullWidth
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
                    <Box sx={{ py:3 }}>
                        <Button
                            type="submit"
                            variant="contained"
                        >
                            {buttonText}
                        </Button>
                    </Box>
                </form>
        </Paper>
        </>
    )
}

export default LeadForm