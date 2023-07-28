var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import FileDataModel from '../schemas/job.schema.js';
import JobCategoryModel from '../schemas/jobCategory.schema.js';
class FileDataController {
    // FileData yaratish
    createFileData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fileData = req.body;
                const newFileData = yield FileDataModel.create(fileData);
                const { catId } = fileData;
                if (!catId) {
                    const errorMessage = 'catId kiritilmagan';
                    return res.status(400).json({ message: errorMessage, status: 400 });
                }
                const jobCategory = yield JobCategoryModel.findById(catId);
                if (!jobCategory) {
                    const errorMessage = 'Job kategoriyasi topilmadi';
                    console.error(errorMessage);
                    return res.status(404).json({ message: errorMessage, status: 404 });
                }
                jobCategory.jobs.push(newFileData._id);
                yield jobCategory.save();
                return res.status(201).json(newFileData);
            }
            catch (error) {
                console.error(error.message);
                return res.status(500).json({ message: error.message, status: 500 });
            }
        });
    }
    // Barcha FileData obyektlarini olish
    getAllFileData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fileDataList = yield FileDataModel.find().populate('jobSkills jobEmployee moneyTypeId catId');
                return res.status(200).json(fileDataList);
            }
            catch (error) {
                console.error(error.message);
                return res.status(500).json({ message: error.message, status: 500 });
            }
        });
    }
    // FileData obyektini olish
    getFileDataById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const fileId = req.params.id;
            try {
                const fileData = yield FileDataModel.findById(fileId).populate('jobSkills jobEmployee moreInfo moneyTypeId catId');
                if (!fileData) {
                    return res.status(404).json({ message: 'FileData topilmadi', status: 404 });
                }
                return res.status(200).json(fileData);
            }
            catch (error) {
                console.error(error.message);
                return res.status(500).json({ message: error.message, status: 500 });
            }
        });
    }
    getComLocations(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fileData = yield FileDataModel.find({}, '_id comLocation');
                const comLocationsWithId = fileData.map((data) => ({
                    id: data._id,
                    location: data.comLocation,
                }));
                res.send(comLocationsWithId);
            }
            catch (error) {
                console.error(error.message);
                res.status(500).json({ message: error.message, status: 500 });
            }
        });
    }
    searchByCriteria(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const _a = req.query, { comLocation, comName, jobTitle } = _a, restQuery = __rest(_a, ["comLocation", "comName", "jobTitle"]);
                const locationQuery = comLocation ? { comLocation: { $regex: comLocation.toString(), $options: 'i' } } : {};
                const nameQuery = comName ? { comName: { $regex: comName.toString(), $options: 'i' } } : {};
                const titleQuery = jobTitle ? { jobTitle: { $regex: jobTitle.toString(), $options: 'i' } } : {};
                const fileData = yield FileDataModel.find(Object.assign(Object.assign(Object.assign(Object.assign({}, locationQuery), nameQuery), titleQuery), restQuery), '-__v');
                res.json(fileData);
            }
            catch (error) {
                console.error(error.message);
                res.status(500).json({ message: error.message, status: 500 });
            }
        });
    }
    // FileData obyektini tahrirlash
    updateFileData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const fileId = req.params.id;
            try {
                const updatedFileData = yield FileDataModel.findByIdAndUpdate(fileId, req.body, { new: true }).populate('jobSkills jobEmployee moreInfo moneyTypeId catId');
                if (!updatedFileData) {
                    return res.status(404).json({ message: 'FileData topilmadi', status: 404 });
                }
                return res.status(200).json(updatedFileData);
            }
            catch (error) {
                console.error(error.message);
                return res.status(500).json({ message: error.message, status: 500 });
            }
        });
    }
    // FileData obyektini o'chirish
    deleteFileData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const fileId = req.params.id;
            try {
                const deletedFileData = yield FileDataModel.findByIdAndDelete(fileId);
                if (!deletedFileData) {
                    return res.status(404).json({ message: 'FileData topilmadi', status: 404 });
                }
                return res.status(200).json(deletedFileData);
            }
            catch (error) {
                console.error(error.message);
                return res.status(500).json({ message: error.message, status: 500 });
            }
        });
    }
}
export default new FileDataController();
