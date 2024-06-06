import toHttpError from "../HttpError.js";

const isEmptyBody = (req, res, next)=> {
    const {length} = Object.keys(req.body);
    if(!length) {
        return next(toHttpError(400, "Body must have at least one key"));
    }
    next();
}

export default isEmptyBody;
