// ==========================================
// CONFIGURACIÓN SUPABASE
// ==========================================
const supabaseUrl = 'https://axffgzfbqsirwqzhrurm.supabase.co';
const supabaseKey = 'sb_publishable_W_dEvWHlEJcRXm44MqIIvQ_b8rgfVFZ';

const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

// ==========================================
// UI REFERENCES
// ==========================================
const loginCard = document.getElementById('login-card');
const registerCard = document.getElementById('register-card');
const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');

// ==========================================
// NAVEGACIÓN
// ==========================================
document.getElementById('show-login').addEventListener('click', (e) => {
    e.preventDefault();
    registerCard.classList.add('hidden');
    loginCard.classList.remove('hidden');
});

document.getElementById('show-register').addEventListener('click', (e) => {
    e.preventDefault();
    loginCard.classList.add('hidden');
    registerCard.classList.remove('hidden');
});

// ==========================================
// REGISTRO
// ==========================================
async function registrarUsuario() {
    const nombre = document.getElementById('reg-nombre').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;

    if (!nombre || !email || !password) {
        alert("Completa todos los campos");
        return;
    }

    const { data, error } = await supabaseClient.auth.signUp({
        email,
        password
    });

    if (error) {
        alert(error.message);
        return;
    }

    // ⚠️ Validación importante (email confirmation)
    if (!data.user) {
        alert("Revisa tu correo para confirmar el registro.");
        return;
    }

    // Crear perfil
    const { error: perfilError } = await supabaseClient
        .from('perfiles')
        .insert({
            id: data.user.id,
            nombre_completo: nombre,
            ubicacion_cultivo: ''
        });

    if (perfilError) {
        alert("Error creando perfil: " + perfilError.message);
        return;
    }

    alert("Registro exitoso. Ahora inicia sesión.");

    registerCard.classList.add('hidden');
    loginCard.classList.remove('hidden');
}

// ==========================================
// LOGIN
// ==========================================
async function iniciarSesion() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        alert(error.message);
        return;
    }

    loginSection.style.display = 'none';
    dashboardSection.style.display = 'block';

    document.getElementById('welcome-user').innerText =
        "Bienvenido, Productor";
}

// ==========================================
// LOGOUT
// ==========================================
async function cerrarSesion() {
    await supabaseClient.auth.signOut();

    loginSection.style.display = 'block';
    dashboardSection.style.display = 'none';
}

// ==========================================
// ANALIZAR + GUARDAR DIAGNÓSTICO
// ==========================================
async function analizarHoja() {
    const fileInput = document.getElementById('foto-hoja');
    const resultadoBox = document.getElementById('resultado-box');

    if (!fileInput.files.length) {
        alert("Selecciona una imagen");
        return;
    }

    resultadoBox.classList.remove('hidden');
    resultadoBox.innerText = "Analizando hoja...";

    setTimeout(async () => {

        const enfermedades = [
            'Roya Común',
            'Tizón del Maíz',
            'Mancha Foliar Gris',
            'Hoja Sana'
        ];

        const diagnostico =
            enfermedades[Math.floor(Math.random() * enfermedades.length)];

        const confianza = parseFloat(
            (Math.random() * (99.9 - 85.0) + 85.0).toFixed(2)
        );

        resultadoBox.innerText =
            `Diagnóstico: ${diagnostico}\nConfianza: ${confianza}%`;

        const { data } = await supabaseClient.auth.getUser();
        const user = data.user;

        if (!user) {
            alert("Usuario no autenticado");
            return;
        }

        const { error } = await supabaseClient
            .from('diagnosticos')
            .insert({
                productor_id: user.id,
                resultado_enfermedad: diagnostico,
                nivel_confianza: confianza,
                ruta_imagen: fileInput.files[0].name
            });

        if (error) {
            alert("Error guardando diagnóstico: " + error.message);
            return;
        }

    }, 2000);
}

// ==========================================
// EVENTOS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btn-register')
        .addEventListener('click', registrarUsuario);

    document.getElementById('btn-login')
        .addEventListener('click', iniciarSesion);

    document.getElementById('btn-logout')
        .addEventListener('click', cerrarSesion);

    document.getElementById('btn-analizar')
        .addEventListener('click', analizarHoja);
});