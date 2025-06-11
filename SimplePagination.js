class Pagination {
    constructor() {
        
        //Declaración de variables globales
        this.registros = null;
        this.cantidadRegistrosMostrados = 5;
        this.CantidadRegistros = 0;
        this.mostrarRegistros = [[]];
        this.indicepagina = 0;
        this.indiceActual = 0;
        this.estructura = null;

        //creación de eventos clic en los iconos de paginación
        const primerPagina = document.querySelector(".PrimerPagina");
        primerPagina.addEventListener("click", () => this.primeraPagina());

        const atras = document.querySelector(".atrasPagina");
        atras.addEventListener("click", () => this.atrasPagina());

        const adelante = document.querySelector(".adeltantePagina");
        adelante.addEventListener("click", () => this.adelantePagina());

        const UltimaPagina = document.querySelector(".UltimaPagina");
        UltimaPagina.addEventListener("click", () => this.ultimaPagina());
    }

    //Cambia el valor default de los registros mostrados.
    ingresarCantidadRegistrosMostrados(cantidad = 5) {
        this.cantidadRegistrosMostrados = cantidad;
    }

    //obtener los datos que se estan mostrando en la tabla actualmente.
    obtenerDatosMostrar()
    {
        return this.mostrarRegistros[this.indiceActual];
    }

    //Ingresar los datos que queremos paginar.
    cargarDatos(datos) {
        this.registros = datos;
    }

    //Proporcionar la estructura de la tabla.
    ingresarEstructura(estructura)
    {
        this.estructura = estructura;

        // Crear un conjunto (Set) de nombres de propiedades en el arreglo de objetos
        const propiedades = new Set(Object.keys(this.registros[0]));
    
        // Verificar si todas las propiedades en datos existen en el conjunto
        const propiedadesNoEncontradas = this.estructura.filter(dato => !propiedades.has(dato));
        
        if (propiedadesNoEncontradas.length > 0) {
            // Generar un mensaje de error si alguna propiedad no se encuentra
            const camposFaltantes = propiedadesNoEncontradas.join(', ');
            const mensajeError = `El campo(s) ${camposFaltantes} no existe en los datos proporcionados.`;
            throw new Error(mensajeError);
        }
        else
        {
            //Iniciar la paginación y mostar los datos en la tabla.
            this.paginacion()
            this.generarTabla(this.estructura,this.mostrarRegistros[this.indiceActual])
        }
    }

    //Crear la estructura html de la tabla e insertarla.
    generarTabla(datos, arregloObjetos) {
        
        let tablaHTML="";
        
        // Crear filas de datos para cada objeto en el arreglo de objetos
        for (const objeto of arregloObjetos) {
            tablaHTML += '<tr class="trPagination">';
            for (const dato of datos) {
                tablaHTML += `<td class="tdPagination" style="text-align: center;">${objeto[dato]}</td>`;
            }
            tablaHTML += '</tr>';
        }
        
        //Insertar datos a la tabla
        document.querySelector(".paginationBody").innerHTML = tablaHTML;
    }
    
    //Generar los datos de paginación
    paginacion() 
    {
        //declaración de variables internas
        let i = 0;
        let cantidadPaginas = 0;
        let cantidadResiduos = 0;

        //Verificar si existira mas de una página
        if (this.registros.length <= this.cantidadRegistrosMostrados) {
            cantidadPaginas++;
        } 
        else
        {   
            
            let residuo = this.registros.length % this.cantidadRegistrosMostrados;
            //Verificar si el podemos sacar la cantidad de págias con una división simple
            if (residuo == 0) 
            {
                cantidadPaginas = this.registros.length / this.cantidadRegistrosMostrados;
            } 
            else //Calcular la cantidad de páginas
            {
                let residuoi = 1;
                let cantidadRegistros = this.registros.length;
                while (residuoi != 0) 
                {
                    residuoi = cantidadRegistros % this.cantidadRegistrosMostrados;

                    if (residuoi != 0) 
                    {
                        cantidadRegistros--;
                        cantidadResiduos++;
                    }
                }

                cantidadPaginas = cantidadRegistros / this.cantidadRegistrosMostrados;

                cantidadPaginas++;
            }

            //Mostrar y ocultar iconos de paginación
            if (cantidadPaginas == 1)
            {
                document.querySelector(".UltimaPagina").style.display = "none";
                document.querySelector(".adeltantePagina").style.display = "none";
            }
            else 
            {
                document.querySelector(".UltimaPagina").style.display = "block";
                document.querySelector(".adeltantePagina").style.display = "block";
            }
        }

        //Acomodar los datos ingresados en un arreglo para mostrarlos segun la lógica de paginación
        let y = 0;
        this.CantidadRegistros = this.registros.length;
        for (let index = 0; index < cantidadPaginas; index++) 
        {
            for (i; i < this.registros.length; i++) 
            {
                y = i + 1;

                this.mostrarRegistros[index].push(this.registros[i]);

                if (i != 0) 
                {
                    if (y % this.cantidadRegistrosMostrados == 0) 
                    {
                        i = this.registros.length - 1;
                    } 
                    else if (i == (((cantidadPaginas - 1) * this.cantidadRegistrosMostrados) + cantidadResiduos) - 1) 
                    {
                        i = this.registros.length;
                    }
                }
            }

            i = y;
            this.mostrarRegistros.push([]);
        }

        this.CantidadRegistros = this.registros.length;
        this.cantidadPaginas = cantidadPaginas;
        this.moverPaginas(0);
    }

    //Mostrar los iconos de paginación correspondientes a la página a mostrar.
    moverPaginas(indice) 
    {
        this.indicepagina = indice;

        //Mostrar iconos cuando la página seleccionada es la primera
        if (indice == 0) 
        {
            document.querySelector(".PrimerPagina").style.display = "none";
            document.querySelector(".atrasPagina").style.display = "none";
            document.querySelector(".UltimaPagina").style.display = "block";
            document.querySelector(".adeltantePagina").style.display = "block";
        }

        //Mostrar iconos cuando solo existe una página
        if (this.CantidadRegistros <= this.cantidadRegistrosMostrados) 
        {
            document.querySelector(".PrimerPagina").style.display = "none";
            document.querySelector(".atrasPagina").style.display = "none";
            document.querySelector(".UltimaPagina").style.display = "none";
            document.querySelector(".adeltantePagina").style.display = "none";
        }

        //Calcularel cual es el primer y ultimo registro que se esta mostrando
        this.indiceActual = indice;
        let mostrado;
        let primerRegistro;

        if (indice == 0) 
        {
            mostrado = this.cantidadRegistrosMostrados;
            primerRegistro = mostrado - (this.cantidadRegistrosMostrados - 1);
            if (mostrado > this.CantidadRegistros) 
            {
                mostrado = this.CantidadRegistros;
                document.querySelector(".UltimaPagina").style.display = "none";
                document.querySelector(".adeltantePagina").style.display = "none";
            }

            if (this.CantidadRegistros == this.cantidadRegistrosMostrados) 
            {
                document.querySelector(".UltimaPagina").style.display = "none";
                document.querySelector(".adeltantePagina").style.display = "none";
            }
        } 
        else 
        {
            mostrado = (indice + 1) * this.cantidadRegistrosMostrados;
            primerRegistro = mostrado - (this.cantidadRegistrosMostrados - 1);
            if (mostrado > this.CantidadRegistros) 
            {
                mostrado = this.CantidadRegistros;
            }
        }

        //Mostrar cuales registros se muestran y la cantidad total de registros.
        this.RegistrosMostrados = "Registros: " + primerRegistro + " al " + mostrado + " de " + this.CantidadRegistros;
        document.querySelector('.registrosMostrados').textContent  = this.RegistrosMostrados;
        this.generarTabla(this.estructura,this.mostrarRegistros[this.indiceActual])
    }

    //Método para mostrar la primer página del total de registros.
    primeraPagina() 
    {
        document.querySelector(".PrimerPagina").style.display = "none";
        document.querySelector(".atrasPagina").style.display = "none";
        document.querySelector(".UltimaPagina").style.display = "block";
        document.querySelector(".adeltantePagina").style.display = "block";
        this.indicepagina = 0;
        this.moverPaginas(this.indicepagina);
    }

    //Método para mostrar pasar a la siguiente página tomando en cuenta la actual.
    adelantePagina() 
    {
        this.indicepagina++;
        document.querySelector(".PrimerPagina").style.display = "block";
        document.querySelector(".atrasPagina").style.display = "block";

        if (this.indicepagina == this.cantidadPaginas - 1) {
            document.querySelector(".UltimaPagina").style.display = "none";
            document.querySelector(".adeltantePagina").style.display = "none";
        }

        this.moverPaginas(this.indicepagina);
    }

    //Método para mostrar la ultima página del total de registros
    ultimaPagina() 
    {
        document.querySelector(".UltimaPagina").style.display = "none";
        document.querySelector(".adeltantePagina").style.display = "none";
        document.querySelector(".PrimerPagina").style.display = "block";
        document.querySelector(".atrasPagina").style.display = "block";
        let ultimapagina = this.cantidadPaginas;
        ultimapagina = ultimapagina - 1;
        this.moverPaginas(ultimapagina);
        this.indicepagina = ultimapagina;
    }

    //Método para retroceder una pagina tomando en cuenta la página actual
    atrasPagina() 
    {
        this.indicepagina--;

        if (this.indicepagina == 0) 
        {
            document.querySelector(".PrimerPagina").style.display = "none";
            document.querySelector(".atrasPagina").style.display = "none";
        }

        document.querySelector(".UltimaPagina").style.display = "block";
        document.querySelector(".adeltantePagina").style.display = "block";

        this.moverPaginas(this.indicepagina);
    }
}

//Creación 26/09/2023 José Carlos Garcia Olivas.
