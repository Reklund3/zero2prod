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
        setFormData({ name: '', email: '', message: '' });
        setErrors({ name: '', email: '', message: '' });
        setIsSubmitting(false);
        setRequestStatus(null);
    }

    const onSubmit: (formData: { name: string, email: string, message: string }) => void = async data => {
        setIsSubmitting(true)
        try {
            // Delay to test the state of processing on the client.
            await new Promise(resolve => setTimeout(resolve, 2000)); // 2-second delay

            // const response = await fetch('https://www.roberteklund.us/contact', {
            const response = await fetch('https://localhost:8080/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

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
            setRequestStatus({ success: false, message: "Failed to submit contact information. Please try again later."});
            console.error("Failed to submit contact information. Error: ", error);
        } finally {
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
            {isSubmitting && <DialogContent><CircularProgress /></DialogContent>}

            {requestStatus &&
                <DialogContent>
                    {requestStatus.success ? (
                        <Typography variant="body1" color="green">{requestStatus.message}</Typography>
                    ) : (
                        <Typography variant="body1" color="error">{requestStatus.message}</Typography>
                    )}

                </DialogContent>
            }

            {!requestStatus && !isSubmitting &&
                <DialogContent>
                    <FormControl fullWidth>
                        <TextField autoFocus margin="dense" id="name" label="Name" type="text" value={formData.name} onChange={handleFormChange} fullWidth />
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
                </DialogContent>
            }
            <DialogActions>
                <Button onClick={handleClose} disabled={isSubmitting} variant="contained" color="error">Cancel</Button>
                <Button onClick={handleContactSubmit} disabled={isSubmitting} variant="contained">Send</Button>
            </DialogActions>
        </Dialog>
    )
}

export default ContactDialog;