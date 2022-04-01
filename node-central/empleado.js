class Empleado{
    constructor(idempleado,nombre,correo){
        this.idempleado = idempleado;
        this.nombre = nombre;
        this.correo = correo;
    }
}

class Relationship {
    constructor(evaluador_,tipo_){
        this.evaluador = evaluador_;
        this.tipo = tipo_;
    }
}

class Empleado {
    constructor(nombre_){
        this.nombre = nombre_;
        this.evaluadores = [];
    }
}

module.exports = Empleado;