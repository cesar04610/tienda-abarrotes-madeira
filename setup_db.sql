-- Create Proveedores Table
CREATE TABLE IF NOT EXISTS public."Proveedores" (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nombre TEXT NOT NULL,
    telefono TEXT,
    empresa TEXT,
    productos TEXT,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Compras Table
CREATE TABLE IF NOT EXISTS public."Compras" (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    proveedor_id UUID REFERENCES public."Proveedores"(id) NOT NULL,
    fecha TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    monto_total NUMERIC(10, 2) NOT NULL
);

-- Create Actividades (Catalog) Table
CREATE TABLE IF NOT EXISTS public."Actividades" (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    descripcion TEXT NOT NULL,
    tipo TEXT NOT NULL, -- 'fija' or 'adicional'
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Asignaciones Table
CREATE TABLE IF NOT EXISTS public."Asignaciones" (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    actividad_id UUID REFERENCES public."Actividades"(id) NOT NULL,
    caja INTEGER NOT NULL,
    turno TEXT NOT NULL, -- 'mañana' or 'tarde'
    fecha DATE NOT NULL,
    completado BOOLEAN DEFAULT false,
    empleado_id INTEGER REFERENCES public."Empleados"(id), -- Assuming integer id from previous Employee table
    evidencia_url TEXT,
    hora_completado TIMESTAMP WITH TIME ZONE
);
