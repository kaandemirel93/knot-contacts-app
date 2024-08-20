import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import {
    List,
    CircularProgress,
    Button,
    Typography,
    Box,
    Snackbar,
    Alert
} from '@mui/material';
import { echo } from "../App";
import ContactForm from './ContactForm';
import ContactItem from './ContactItem';

// Fetch contacts function
const fetchContacts = async () => {
    const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/contacts`);
    return data;
};

// Delete contact function
const deleteContact = async (id) => {
    await axios.delete(`${process.env.REACT_APP_API_URL}/contacts/${id}`);
};

// Update contact function
const updateContact = async (id, requestPayload) => {
    await axios.put(`${process.env.REACT_APP_API_URL}/contacts/${id}`, requestPayload);
};

// Fetch histories function
const fetchHistories = async (id) => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/contacts/${id}/history`);
    return response.data;
};

const ContactList = () => {
    const queryClient = useQueryClient();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarObject, setSnackbarObject] = useState(undefined);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingContact, setEditingContact] = useState(null);
    const [historyOpen, setHistoryOpen] = useState(null);
    const [historyData, setHistoryData] = useState({})
    const [lastCreatedContactId, setLastCreatedContactId] = useState(null);


    useEffect(() => {
        const channel = echo.channel('knot-test');
        channel.listen('ContactUpdated', (event) => {
            queryClient.setQueryData(['contacts'], (oldData) => {
                const contactExists = oldData.find(contact => contact.id === event.contact.id);
                if (event.contact.id === lastCreatedContactId) {
                    setLastCreatedContactId(null);
                    return oldData;
                }
                setSnackbarObject({
                    message: contactExists ?
                        `There's an update to contact ${event.contact.first_name} ${event.contact.last_name}, list updated.` :
                        `A new contact created: ${event.contact.first_name} ${event.contact.last_name}, list updated.`,
                    severity: 'info'
                });
                setOpenSnackbar(true);
                return contactExists ? oldData.map((contact) => contact.id === event.contact.id ? event.contact : contact) :
                    [...oldData, event.contact];
            });
        });

        channel.listen('ContactDeleted', (event) => {
            queryClient.setQueryData(['contacts'], (oldData) => oldData.filter(contact => contact.id !== event.id));
            setSnackbarObject({message:`A contact was deleted, list updated.`, severity: 'info'});
            setOpenSnackbar(true);
        });

        return () => {
            channel.stopListening('ContactUpdated');
            channel.stopListening('ContactDeleted');
        };
    }, [queryClient, lastCreatedContactId]);

    const { data, isLoading, error } = useQuery({
        queryKey: ['contacts'],
        queryFn: fetchContacts
    });

    const handleCreateContact = async (newContact) => {
        try {
            const { data: createdContact } = await axios.post(`${process.env.REACT_APP_API_URL}/contacts`, newContact);
            setLastCreatedContactId(createdContact.id);
            queryClient.setQueryData(['contacts'], (oldData) => [...oldData, createdContact]);
            setShowCreateForm(false);
            setSnackbarObject({ message: 'Contact created successfully', severity: 'success' });
            setOpenSnackbar(true);
        } catch (err) {
            setSnackbarObject({ message: 'Error creating contact', severity: 'error' });
            setOpenSnackbar(true);
        }
    };

    const handleDeleteContact = async (id) => {
        try {
            await deleteContact(id);
            queryClient.invalidateQueries(['contacts']);
        } catch (err) {
            setSnackbarObject({ message: 'Error deleting contact', severity: 'error' });
            setOpenSnackbar(true);
        }
    };

    const handleToggleHistory = async (id) => {
        if (historyOpen === id) {
            setHistoryOpen(null);
        } else {
            try {
                const histories = await fetchHistories(id);
                if (histories.history.length < 1) {
                    setSnackbarObject({ message: 'No history for selected contact', severity: 'info' });
                    setOpenSnackbar(true);
                } else {
                    setHistoryData({ ...historyData, [id]: histories.history });
                    setHistoryOpen(id);
                }
            } catch (err) {
                setSnackbarObject({ message: 'Error fetching history', severity: 'error' });
                setOpenSnackbar(true);
            }
        }
    };

    if (isLoading) return <CircularProgress />;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <Box sx={{ width: '100%', maxWidth: 1000, mx: 'auto', mt: 4, pl: 2, pr: 2 }}>
            <Snackbar open={openSnackbar} autoHideDuration={5000} onClose={() => setOpenSnackbar(false)}>
                <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarObject?.severity} sx={{ width: '100%' }}>
                    {snackbarObject?.message}
                </Alert>
            </Snackbar>
            <Typography variant="h4" gutterBottom>Contacts</Typography>
            {!showCreateForm && <Button variant="contained" color="inherit" onClick={() => setShowCreateForm(true)}>
                Create New Contact
            </Button>}
            {showCreateForm && <ContactForm onSave={handleCreateContact} onCancel={() => setShowCreateForm(false)} />}
            <List>
                {data.map((contact) => (
                    <ContactItem
                        key={contact.id}
                        contact={contact}
                        onEdit={() => setEditingContact(contact)}
                        onDelete={handleDeleteContact}
                        onToggleHistory={handleToggleHistory}
                        isHistoryOpen={historyOpen === contact.id}
                        historyData={historyData[contact.id]}
                        editingContact={editingContact && editingContact.id === contact.id}
                        setEditingContact={setEditingContact}
                        updateContact={updateContact}
                        setSnackbarObject={setSnackbarObject}
                        setOpenSnackbar={setOpenSnackbar}
                    />
                ))}
            </List>
        </Box>
    );
};

export default ContactList;
