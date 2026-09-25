-- Schema del database "topologie".
-- Il file viene eseguito da MySQL solo la prima volta, quando il volume dati
-- è ancora vuoto (docker-entrypoint-initdb.d).

CREATE DATABASE IF NOT EXISTS topologie
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE topologie;

-- Una topologia salvata: il contenitore di dispositivi e connessioni.
CREATE TABLE IF NOT EXISTS topologie (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    creata_il TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB;

-- I dispositivi della topologia. Cancellando la topologia spariscono.
CREATE TABLE IF NOT EXISTS dispositivi (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    topologia_id INT UNSIGNED NOT NULL,
    tipo ENUM('PC', 'Switch', 'Router') NOT NULL,
    nome VARCHAR(50) NOT NULL,
    x INT NOT NULL DEFAULT 0,
    y INT NOT NULL DEFAULT 0,
    ip VARCHAR(15) NOT NULL,
    hostname VARCHAR(50) NOT NULL,
    stato ENUM('Online', 'Offline', 'Manutenzione') NOT NULL DEFAULT 'Offline',
    CONSTRAINT fk_dispositivi_topologia FOREIGN KEY (topologia_id)
        REFERENCES topologie (id) ON DELETE CASCADE
) ENGINE = InnoDB;

-- I collegamenti fra due dispositivi della stessa topologia.
-- La cancellazione a cascata vale sia per la topologia sia per i due capi:
-- se sparisce un dispositivo spariscono anche i suoi collegamenti.
CREATE TABLE IF NOT EXISTS connessioni (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    topologia_id INT UNSIGNED NOT NULL,
    sorgente_id INT UNSIGNED NOT NULL,
    destinazione_id INT UNSIGNED NOT NULL,
    CONSTRAINT fk_connessioni_topologia FOREIGN KEY (topologia_id)
        REFERENCES topologie (id) ON DELETE CASCADE,
    CONSTRAINT fk_connessioni_sorgente FOREIGN KEY (sorgente_id)
        REFERENCES dispositivi (id) ON DELETE CASCADE,
    CONSTRAINT fk_connessioni_destinazione FOREIGN KEY (destinazione_id)
        REFERENCES dispositivi (id) ON DELETE CASCADE
) ENGINE = InnoDB;

-- Dati di esempio: la stessa topologia del laboratorio, per poter provare
-- subito GET /api/topologie/1 senza passare dal frontend.
INSERT INTO topologie (id, nome) VALUES (1, 'Rete laboratorio');

INSERT INTO dispositivi (id, topologia_id, tipo, nome, x, y, ip, hostname, stato) VALUES
    (1, 1, 'Router', 'Router-01', 600, 120, '192.168.1.101', 'router-01', 'Online'),
    (2, 1, 'Switch', 'Switch-01', 600, 340, '192.168.1.102', 'switch-01', 'Online'),
    (3, 1, 'PC', 'PC-01', 360, 560, '192.168.1.103', 'pc-01', 'Online'),
    (4, 1, 'PC', 'PC-02', 840, 560, '192.168.1.104', 'pc-02', 'Offline');

INSERT INTO connessioni (id, topologia_id, sorgente_id, destinazione_id) VALUES
    (1, 1, 1, 2),
    (2, 1, 2, 3),
    (3, 1, 2, 4);
