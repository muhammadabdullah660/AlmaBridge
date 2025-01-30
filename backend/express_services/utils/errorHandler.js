//FUNCTION TO HANDLE VALIDATION ERRORS
const handleValidationErrors = (errors) => {
    return { status: 400, response: { errors: errors.array() } };
};


module.exports = { handleValidationErrors };