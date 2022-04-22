export interface ResultadoHuerfano {
    huerfanos: Huerfano[];
}
export interface Huerfano {
    nombreHuerfano: string;
    proyectos : ProyectoHuerfano[];
}
export interface ProyectoHuerfano {
    Proyecto: string;
    Lider: string;
}