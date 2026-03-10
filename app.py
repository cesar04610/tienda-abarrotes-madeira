from flask import Flask, render_template, request, jsonify, send_file
import os
from dotenv import load_dotenv
from supabase import create_client, Client
import pandas as pd
import io

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Initialize Supabase client
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")
if not url or not key:
    raise ValueError("Missing SUPABASE_URL or SUPABASE_KEY in environment variables (.env file)")

supabase: Client = create_client(url, key)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/empleados', methods=['GET'])
def get_empleados():
    try:
        # Fetch data from Supabase, order by fecha_ingreso descending
        response = supabase.table('Empleados').select('*').order('fecha_ingreso', desc=True).execute()
        
        # response.data contains the list of dictionaries
        return jsonify(response.data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/empleados', methods=['POST'])
def add_empleado():
    data = request.get_json()
    
    nombre = data.get('nombre')
    telefono = data.get('telefono')
    fecha_ingreso = data.get('fecha_ingreso')
    
    if not nombre or not telefono or not fecha_ingreso:
        return jsonify({'error': 'Missing data. Required: nombre, telefono, fecha_ingreso'}), 400
        
    try:
        # Insert data into Supabase
        new_empleado = {
            'nombre': nombre,
            'telefono': telefono,
            'fecha_ingreso': fecha_ingreso
        }
        response = supabase.table('Empleados').insert(new_empleado).execute()
        
        # response.data contains the inserted row(s)
        if len(response.data) > 0:
            return jsonify(response.data[0]), 201
        else:
            return jsonify({'error': 'Failed to insert record'}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# --- API FOR PROVEEDORES ---

@app.route('/api/proveedores', methods=['GET'])
def get_proveedores():
    try:
        response = supabase.table('Proveedores').select('*').order('created_at', desc=True).execute()
        return jsonify(response.data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/proveedores', methods=['POST'])
def add_proveedor():
    data = request.get_json()
    nombre = data.get('nombre')
    
    if not nombre:
        return jsonify({'error': 'Missing data. Required: nombre'}), 400
        
    try:
        new_proveedor = {
            'nombre': nombre,
            'telefono': data.get('telefono', ''),
            'empresa': data.get('empresa', ''),
            'productos': data.get('productos', ''),
            'activo': True
        }
        response = supabase.table('Proveedores').insert(new_proveedor).execute()
        
        if len(response.data) > 0:
            return jsonify(response.data[0]), 201
        else:
            return jsonify({'error': 'Failed to insert record'}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# --- API FOR COMPRAS ---

@app.route('/api/compras', methods=['GET'])
def get_compras():
    try:
        # Join with Proveedores to get the supplier name directly
        response = supabase.table('Compras').select('*, Proveedores(nombre, empresa)').order('fecha', desc=True).execute()
        return jsonify(response.data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/compras', methods=['POST'])
def add_compra():
    data = request.get_json()
    proveedor_id = data.get('proveedor_id')
    monto_total = data.get('monto_total')
    
    if not proveedor_id or not monto_total:
        return jsonify({'error': 'Missing data. Required: proveedor_id, monto_total'}), 400
        
    try:
        new_compra = {
            'proveedor_id': proveedor_id,
            'monto_total': float(monto_total) # Ensure it's a number
        }
        response = supabase.table('Compras').insert(new_compra).execute()
        
        if len(response.data) > 0:
            return jsonify(response.data[0]), 201
        else:
            return jsonify({'error': 'Failed to insert record'}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/compras/export', methods=['GET'])
def export_compras():
    try:
        # Fetch data. In a real app we would apply the same filters as the UI, 
        # but for simplicity we will export all and let the UI pass filters if needed 
        # (For this MVP we export the history)
        
        # We can accept specific provider ID or dates via query params
        proveedor_id = request.args.get('proveedor_id')
        
        query = supabase.table('Compras').select('*, Proveedores(nombre, empresa)').order('fecha', desc=True)
        
        if proveedor_id:
            query = query.eq('proveedor_id', proveedor_id)
            
        response = query.execute()
        compras = response.data
        
        if not compras:
            return "No hay datos para exportar", 404

        # Transform data for pandas
        df_data = []
        for c in compras:
            prov_nombre = c.get('Proveedores', {}).get('nombre', 'Desconocido')
            prov_empresa = c.get('Proveedores', {}).get('empresa', '')
            
            # Format datetime
            fecha_dt = pd.to_datetime(c['fecha']).tz_convert('America/Mexico_City').strftime('%Y-%m-%d %H:%M') if c.get('fecha') else ''
            
            df_data.append({
                'Fecha': fecha_dt,
                'Proveedor': f"{prov_nombre} {('- ' + prov_empresa) if prov_empresa else ''}",
                'Monto ($)': c['monto_total']
            })
            
        df = pd.DataFrame(df_data)
        
        # Calculate totals
        total_gasto = df['Monto ($)'].sum()
        df.loc[len(df)] = ['TOTAL', '', total_gasto] # Append a total row

        # Write to memory
        output = io.BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df.to_excel(writer, index=False, sheet_name='Reporte de Compras')
            
        output.seek(0)
        
        return send_file(
            output,
            mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            as_attachment=True,
            download_name='Reporte_Compras.xlsx'
        )

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Run the app locally on port 5001
    app.run(debug=True, port=5001)
