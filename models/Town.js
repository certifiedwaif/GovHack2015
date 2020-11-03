"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TownFactory = void 0;
const sequelize_1 = require("sequelize");
function TownFactory(sequelize) {
    return sequelize.define('Town', {
        Place: {
            type: sequelize_1.DataTypes.STRING(15),
            unique: true
        },
        State: sequelize_1.DataTypes.STRING(3),
        Latitude: sequelize_1.DataTypes.DECIMAL(10, 7),
        Longitude: sequelize_1.DataTypes.DECIMAL(10, 7),
        TotalPopulation: sequelize_1.DataTypes.INTEGER,
        MalePopulation: sequelize_1.DataTypes.INTEGER,
        FemalePopulation: sequelize_1.DataTypes.INTEGER,
        MedianAge: sequelize_1.DataTypes.DECIMAL(4, 2),
        AgricultureForestryandFishing: sequelize_1.DataTypes.DECIMAL(4, 2),
        Mining: sequelize_1.DataTypes.DECIMAL(4, 2),
        Manufacturing: sequelize_1.DataTypes.DECIMAL(4, 2),
        ElectricityGasWaterWasteService: sequelize_1.DataTypes.DECIMAL(4, 2),
        Construction: sequelize_1.DataTypes.DECIMAL(4, 2),
        Wholesale: sequelize_1.DataTypes.DECIMAL(4, 2),
        Retail: sequelize_1.DataTypes.DECIMAL(4, 2),
        AccomodationFoodServices: sequelize_1.DataTypes.DECIMAL(4, 2),
        TransportWarehousing: sequelize_1.DataTypes.DECIMAL(4, 2),
        ITMediaTelecommunications: sequelize_1.DataTypes.DECIMAL(4, 2),
        FinancialInsurance: sequelize_1.DataTypes.DECIMAL(4, 2),
        RentalHiringRealEstate: sequelize_1.DataTypes.DECIMAL(4, 2),
        ProfessionalScientificTechnical: sequelize_1.DataTypes.DECIMAL(4, 2),
        AdministrativeSupport: sequelize_1.DataTypes.DECIMAL(4, 2),
        PublicAdministration: sequelize_1.DataTypes.DECIMAL(4, 2),
        EducationTraining: sequelize_1.DataTypes.DECIMAL(4, 2),
        HealthCareSocial: sequelize_1.DataTypes.DECIMAL(4, 2),
        ArtsRecreation: sequelize_1.DataTypes.DECIMAL(4, 2),
        Other: sequelize_1.DataTypes.DECIMAL(4, 2),
        MainEmployingIndustry: sequelize_1.DataTypes.STRING(44)
    });
}
exports.TownFactory = TownFactory;
