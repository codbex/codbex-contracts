import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface ContractItemEntity {
    readonly Id: number;
    Name?: string;
    Url?: string;
    Contract?: number;
}

export interface ContractItemCreateEntity {
    readonly Name?: string;
    readonly Url?: string;
    readonly Contract?: number;
}

export interface ContractItemUpdateEntity extends ContractItemCreateEntity {
    readonly Id: number;
}

export interface ContractItemEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Name?: string | string[];
            Url?: string | string[];
            Contract?: number | number[];
        };
        notEquals?: {
            Id?: number | number[];
            Name?: string | string[];
            Url?: string | string[];
            Contract?: number | number[];
        };
        contains?: {
            Id?: number;
            Name?: string;
            Url?: string;
            Contract?: number;
        };
        greaterThan?: {
            Id?: number;
            Name?: string;
            Url?: string;
            Contract?: number;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Name?: string;
            Url?: string;
            Contract?: number;
        };
        lessThan?: {
            Id?: number;
            Name?: string;
            Url?: string;
            Contract?: number;
        };
        lessThanOrEqual?: {
            Id?: number;
            Name?: string;
            Url?: string;
            Contract?: number;
        };
    },
    $select?: (keyof ContractItemEntity)[],
    $sort?: string | (keyof ContractItemEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface ContractItemEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<ContractItemEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface ContractItemUpdateEntityEvent extends ContractItemEntityEvent {
    readonly previousEntity: ContractItemEntity;
}

export class ContractItemRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_CONTRACTITEM",
        properties: [
            {
                name: "Id",
                column: "CONTRACTITEM_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Name",
                column: "CONTRACTITEM_NAME",
                type: "VARCHAR",
            },
            {
                name: "Url",
                column: "CONTRACTITEM_URL",
                type: "VARCHAR",
            },
            {
                name: "Contract",
                column: "CONTRACTITEM_CONTRACT",
                type: "INTEGER",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(ContractItemRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: ContractItemEntityOptions): ContractItemEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): ContractItemEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: ContractItemCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_CONTRACTITEM",
            entity: entity,
            key: {
                name: "Id",
                column: "CONTRACTITEM_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: ContractItemUpdateEntity): void {
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_CONTRACTITEM",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "CONTRACTITEM_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: ContractItemCreateEntity | ContractItemUpdateEntity): number {
        const id = (entity as ContractItemUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as ContractItemUpdateEntity);
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
            table: "CODBEX_CONTRACTITEM",
            entity: entity,
            key: {
                name: "Id",
                column: "CONTRACTITEM_ID",
                value: id
            }
        });
    }

    public count(options?: ContractItemEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_CONTRACTITEM"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: ContractItemEntityEvent | ContractItemUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-contracts-Contract-ContractItem", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-contracts-Contract-ContractItem").send(JSON.stringify(data));
    }
}
