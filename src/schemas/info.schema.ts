import { Schema, model, Types, InferSchemaType } from "mongoose";

const infoSchema = new Schema(
  {
   jobText : {
    type : Text,
    required : [true, 'Job info is required']
   },
   job_id : {
    type : Types.ObjectId,
    ref : 'Jobs'
   },
  },
  {
    timestamps: true,
  }
);

type info = InferSchemaType<typeof infoSchema>;
export default model<info>("Info", infoSchema);