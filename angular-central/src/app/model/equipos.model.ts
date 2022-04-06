export interface ResultadoEquipos {
    equipos: Equipo[];
}

export interface Equipo {
    nombre: string
    evaluadores: Evaluacion[];
}

export interface Evaluacion {
    nombreEvaluador: string;
    tipoRelacion: string;
}
