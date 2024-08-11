export type SortOrder = 'ASC' | 'DESC'; 

interface ModuleQueryOptions {
    search: string;
    createdAt: SortOrder; 
}

export default ModuleQueryOptions;