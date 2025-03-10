import { useState, useEffect } from "react";

function App() {
  const [numCiclos, setNumCiclos] = useState(2);
  const [tiempoCicloMin, setTiempoCicloMin] = useState(0.1);
  const [tiempoDescansoMin, setTiempoDescansoMin] = useState(0.1);

  const tiempoCiclo = tiempoCicloMin * 60;
  const tiempoDescanso = tiempoDescansoMin * 60;
  const tiempoTotal = (tiempoCiclo + tiempoDescanso) * numCiclos;

  const [tiempoSesionRestante, setTiempoSesionRestante] = useState(tiempoTotal);
  const [tiempoPractica, setTiempoPractica] = useState(tiempoCiclo);
  const [tiempoDescansoActual, setTiempoDescansoActual] = useState(tiempoDescanso);
  const [cicloActual, setCicloActual] = useState(0); // Comienza en 0
  const [enPractica, setEnPractica] = useState(true);
  const [corriendo, setCorriendo] = useState(false);

  useEffect(() => {
    let intervalo;

    if (corriendo && tiempoSesionRestante > 0) {
      intervalo = setInterval(() => {
        setTiempoSesionRestante((prev) => prev - 1);

        if (enPractica) {
          setTiempoPractica((prev) => {
            if (prev > 1) return prev - 1;

            // Cuando termina la práctica, iniciar descanso en el mismo instante
            
            if (tiempoDescanso > 0) {
              setEnPractica(false);
              setTiempoDescansoActual(tiempoDescanso);
            }
            else {
              setTiempoDescansoActual((prev) => {
                if (prev > 1) return prev - 1;
                // Cuando termina el descanso, incrementar ciclos completados
                setCicloActual( cicloActual + 1); // Incrementar ciclos completados
    
                // Si aún hay ciclos pendientes, iniciar nuevo ciclo
                if (cicloActual < numCiclos) {
                  setEnPractica(true); // Volver a la práctica
                  setTiempoPractica(tiempoCiclo); // Restablecer tiempo de práctica
                  setTiempoDescansoActual(tiempoDescanso); // Restablecer tiempo de descanso
                } else {
                  setCorriendo(false); // Detener cuando se completan todos los ciclos
                }
                return 0;
              });
            }
            
            return 0;
          });
        } else {
          setTiempoDescansoActual((prev) => {
            if (prev > 1) return prev - 1;
            // Cuando termina el descanso, incrementar ciclos completados
            setCicloActual( cicloActual + 1); // Incrementar ciclos completados

            // Si aún hay ciclos pendientes, iniciar nuevo ciclo
            if (cicloActual < numCiclos) {
              setEnPractica(true); // Volver a la práctica
              setTiempoPractica(tiempoCiclo); // Restablecer tiempo de práctica
              setTiempoDescansoActual(tiempoDescanso); // Restablecer tiempo de descanso
            } else {
              setCorriendo(false); // Detener cuando se completan todos los ciclos
            }
            return 0;
          });
        }
      }, 1000);
    } else {
      console.log("else")
      clearInterval(intervalo);
    }

    return () => clearInterval(intervalo);
  }, [corriendo, cicloActual, enPractica, tiempoPractica, tiempoDescansoActual, tiempoSesionRestante, numCiclos, tiempoCiclo, tiempoDescanso]);

  const iniciarPausar = () => setCorriendo(!corriendo);

  const reiniciar = () => {
    setCorriendo(false);
    setTiempoSesionRestante(tiempoTotal);
    setCicloActual(0); // Reiniciar ciclos completados a 0
    setEnPractica(true);
    setTiempoPractica(tiempoCiclo);
    setTiempoDescansoActual(tiempoDescanso);
  };

  const formatoTiempo = (segundos) => {
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;
    return `${minutos}:${segundosRestantes < 10 ? "0" : ""}${segundosRestantes}`;
  };

  return (
    <div style={{ textAlign: "center", padding: "20px", backgroundColor: "black", color: '#f0f0f0', height:'100vh' }}>
      <h1>Temporizador de Entrenamiento</h1>

      <div>
        <label>Número de ejercicios:</label>
        <input
          type="number"
          value={numCiclos}
          onChange={(e) => setNumCiclos(Number(e.target.value))}
        />
      </div>

      <div>
        <label>Tiempo de práctica (minutos):</label>
        <input
          type="number"
          step="0.1"
          value={tiempoCicloMin}
          onChange={(e) => setTiempoCicloMin(Number(e.target.value))}
        />
      </div>

      <div>
        <label>Tiempo de descanso (minutos):</label>
        <input
          type="number"
          step="0.1"
          value={tiempoDescansoMin}
          onChange={(e) => setTiempoDescansoMin(Number(e.target.value))}
        />
      </div>

      <h2>Tiempo total restante de sesión: {formatoTiempo(tiempoSesionRestante)}</h2>
      <h2>Ejercicios completados: {cicloActual} de {numCiclos}</h2>

      <h2 style={{ color: enPractica ? "green" : "gray" }}>
        Tiempo de práctica restante: {formatoTiempo(tiempoPractica)}
      </h2>

      <h2 style={{ color: !enPractica ? "blue" : "gray" }}>
        Tiempo de descanso restante: {formatoTiempo(tiempoDescansoActual)}
      </h2>

      <button onClick={iniciarPausar}>{corriendo ? "Pausar" : "Iniciar"}</button>
      <button onClick={reiniciar}>Reiniciar</button>
    </div>
  );
}

export default App;