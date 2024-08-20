import {Button, Box, Stack, TextField, CircularProgress} from "@mui/material";
import React, { useState } from "react";

const ContactForm = ({ initialData = {}, onSave, onCancel }) => {
    const [firstName, setFirstName] = useState(initialData.first_name || '');
    const [lastName, setLastName] = useState(initialData.last_name || '');
    const [email, setEmail] = useState(initialData.email || '');
    const [phone, setPhone] = useState(initialData.phone_number || '');
    const [inProgress, setInProgress] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setInProgress(true);
        try {
            await onSave({first_name: firstName, last_name: lastName, email: email, phone_number: phone});
        } finally {
            setInProgress(false);
        }
    };

    return (
        <Box sx={{ padding: 2, border: '1px solid #ccc', borderRadius: 1, backgroundColor: '#f9f9f9' }}>
            <Stack spacing={2}>
                <Stack direction="row" spacing={2}>
                    <TextField
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        label="First Name"
                        fullWidth
                    />
                    <TextField
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        label="Last Name"
                        fullWidth
                    />
                </Stack>
                <TextField
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    label="Email"
                    fullWidth
                />
                <TextField
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    label="Phone Number"
                    fullWidth
                />
                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ marginTop: 2 }}>
                    <Button variant="outlined" color="error" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                        {inProgress && <CircularProgress size={20}
                                                         color="inherit"
                                                         sx={{ marginRight: 1 }} />}
                        <span>{initialData.id ? 'Save' : 'Create'}</span>
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
};

export default ContactForm;
