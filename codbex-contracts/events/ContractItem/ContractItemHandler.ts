import { ContractItemRepository } from "../../gen/codbex-contracts/dao/Contract/ContractItemRepository";


export const trigger = (event) => {

    const ContractItemDao = new ContractItemRepository();

    const operation = event.operation;
    const item = event.entity;

    if (operation === "create") {


        const medicalCertificate = {
            "Name": "Medical Certificate",
            "Contract": item.Id
        }

        const bankAccountDetails = {
            "Name": "Bank Account Details",
            "Contract": item.Id
        }

        const criminalRecordCerificate = {
            "Name": "Criminal Record Cerificate",
            "Contract": item.Id
        }

        ContractItemDao.create(medicalCertificate);
        ContractItemDao.create(bankAccountDetails);
        ContractItemDao.create(criminalRecordCerificate);
    }

}