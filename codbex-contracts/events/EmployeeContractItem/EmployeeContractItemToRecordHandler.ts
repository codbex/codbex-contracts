import { EmployeeContractItemRepository } from "../../gen/codbex-contracts/dao/EmployeeContracts/EmployeeContractItemRepository";

export const trigger = (event) => {

    const EmployeeContractItemDao = new EmployeeContractItemRepository();

    const operation = event.operation;
    const contractItem = event.entity;

    if (operation === "create") {

        const laborCodeNotification = {
            "Name": "Notification under Article 62, Paragraph 5 of the Labor Code",
            "EmployeeContract": contractItem.Id
        }

        const jobDescription = {
            "Name": "Job Description",
            "EmployeeContract": contractItem.Id
        }

        const medicalCertificate = {
            "Name": "Medical Certificate",
            "EmployeeContract": contractItem.Id
        }

        const bankAccountDetails = {
            "Name": "Bank Account Details",
            "EmployeeContract": contractItem.Id
        }

        const initialSafetyBriefing = {
            "Name": "Initial Safety Briefing",
            "EmployeeContract": contractItem.Id
        }

        const safetyBriefingFor2024 = {
            "Name": "Safety Briefing for 2024",
            "EmployeeContract": contractItem.Id
        }

        const criminalRecordCerificate = {
            "Name": "Criminal Record Cerificate",
            "EmployeeContract": contractItem.Id
        }

        const safetyDeclaration = {
            "Name": "Safety Declaration",
            "EmployeeContract": contractItem.Id
        }

        const safetyQuestionnaire = {
            "Name": "Safety Questionnaire",
            "EmployeeContract": contractItem.Id
        }

        EmployeeContractItemDao.create(laborCodeNotification);
        EmployeeContractItemDao.create(jobDescription);
        EmployeeContractItemDao.create(medicalCertificate);
        EmployeeContractItemDao.create(bankAccountDetails);
        EmployeeContractItemDao.create(initialSafetyBriefing);
        EmployeeContractItemDao.create(safetyBriefingFor2024);
        EmployeeContractItemDao.create(criminalRecordCerificate);
        EmployeeContractItemDao.create(safetyQuestionnaire);
        EmployeeContractItemDao.create(safetyDeclaration);

    }

}