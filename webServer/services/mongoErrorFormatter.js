export const formatter = (err) => {
    //Format MongoDB Duplicate Key Errors (11000)
    if (err.code === 11000) {
        const duplicateField = Object.keys(err.keyValue)[0];
        return res.status(409).json({
            errors: { [duplicateField]: [`This ${duplicateField} already exists`] }
        });
    }

    //Format Mongoose Validation Errors
    if (err.name === 'ValidationError') {
        const formattedErrors = {};
        Object.keys(err.errors).forEach(field => {
            formattedErrors[field] = [err.errors[field].message];
        });
        return res.status(400).json({ errors: formattedErrors });
    }
}
