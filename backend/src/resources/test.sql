
-- Création de la base de données
CREATE DATABASE test;

-- Connexion à la base de données
\c test;

-- Extension pour générer des UUID si nécessaire
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table des utilisateurs (administrateurs du système)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, 
    email VARCHAR(100) UNIQUE,
    full_name VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    role VARCHAR(20) DEFAULT 'user', 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE
);

-- Table des départements
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insertion des départements par défaut
INSERT INTO departments (name) VALUES 
    ('IT'),
    ('Design'),
    ('Management'),
    ('RH'),
    ('Marketing'),
    ('Finance');

-- Table des postes/positions
CREATE TABLE positions (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    department_id INTEGER REFERENCES departments(id),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(title, department_id)
);

-- Insertion des positions par défaut
INSERT INTO positions (title, department_id) VALUES 
    ('Développeur Frontend', 1),
    ('Développeur Backend', 1),
    ('Designer UX/UI', 2),
    ('Chef de Projet', 3),
    ('Ressources Humaines', 4);

-- Table des statuts d'employé
CREATE TABLE employee_statuses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    color VARCHAR(20) -- Pour stocker les codes de couleur (ex: "bg-green-500")
);

-- Insertion des statuts par défaut
INSERT INTO employee_statuses (name, color) VALUES 
    ('Actif', 'bg-green-500'),
    ('En congé', 'bg-yellow-500'),
    ('Absent', 'bg-red-500');

-- Table principale des employés
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    position_id INTEGER REFERENCES positions(id),
    department_id INTEGER REFERENCES departments(id),
    status_id INTEGER REFERENCES employee_statuses(id),
    join_date DATE NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    address TEXT,
    performance_rating INTEGER CHECK (performance_rating BETWEEN 0 AND 100), -- Pour la barre de performance
    avatar TEXT, -- Pour stocker le chemin d'accès à l'avatar ou une URL
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    updated_by INTEGER REFERENCES users(id)
);

-- Table pour les congés des employés
CREATE TABLE employee_leaves (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    type VARCHAR(50), -- Maladie, Congés payés, etc.
    reason TEXT,
    approved BOOLEAN DEFAULT FALSE,
    approved_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table pour l'historique des modifications
CREATE TABLE employee_history (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(id),
    field_name VARCHAR(50) NOT NULL, -- Quel champ a été modifié
    old_value TEXT,
    new_value TEXT,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    changed_by INTEGER REFERENCES users(id)
);

-- Fonction pour mettre à jour le timestamp "updated_at"
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour automatiquement "updated_at" dans les tables
CREATE TRIGGER update_employees_modtime
BEFORE UPDATE ON employees
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_departments_modtime
BEFORE UPDATE ON departments
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_positions_modtime
BEFORE UPDATE ON positions
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();



-- Vue pour obtenir les données complètes des employés
CREATE VIEW employee_details AS
SELECT 
    e.id,
    e.name,
    p.title AS position,
    d.name AS department,
    s.name AS status,
    s.color AS status_color,
    e.join_date,
    e.email,
    e.phone,
    e.performance_rating,
    e.updated_at,
    EXTRACT(MONTH FROM AGE(CURRENT_DATE, e.join_date)) AS months_of_service
FROM 
    employees e
JOIN 
    positions p ON e.position_id = p.id
JOIN 
    departments d ON e.department_id = d.id
JOIN 
    employee_statuses s ON e.status_id = s.id;


-- Note: Dans un environnement réel, utilisez un hachage de mot de passe approprié
INSERT INTO users (username, password, email, full_name, role) 
VALUES ('admin', '$2a$10$rRyOiSUxMG1PJ7eBnYKiAu20vg6XYm0tYI9Iz5qY4TLdIiNhCcpWm', 'admin@example.com', 'Administrateur Système', 'admin');

-- Insérer des exemples d'employés
INSERT INTO employees (name, position_id, department_id, status_id, join_date, email, performance_rating) 
VALUES 
    ('Sophie Martin', 1, 1, 1, '2023-03-15', 'sophie.martin@example.com', 78),
    ('Thomas Bernard', 2, 1, 1, '2023-01-10', 'thomas.bernard@example.com', 85),
    ('Camille Dubois', 3, 2, 2, '2022-11-05', 'camille.dubois@example.com', 72),
    ('Lucas Petit', 4, 3, 1, '2022-08-22', 'lucas.petit@example.com', 90),
    ('Emma Leroy', 5, 4, 3, '2023-02-14', 'emma.leroy@example.com', 65);