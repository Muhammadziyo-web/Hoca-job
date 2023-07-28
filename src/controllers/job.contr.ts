import { NextFunction, Request, Response } from 'express';
import FileDataModel from '../schemas/job.schema.js';
import { ComLocationData, FileData, IFileData, IJobCategory } from '../interface/interface';
import JobCategoryModel from '../schemas/jobCategory.schema.js';

class FileDataController {
    // FileData yaratish
    async createFileData(req: Request, res: Response, next: NextFunction) {
        try {
            const fileData: IFileData = req.body;
            const newFileData = await FileDataModel.create(fileData);
            const { catId } = fileData;

            if (!catId) {
                const errorMessage = 'catId kiritilmagan';
                return res.status(400).json({ message: errorMessage, status: 400 });
            }

            const jobCategory: IJobCategory | null = await JobCategoryModel.findById(catId);

            if (!jobCategory) {
                const errorMessage = 'Job kategoriyasi topilmadi';
                console.error(errorMessage);
                return res.status(404).json({ message: errorMessage, status: 404 });
            }

            jobCategory.jobs.push(newFileData._id);
            await jobCategory.save();

            return res.status(201).json(newFileData);
        } catch (error: any) {
            console.error(error.message);
            return res.status(500).json({ message: error.message, status: 500 });
        }
    }

    // Barcha FileData obyektlarini olish
    async getAllFileData(req: Request, res: Response) {
        try {
            const fileDataList = await FileDataModel.find().populate('jobSkills jobEmployee moneyTypeId catId');
            return res.status(200).json(fileDataList);
        } catch (error: any) {
            console.error(error.message);
            return res.status(500).json({ message: error.message, status: 500 });
        }
    }

    // FileData obyektini olish
    async getFileDataById(req: Request, res: Response) {
        const fileId = req.params.id;
        try {
            const fileData = await FileDataModel.findById(fileId).populate('jobSkills jobEmployee moreInfo moneyTypeId catId');
            if (!fileData) {
                return res.status(404).json({ message: 'FileData topilmadi', status: 404 });
            }
            return res.status(200).json(fileData);
        } catch (error: any) {
            console.error(error.message);
            return res.status(500).json({ message: error.message, status: 500 });
        }
    }
    async getComLocations(req: Request, res: Response): Promise<void> {
        try {
            const fileData: ComLocationData[] = await FileDataModel.find({}, '_id comLocation');
            const comLocationsWithId: { id: string; location: string }[] = fileData.map((data) => ({
                id: data._id,
                location: data.comLocation,
            }));
            res.send(comLocationsWithId);
        } catch (error: any) {
            console.error(error.message);
            res.status(500).json({ message: error.message, status: 500 });
        }
    }
    async searchByCriteria(req: Request, res: Response): Promise<void> {
        try {
            const { comLocation, comName, jobTitle, ...restQuery } = req.query;
            const locationQuery = comLocation ? { comLocation: { $regex: comLocation.toString(), $options: 'i' } } : {};
            const nameQuery = comName ? { comName: { $regex: comName.toString(), $options: 'i' } } : {};
            const titleQuery = jobTitle ? { jobTitle: { $regex: jobTitle.toString(), $options: 'i' } } : {};
            const fileData: FileData[] = await FileDataModel.find({ ...locationQuery, ...nameQuery, ...titleQuery, ...restQuery }, '-__v');
            res.json(fileData);
        } catch (error: any) {
            console.error(error.message);
            res.status(500).json({ message: error.message, status: 500 });
        }
    }
    // FileData obyektini tahrirlash
    async updateFileData(req: Request, res: Response) {
        const fileId = req.params.id;
        try {
            const updatedFileData = await FileDataModel.findByIdAndUpdate(fileId, req.body, { new: true }).populate('jobSkills jobEmployee moreInfo moneyTypeId catId');
            if (!updatedFileData) {
                return res.status(404).json({ message: 'FileData topilmadi', status: 404 });
            }
            return res.status(200).json(updatedFileData);
        } catch (error: any) {
            console.error(error.message);
            return res.status(500).json({ message: error.message, status: 500 });
        }
    }

    // FileData obyektini o'chirish
    async deleteFileData(req: Request, res: Response) {
        const fileId = req.params.id;
        try {
            const deletedFileData = await FileDataModel.findByIdAndDelete(fileId);
            if (!deletedFileData) {
                return res.status(404).json({ message: 'FileData topilmadi', status: 404 });
            }
            return res.status(200).json(deletedFileData);
        } catch (error: any) {
            console.error(error.message);
            return res.status(500).json({ message: error.message, status: 500 });
        }
    }
}

export default new FileDataController();
