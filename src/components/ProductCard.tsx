import { useState } from "react";

const OPCIONES = {
  litros: [0.25, 0.5, 1, 2],
  gramos: [100, 250, 500, 1000],
  unidades: [1, 2, 6, 12],
};

function ProductCard({ producto, cantidad, onOpen }) {
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState(OPCIONES[producto.tipo][0]);

  const handleSend = () => {
    // Simula el envío a la ventana Calorías (pendiente de implementar)
    console.log("Enviado a Calorías:", {
      id: producto.id,
      nombre: producto.nombre,
      tipo: producto.tipo,
      cantidad: selected,
    });
    alert(`Enviado a Calorías: ${selected} ${producto.tipo} de ${producto.nombre}`);
    setExpanded(false);
  };

  return (
    <div className="card-wrap">

      {/* CARD PRINCIPAL — click abre el modal de info */}
      <div className="card" onClick={() => onOpen(producto)}>
        <div className="dot" />

        <div className="prod-info">
          <div className="prod-name">{producto.nombre}</div>
          <div className="prod-sub">
            {cantidad} {producto.tipo}
          </div>
        </div>

        <button
          className={`expand-btn ${expanded ? "open" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
          aria-label="Expandir opciones"
        >
          ›
        </button>
      </div>

      {/* PANEL EXPANDIBLE — envío a Calorías */}
      {expanded && (
        <div className="expand-panel">
          <p className="expand-label">
            Seleccionar cantidad ({producto.tipo})
          </p>

          <div className="expand-options">
            {OPCIONES[producto.tipo].map((opt) => (
              <button
                key={opt}
                className={`opt-btn ${selected === opt ? "active" : ""}`}
                onClick={() => setSelected(opt)}
              >
                {opt}
              </button>
            ))}
          </div>

          <button className="send-btn" onClick={handleSend}>
            Enviar a Calorías
          </button>
        </div>
      )}

    </div>
  );
}

export default ProductCard;