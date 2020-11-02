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



export interface TwitterDataAttributes extends mysqlAttributes {
    sourcename: string;
    username: string;
    description: string;
}
export interface TwitterDataModel extends Model<TwitterDataAttributes>, TwitterDataAttributes { }
export class TwitterData extends Model<TwitterDataModel, TwitterDataAttributes> { }
export type TwitterDataStatic = typeof Model & {
    new(values?: object, options?: BuildOptions): TwitterDataModel;
};





export interface TownAttributes extends mysqlAttributes {
    Place: string;
    State: string;
    Latitude: number;
    Longitude: number;
    TotalPopulation: number;
    MalePopulation: number;
    FemalePopulation: number;
    MedianAge: number;
    AgricultureForestryandFishing: number;
    Mining: number;
    Manufacturing: number;
    ElectricityGasWaterWasteService: number;
    Construction: number;
    Wholesale: number;
    Retail: number;
    AccomodationFoodServices: number;
    TransportWarehousing: number;
    ITMediaTelecommunications: number;
    FinancialInsurance: number;
    RentalHiringRealEstate: number;
    ProfessionalScientificTechnical: number;
    AdministrativeSupport: number;
    PublicAdministration: number;
    EducationTraining: number;
    HealthCareSocial: number;
    ArtsRecreation: number;
    Other: number;
    MainEmployingIndustry: string;

}
export interface TownModel extends Model<TownAttributes>, TownAttributes { }
export class Town extends Model<TownModel, TownAttributes> { }
export type TownStatic = typeof Model & {
    new(values?: object, options?: BuildOptions): TownModel;
};



