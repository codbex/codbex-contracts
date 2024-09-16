import { EmployeeContractItemRepository } from "../../gen/codbex-contracts/dao/EmployeeContracts/EmployeeContractItemRepository";

export const trigger = (event) => {

    const EmployeeContractItemDao = new EmployeeContractItemRepository();

    const operation = event.operation;
    const contractItem = event.entity;

    if (operation === "create") {

        const medicalCertificate = {
            "Name": "Medical Certificate",
            "EmployeeContract": contractItem.Id
        }

        const bankAccountDetails = {
            "Name": "Bank Account Details",
            "EmployeeContract": contractItem.Id
        }

        const criminalRecordCerificate = {
            "Name": "Criminal Record Cerificate",
            "EmployeeContract": contractItem.Id
        }

        console.log("here");

        EmployeeContractItemDao.create(medicalCertificate);
        EmployeeContractItemDao.create(bankAccountDetails);
        EmployeeContractItemDao.create(criminalRecordCerificate);
    }

}