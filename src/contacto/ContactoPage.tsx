import React, { useState } from 'react';
import './ContactoPage.css'; 
export default function ContactoPage() {
  const [result, setResult] = useState("");

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setResult("Enviando...");

    const form = event.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    formData.append("access_key", "8ba0f1e1-b31d-49d7-a92f-eb8bbd70272b");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      setResult("Formulario enviado exitosamente.");
      form.reset();
    } else {
      console.error("Error", data);
      setResult(data.message);
    }
  };

  return (
    <div className="contacto-page">
      <div className="contact-header">
        <h1>Contáctanos</h1>
        <p>¿Tienes alguna pregunta o comentario? Estamos aquí para ayudarte.</p>
      </div>
      
      <div className="contact-container">
        <div className="contact-info">
          <div className="info-card">
            <div className="info-icon">📧</div>
            <h3>Correo Electrónico</h3>
            <p>diazmarko502@gmail.com</p>
          </div>
          
          <div className="info-card">
            <div className="info-icon">📱</div>
            <h3>Teléfono</h3>
            <p> 99999999</p>
          </div>
          
          <div className="info-card">
            <div className="info-icon">📍</div>
            <h3>Dirección</h3>
            <p>123 Calle Principal, Ciudad</p>
          </div>
        </div>
            
        <form onSubmit={onSubmit} className="contact-form">
          <div className="form-group">
            <label htmlFor="name">Nombre:</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              placeholder="Tu nombre completo" 
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico:</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              placeholder="tu@email.com" 
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="message">Mensaje:</label>
            <textarea 
              id="message" 
              name="message" 
              placeholder="Escribe tu mensaje aquí..." 
              required 
            />
          </div>
          
          <button type="submit">Enviar Mensaje</button>
          
          <div className={`result-message ${result ? 'show' : ''} ${result.includes("exitosamente") ? 'success' : 'error'}`}>
            {result}
          </div>
        </form>
      </div>
    </div>
  );
}