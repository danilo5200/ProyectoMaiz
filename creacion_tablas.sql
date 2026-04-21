--  Tabla de Perfiles (Se vincula automáticamente con el usuario registrado)
CREATE TABLE perfiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    nombre_completo TEXT,
    ubicacion_cultivo TEXT, -- Ej: 'Vereda Las Cruces, Ipiales'
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Tabla de Diagnósticos (El núcleo del proyecto)
CREATE TABLE diagnosticos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    productor_id UUID REFERENCES perfiles(id) ON DELETE CASCADE NOT NULL,
    resultado_enfermedad TEXT NOT NULL, -- Ej: 'Roya Común', 'Sana'
    nivel_confianza DECIMAL(5,2), -- Preparado para el futuro: guardará el % de exactitud de la IA (ej: 95.50)
    ruta_imagen TEXT, -- Preparado para guardar la ruta de la foto en Supabase Storage
    fecha_analisis TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Políticas de Seguridad (Row Level Security - RLS)

ALTER TABLE perfiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnosticos ENABLE ROW LEVEL SECURITY;

-- Política: Un productor solo puede ver y editar su propio perfil
CREATE POLICY "Ver propio perfil" ON perfiles 
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Editar propio perfil" ON perfiles 
    FOR UPDATE USING (auth.uid() = id);

-- Política: Un productor solo puede ver e insertar sus propios diagnósticos
CREATE POLICY "Ver propios diagnosticos" ON diagnosticos 
    FOR SELECT USING (auth.uid() = productor_id);
CREATE POLICY "Insertar propios diagnosticos" ON diagnosticos 
    FOR INSERT WITH CHECK (auth.uid() = productor_id);
