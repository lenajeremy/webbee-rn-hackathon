
export enum CategoryFieldType {
    text = 'Text',
    boolean = 'Boolean',
    date = "Date",
    number = "Number"
}

export interface CategoryFields {
    key: string,
    type: CategoryFieldType,
    id: string,
}

export interface Category {
    id: string,
    name: string,
    fields: CategoryFields[],
    titleField: string | null,
}

export interface Machine {
    id: string,
    typeId: Category['id'],
    attributes: (CategoryFields & {
        value: string | boolean | number
    })[]
}