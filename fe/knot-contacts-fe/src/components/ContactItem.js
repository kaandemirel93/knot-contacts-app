import {
    Box,
    Collapse,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemText, Paper,
    Stack,
    Tooltip,
    Typography
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import HistoryIcon from "@mui/icons-material/History";
import EditIcon from "@mui/icons-material/Edit";
import React from 'react';
import {format} from "date-fns";
import ContactForm from "./ContactForm";

const ContactItem = ({contact, onEdit, onDelete, onToggleHistory, isHistoryOpen, historyData, editingContact, setEditingContact, updateContact, setSnackbarObject, setOpenSnackbar}) => {
    const handleEditContact = async (id, updatedContact) => {
        try {
            await updateContact(id, updatedContact);
            setEditingContact(null);
        } catch (err) {
            setSnackbarObject({ message: 'Error updating contact', severity: 'error' });
            setOpenSnackbar(true);
        }
    };

    return (
        <React.Fragment>
            <Paper elevation={3} sx={{ marginBottom: 1, padding: 1 }}>
                {editingContact ? (
                    <ContactForm initialData={contact} onSave={(updatedContact) => handleEditContact(contact.id, updatedContact)} onCancel={() => setEditingContact(null)} />
                ) : (
                <ListItem alignItems="flex-start">
                <ListItemText primary={`${contact.first_name} ${contact.last_name}`} secondary={`${contact.email} - ${contact.phone_number}`} />
                <Stack direction="row" spacing={1}>
                    <Tooltip title="Edit contact">
                        <IconButton color="primary" onClick={() => onEdit(contact)}>
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="See contact history">
                        <IconButton color="primary" onClick={() => onToggleHistory(contact.id)}>
                            <HistoryIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete contact">
                        <IconButton color="error" onClick={() => onDelete(contact.id)}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </ListItem>)}
            <Collapse in={isHistoryOpen} timeout="auto" unmountOnExit>
                <Box pl={2}>
                    <List component="div" disablePadding>
                        {historyData && historyData.map((history, key) => (
                            <React.Fragment key={history.id}>
                                <ListItem>
                                    <ListItemText
                                        primary={`${history.first_name} ${history.last_name}`}
                                        secondary={`${history.email} - ${history.phone_number}`}
                                    />
                                    <Typography variant="body2" color="textSecondary">
                                        {format(new Date(history.updated_at), 'PPpp')}
                                    </Typography>
                                </ListItem>
                                {key !== historyData.length - 1 && <Divider />}
                            </React.Fragment>
                        ))}
                    </List>
                </Box>
            </Collapse>
            </Paper>
        </React.Fragment>
    );
}

export default ContactItem;
