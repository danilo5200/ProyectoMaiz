// Configuración de Supabase
const supabaseUrl = 'https://axffgzfbqsirwqzhrurm.supabase.co'; // Reemplaza con tu URL de Supabase
const supabaseKey = 'sb_publishable_W_dEvWHlEJcRXm44MqIIvQ_b8rgfVFZ'; // Reemplaza con tu clave anónima
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

// ==========================================
// REFERENCIAS A LA INTERFAZ
// ==========================================
const loginCard = document.getElementById('login-card');
const registerCard = document.getElementById('register-card');
const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');

// ==========================================
// 1. NAVEGACIÓN ENTRE TARJETAS (Registro <-> Login)
// ==========================================

// Mostrar el formulario de Iniciar Sesión
document.getElementById('show-login').addEventListener('click', (e) => {
    e.preventDefault(); // Evita que la página recargue
    registerCard.classList.add('hidden');
    loginCard.classList.remove('hidden');
});

// Mostrar el formulario de Registro
document.getElementById('show-register').addEventListener('click', (e) => {
    e.preventDefault(); // Evita que la página recargue
    loginCard.classList.add('hidden');
    registerCard.classList.remove('hidden');
});

// ==========================================
// 2. SIMULACIÓN DE REGISTRO E INICIO DE SESIÓN
// ==========================================

// Simular Registro
function registrarUsuario() {
    const nombre = document.getElementById('reg-nombre').value;
    const email = document.getElementById('reg-email').value;

    if (!nombre || !email) {
        alert("Por favor, completa al menos tu nombre y correo para probar.");
        return;
    }

    alert("¡Simulación de Registro exitosa!\n\nAhora te llevaremos al inicio de sesión.");
    
    // Cambiar visualmente a la tarjeta de Login
    registerCard.classList.add('hidden');
    loginCard.classList.remove('hidden');
    
    // Pre-llenar el correo para comodidad en la prueba
    document.getElementById('login-email').value = email;
}

// Simular Inicio de Sesión
function iniciarSesion() {
    const email = document.getElementById('login-email').value;

    if (!email) {
        alert("Ingresa un correo para probar el ingreso.");
        return;
    }

    // Ocultar sección de login y mostrar el Dashboard
    loginSection.style.display = 'none';
    dashboardSection.style.display = 'block';
    
    // Actualizar mensaje de bienvenida
    document.getElementById('welcome-user').innerText = `Bienvenido, Productor`;
}

// Simular Cerrar Sesión
function cerrarSesion() {
    // Ocultar Dashboard y volver al Login
    loginSection.style.display = 'block';
    dashboardSection.style.display = 'none';
    
    // Limpiar campos y resultados
    document.getElementById('resultado-box').classList.add('hidden');
    document.getElementById('foto-hoja').value = "";
}

// ==========================================
// 3. SIMULACIÓN DE ANÁLISIS CON IA
// ==========================================
function analizarHoja() {
    const fileInput = document.getElementById('foto-hoja');
    const resultadoBox = document.getElementById('resultado-box');

    if (fileInput.files.length === 0) {
        alert("Por favor, selecciona una foto de tu computadora primero.");
        return;
    }

    // Mostrar mensaje de carga
    resultadoBox.classList.remove('hidden');
    resultadoBox.innerText = "Analizando la hoja con FitoScan AI...\nPor favor espera.";
    resultadoBox.style.backgroundColor = "#FFF3E0"; 
    resultadoBox.style.color = "#E65100";

    // Simular 2 segundos de espera (como si consultara a AWS)
    setTimeout(() => {
        const enfermedades = ['Roya Común', 'Tizón del Maíz', 'Mancha Foliar Gris', 'Hoja Sana'];
        const diagnostico = enfermedades[Math.floor(Math.random() * enfermedades.length)];
        const confianza = (Math.random() * (99.9 - 85.0) + 85.0).toFixed(2); 

        // Mostrar resultado final
        resultadoBox.innerText = `Diagnóstico: ${diagnostico}\nNivel de Confianza: ${confianza}%`;
        resultadoBox.style.backgroundColor = "#E8F5E9";
        resultadoBox.style.color = "#2E7D32";
    }, 2000);
}

// ==========================================
// 4. INICIALIZAR BOTONES
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('btn-register').addEventListener('click', registrarUsuario);
    document.getElementById('btn-login').addEventListener('click', iniciarSesion);
    document.getElementById('btn-logout').addEventListener('click', cerrarSesion);
    document.getElementById('btn-analizar').addEventListener('click', analizarHoja);
});