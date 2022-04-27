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
    estatus: number;
}