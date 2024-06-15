export interface Item {
    img: string;
    id: number;
    date: string;
    job: string;
    enterprise: string;
    city: string;
    description: string;
}
export interface Resume {
    experience: Item[];
    education: Item[];
}