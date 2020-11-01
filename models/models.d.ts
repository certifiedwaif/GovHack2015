import { BuildOptions, Model } from "sequelize";

interface mysqlAttributes {
    id?: number;
    createdAt?: Date;
    updatedAt?: Date;
}


export interface StoryAttributes extends mysqlAttributes {
    Title: string;
    URL: string;
    Date: Date;
    Primary_image: string;
    Primary_image_caption: string;
    Primary_image_rights_information: string;
    Subjects: string;
    Station: string;
    State: string;
    Place: string;
    Keywords: string;
    Latitude: number;
    Longitude: number;
    MediaRSS_URL: string;
}
export interface StoryModel extends Model<StoryAttributes>, StoryAttributes { }
export class Story extends Model<StoryModel, StoryAttributes> { }
export type StoryStatic = typeof Model & {
    new(values?: object, options?: BuildOptions): StoryModel;
};



