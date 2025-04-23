import multer from "multer";
import path from "path";

const upload = multer({
    storage:multer.memoryStorage(),
});



export default upload;