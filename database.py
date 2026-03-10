import sqlite3

def init_db():
    conn = sqlite3.connect('horarios.db')
    cursor = conn.cursor()

    # Create Empleados table if it doesn't exist
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS Empleados (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            telefono TEXT NOT NULL,
            fecha_ingreso DATE NOT NULL
        )
    ''')

    conn.commit()
    conn.close()
    print("Database and 'Empleados' table initialized successfully.")

if __name__ == "__main__":
    init_db()
