import { EmployeeContractItemRepository } from "../../gen/codbex-contracts/dao/EmployeeContracts/EmployeeContractItemRepository";

export const trigger = (event) => {

    const EmployeeContractItemDao = new EmployeeContractItemRepository();

    const operation = event.operation;
    const contractItem = event.entity;

    if (operation === "create") {

        const medicalCertificate = {
            "Name": "Medical Certificate",
            "Contract": contractItem.Id
        }

        const bankAccountDetails = {
            "Name": "Bank Account Details",
            "Contract": contractItem.Id
        }

        const criminalRecordCerificate = {
            "Name": "Criminal Record Cerificate",
            "Contract": contractItem.Id
        }

        EmployeeContractItemDao.create(medicalCertificate);
        EmployeeContractItemDao.create(bankAccountDetails);
        EmployeeContractItemDao.create(criminalRecordCerificate);
    }

}