import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";
import { EntityUtils } from "../utils/EntityUtils";
// custom imports
import { NumberGeneratorService } from "/codbex-number-generator/service/generator";

export interface ContractEntity {
    readonly Id: number;
    Number?: string;
    StartDate?: Date;
    EndDate?: Date;
    Company?: number;
    Document?: string;
    Type?: number;
    Comment?: string;
}

export interface ContractCreateEntity {
    readonly StartDate?: Date;
    readonly EndDate?: Date;
    readonly Company?: number;
    readonly Document?: string;
    readonly Type?: number;
    readonly Comment?: string;
}

export interface ContractUpdateEntity extends ContractCreateEntity {
    readonly Id: number;
}

export interface ContractEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Number?: string | string[];
            StartDate?: Date | Date[];
            EndDate?: Date | Date[];
            Company?: number | number[];
            Document?: string | string[];
            Type?: number | number[];
            Comment?: string | string[];
        };
        notEquals?: {
            Id?: number | number[];
            Number?: string | string[];
            StartDate?: Date | Date[];
            EndDate?: Date | Date[];
            Company?: number | number[];
            Document?: string | string[];
            Type?: number | number[];
            Comment?: string | string[];
        };
        contains?: {
            Id?: number;
            Number?: string;
            StartDate?: Date;
            EndDate?: Date;
            Company?: number;
            Document?: string;
            Type?: number;
            Comment?: string;
        };
        greaterThan?: {
            Id?: number;
            Number?: string;
            StartDate?: Date;
            EndDate?: Date;
            Company?: number;
            Document?: string;
            Type?: number;
            Comment?: string;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Number?: string;
            StartDate?: Date;
            EndDate?: Date;
            Company?: number;
            Document?: string;
            Type?: number;
            Comment?: string;
        };
        lessThan?: {
            Id?: number;
            Number?: string;
            StartDate?: Date;
            EndDate?: Date;
            Company?: number;
            Document?: string;
            Type?: number;
            Comment?: string;
        };
        lessThanOrEqual?: {
            Id?: number;
            Number?: string;
            StartDate?: Date;
            EndDate?: Date;
            Company?: number;
            Document?: string;
            Type?: number;
            Comment?: string;
        };
    },
    $select?: (keyof ContractEntity)[],
    $sort?: string | (keyof ContractEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface ContractEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<ContractEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface ContractUpdateEntityEvent extends ContractEntityEvent {
    readonly previousEntity: ContractEntity;
}

export class ContractRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_CONTRACT",
        properties: [
            {
                name: "Id",
                column: "CONTRACT_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Number",
                column: "CONTRACT_NUMBER",
                type: "VARCHAR",
            },
            {
                name: "StartDate",
                column: "CONTRACT_STARTDATE",
                type: "DATE",
            },
            {
                name: "EndDate",
                column: "CONTRACT_ENDDATE",
                type: "DATE",
            },
            {
                name: "Company",
                column: "CONTRACT_COMPANY",
                type: "INTEGER",
            },
            {
                name: "Document",
                column: "CONTRACT_URL",
                type: "VARCHAR",
            },
            {
                name: "Type",
                column: "CONTRACT_TYPE",
                type: "INTEGER",
            },
            {
                name: "Comment",
                column: "CONTRACT_COMMENT",
                type: "VARCHAR",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(ContractRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: ContractEntityOptions): ContractEntity[] {
        return this.dao.list(options).map((e: ContractEntity) => {
            EntityUtils.setDate(e, "StartDate");
            EntityUtils.setDate(e, "EndDate");
            return e;
        });
    }

    public findById(id: number): ContractEntity | undefined {
        const entity = this.dao.find(id);
        EntityUtils.setDate(entity, "StartDate");
        EntityUtils.setDate(entity, "EndDate");
        return entity ?? undefined;
    }

    public create(entity: ContractCreateEntity): number {
        EntityUtils.setLocalDate(entity, "StartDate");
        EntityUtils.setLocalDate(entity, "EndDate");
        // @ts-ignore
        (entity as ContractEntity).Number = new NumberGeneratorService().generate(23);
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_CONTRACT",
            entity: entity,
            key: {
                name: "Id",
                column: "CONTRACT_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: ContractUpdateEntity): void {
        // EntityUtils.setLocalDate(entity, "StartDate");
        // EntityUtils.setLocalDate(entity, "EndDate");
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_CONTRACT",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "CONTRACT_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: ContractCreateEntity | ContractUpdateEntity): number {
        const id = (entity as ContractUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as ContractUpdateEntity);
            return id;
        } else {
            return this.create(entity);
        }
    }

    public deleteById(id: number): void {
        const entity = this.dao.find(id);
        this.dao.remove(id);
        this.triggerEvent({
            operation: "delete",
            table: "CODBEX_CONTRACT",
            entity: entity,
            key: {
                name: "Id",
                column: "CONTRACT_ID",
                value: id
            }
        });
    }

    public count(options?: ContractEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_CONTRACT"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: ContractEntityEvent | ContractUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-contracts-Contract-Contract", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-contracts-Contract-Contract").send(JSON.stringify(data));
    }
}
