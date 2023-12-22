const validate = (schema) => async (req, res, next) => {
    try {
        const parsedBody = await schema.parseAsync(req.body);
        req.body = parsedBody;
        next();
    } catch (err) {
        const status = 422;
        const message = "Validation error";
        const extraDetails = err.errors?.[0]?.message || "Unknown validation error";
        console.log(extraDetails);

        const error = {
            status,
            message,
            extraDetails,
        };

        res.status(status).json({ error });
    }
};

module.exports = validate;
