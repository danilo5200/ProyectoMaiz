
-- 1. LIMPIEZA PREVIA (Opcional, útil si estás reiniciando el esquema)

DROP FUNCTION IF EXISTS public.crear_perfil_automatico();
DROP TABLE IF EXISTS public.diagnosticos;
DROP TABLE IF EXISTS public.perfiles;


-- 2. CREACIÓN DE TABLAS

-- Tabla de Perfiles
CREATE TABLE public.perfiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    nombre_completo TEXT,
    ubicacion_cultivo TEXT, -- Ej: 'Vereda Las Cruces, Ipiales'
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Tabla de Diagnósticos (El núcleo del proyecto)
CREATE TABLE public.diagnosticos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    productor_id UUID REFERENCES public.perfiles(id) ON DELETE CASCADE NOT NULL,
    resultado_enfermedad TEXT NOT NULL, -- Ej: 'Roya Común', 'Sana'
    nivel_confianza DECIMAL(5,2), 
    ruta_imagen TEXT, 
    fecha_analisis TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 3. POLÍTICAS DE SEGURIDAD (ROW LEVEL SECURITY - RLS)

ALTER TABLE public.perfiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnosticos ENABLE ROW LEVEL SECURITY;

-- Políticas para Perfiles:
-- Nota: No habilitamos el INSERT público porque el Trigger (abajo) lo hará automáticamente
CREATE POLICY "Ver propio perfil" ON public.perfiles 
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Editar propio perfil" ON public.perfiles 
    FOR UPDATE USING (auth.uid() = id);

-- Políticas para Diagnósticos:
CREATE POLICY "Ver propios diagnosticos" ON public.diagnosticos 
    FOR SELECT USING (auth.uid() = productor_id);

CREATE POLICY "Insertar propios diagnosticos" ON public.diagnosticos 
    FOR INSERT WITH CHECK (auth.uid() = productor_id);

-- 4. AUTOMATIZACIÓN (TRIGGERS) PARA REGISTRO ROBUSTO

-- Función que se ejecuta con privilegios elevados (SECURITY DEFINER) para crear el perfil
CREATE OR REPLACE FUNCTION public.crear_perfil_automatico()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.perfiles (id, nombre_completo, ubicacion_cultivo)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'nombre_completo', -- Extrae el nombre enviado desde el Frontend
    '' -- Se inicializa vacío para que el productor lo llene luego
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Disparador que vigila cuando Supabase Auth crea un usuario
CREATE TRIGGER al_crear_usuario
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.crear_perfil_automatico();
