// material-ui imports
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';

const DialogForm = (props) => {
    const {
        isOpen,
        handleDialogClose,
        header,
        maxWidth,
        children,
    } = props;

    return (
        <div>
            <Dialog
                open={isOpen}
                onClose={handleDialogClose}
                fullWidth={true}
                maxWidth={maxWidth || 'xs'}
            >
                <DialogTitle>
                    {header}
                </DialogTitle>

                <Divider />

                <DialogContent>
                    {children}
                </DialogContent>
            </Dialog>
        </div>
    )
};

export default DialogForm;
