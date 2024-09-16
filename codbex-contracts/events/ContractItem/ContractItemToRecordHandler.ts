import { ContractItemRepository } from "../../gen/codbex-contracts/dao/Contract/ContractItemRepository";

export const trigger = (event) => {

    const ContractItemDao = new ContractItemRepository();

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

        ContractItemDao.create(medicalCertificate);
        ContractItemDao.create(bankAccountDetails);
        ContractItemDao.create(criminalRecordCerificate);
    }

}