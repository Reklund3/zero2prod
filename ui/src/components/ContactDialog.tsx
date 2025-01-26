import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import TextField from "@mui/material/TextField";
import React from "react";
import Typography from "@mui/material/Typography";
import {Collapse} from "@mui/material";
import Box from "@mui/material/Box";
import {CheckCircle, Dangerous} from "@mui/icons-material";

interface ContactDialogProps {
    dialogOpen: boolean;
    onClose: () => void;
}

interface ContactRejected {
    reason: string;
}

const ContactDialog: React.FC<ContactDialogProps> = ({dialogOpen, onClose}: ContactDialogProps) => {
    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        message: '',
    });

    const [errors, setErrors] = React.useState({
        name: '',
        email: '',
        message: '',
    });

    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [requestStatus, setRequestStatus] = React.useState<{ success?: boolean, message?: string } | null>(null);

    const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        //TODO: Do client side validation on this.
        setErrors({
            ...errors,
            [event.target.id]: event.target.value ? '' : 'This field is required',
        });

        setFormData({
            ...formData,
            [event.target.id]: event.target.value,
        });
    }

    const handleClose = () => {
        onClose();
        setTimeout(
            () => {
                setFormData({ name: '', email: '', message: '' });
                setErrors({ name: '', email: '', message: '' });
                setIsSubmitting(false);
                setRequestStatus(null);
            },
            500
        )
    }

    const onSubmit: (formData: { name: string, email: string, message: string }) => Promise<void> = async data => {
        setIsSubmitting(true)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // Timeout after 5 seconds

        // Small delay to smooth transitions for processing.
        await new Promise(resolve => setTimeout(resolve, 500)); // 1-second delay

        try {
            const response = await fetch('/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                setRequestStatus({ success: true, message: 'Thank you for reaching out.\nI look forward to speaking with you.' });
                //TODO: Update the dialog with a success
                console.log("Thank you for reaching out. I look forward to speaking with you.");
            } else {
                try {
                    const errorData: ContactRejected = await response.json();
                    setRequestStatus({ success: false, message: "Failed to submit contact information. Response: " + errorData.reason });
                } catch (parseError) {
                    console.error("Failed to submit contact information. Error parsing response: ", parseError);
                    setRequestStatus({ success: false, message: "Failed to submit contact information.\nPlease try again shortly." });
                }
            }
        } catch (error) {
            console.error("Failed to submit contact information. Error: ", error);
            if (error instanceof Error && error.name === 'AbortError') {
                setRequestStatus({ success: false, message: "Failed to submit contact information. Request timed out."});
            } else {
                setRequestStatus({ success: false, message: "Failed to submit contact information. Please try again later."});
            }
        } finally {
            clearTimeout(timeoutId);
            setIsSubmitting(false)
        }
    }

    const handleContactSubmit = () => {
        const newErrors = { name: '', email: '', message: '' };
        if (!formData.name) newErrors.name = 'This field is required';
        if (!formData.email) newErrors.email = 'This field is required';
        if (!formData.message) newErrors.message = 'This field is required';

        setErrors(newErrors);


        if (Object.values(newErrors).every(error => error === '')) {
            onSubmit(formData);
        } else {
            console.log("Form submission failed. Errors: ", newErrors);
        }
    }

    return (
        <Dialog open={dialogOpen} onClose={handleClose}>
            <DialogTitle>Contact Form</DialogTitle>
            <Divider></Divider>
            {/* DialogContent */}
            <DialogContent>
                <Collapse in={isSubmitting}>
                    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%">
                        <CircularProgress size={40} />
                    </Box>
                </Collapse>

                <Collapse in={!!requestStatus}>
                    <Box display="flex" alignItems="center" justifyContent="center" height="100%">
                        {requestStatus?.success ? (
                            <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center">
                                <CheckCircle sx={{ color: 'success.main', m:1 }} />
                                <Typography variant="body1" align="center">{requestStatus.message}</Typography>
                            </Box>
                        ) : (
                            <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center">
                                <Dangerous sx={{ color: 'error.main', m:1 }} />
                                <Typography variant="body1" align="center">{requestStatus?.message}</Typography>
                            </Box>
                        )}
                    </Box>
                </Collapse>

                <Collapse in={!requestStatus && !isSubmitting}>
                    <Box>
                        <FormControl fullWidth>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Name"
                                type="text"
                                value={formData.name}
                                onChange={handleFormChange}
                                fullWidth
                                sx = {{
                                    "& legend": {
                                        transition: "unset",
                                    }
                                }}
                            />
                            <FormHelperText id={"name-error"}>{errors.name}</FormHelperText>
                        </FormControl>
                        <FormControl fullWidth>
                            <TextField margin="dense" id="email" label="Email Address" type="email" value={formData.email} onChange={handleFormChange} fullWidth />
                            <FormHelperText id={"email-error"}>{errors.email}</FormHelperText>
                        </FormControl>
                        <FormControl fullWidth>
                            <TextField
                                margin="dense"
                                id="message"
                                label="Message"
                                type="text"
                                multiline
                                rows={3}
                                value={formData.message}
                                onChange={handleFormChange}
                                fullWidth
                                sx = {{
                                    "& legend": {
                                        transition: "unset",
                                    }
                                }}
                            />
                            <FormHelperText id={"message-error"}>{errors.message}</FormHelperText>
                        </FormControl>
                    </Box>
                </Collapse>
            </DialogContent>
            {/* DialogActions */}
            {!requestStatus && !isSubmitting &&
                <DialogActions>
                    <Button onClick={handleClose} disabled={isSubmitting} variant="contained" color="error">Cancel</Button>
                    <Button onClick={handleContactSubmit} disabled={isSubmitting} variant="contained">Send</Button>
                </DialogActions>
            }
            {isSubmitting &&
                <DialogActions>
                    <Button onClick={handleClose} disabled={true} variant="contained">Close</Button>
                </DialogActions>
            }
            {requestStatus &&
                <DialogActions>
                    <Button
                        onClick={handleClose}
                        color={requestStatus ? (requestStatus.success ? "success" : "error") : "primary"}
                        variant="contained"
                    >
                        Close
                    </Button>
                </DialogActions>
            }
        </Dialog>
    )
}

export default ContactDialog;