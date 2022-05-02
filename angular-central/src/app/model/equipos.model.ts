export interface ResultadoEquipos {
    equipos: Equipo[];
}

export interface Equipo {
    nombre: string
    evaluadores: Evaluacion[];
}

export interface Evaluacion {
    NombreEvaluador: string;
    TipoRelacion: string;
    Estatus: number;
    Reporte? : string;
}
