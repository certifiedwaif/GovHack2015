import { DataTypes, Sequelize } from 'sequelize';
import { TownStatic } from './models';

export function TownFactory(sequelize: Sequelize): TownStatic {
    return <TownStatic>sequelize.define("Town", {
        Place: {
            type: DataTypes.STRING(15),
            unique: true
        },
        State: DataTypes.STRING(3),
        Latitude: DataTypes.DECIMAL(10,7),
        Longitude: DataTypes.DECIMAL(10,7),
        TotalPopulation: DataTypes.INTEGER,
        MalePopulation: DataTypes.INTEGER,
        FemalePopulation: DataTypes.INTEGER,
        MedianAge: DataTypes.DECIMAL(4,2),
        AgricultureForestryandFishing: DataTypes.DECIMAL(4,2),
        Mining: DataTypes.DECIMAL(4,2),
        Manufacturing: DataTypes.DECIMAL(4,2),
        ElectricityGasWaterWasteService: DataTypes.DECIMAL(4,2),
        Construction: DataTypes.DECIMAL(4,2),
        Wholesale: DataTypes.DECIMAL(4,2),
        Retail: DataTypes.DECIMAL(4,2),
        AccomodationFoodServices: DataTypes.DECIMAL(4,2),
        TransportWarehousing: DataTypes.DECIMAL(4,2),
        ITMediaTelecommunications: DataTypes.DECIMAL(4,2),
        FinancialInsurance: DataTypes.DECIMAL(4,2),
        RentalHiringRealEstate: DataTypes.DECIMAL(4,2),
        ProfessionalScientificTechnical: DataTypes.DECIMAL(4,2),
        AdministrativeSupport: DataTypes.DECIMAL(4,2),
        PublicAdministration: DataTypes.DECIMAL(4,2),
        EducationTraining: DataTypes.DECIMAL(4,2),
        HealthCareSocial: DataTypes.DECIMAL(4,2),
        ArtsRecreation: DataTypes.DECIMAL(4,2),
        Other: DataTypes.DECIMAL(4,2),
        MainEmployingIndustry: DataTypes.STRING(44)
    });
}
