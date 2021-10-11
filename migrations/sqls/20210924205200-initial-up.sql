CREATE TABLE IF NOT EXISTS users (
    id INT(10) NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(100) DEFAULT NULL,
    last_name VARCHAR(100) DEFAULT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(300) NOT NULL,
    active TINYINT(1) NOT NULL DEFAULT 0,
    activation_link VARCHAR(300) DEFAULT NULL,
    avatar_path VARCHAR(300) DEFAULT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB CHARSET=utf8;

CREATE TABLE IF NOT EXISTS tokens (
    id INT(10) NOT NULL AUTO_INCREMENT,
    user_id INT(10) NOT NULL,
    token VARCHAR(300) NOT NULL,
    refresh_token VARCHAR(300) NOT NULL,
    PRIMARY KEY (id),

    CONSTRAINT fk_tokens_users_id
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB CHARSET=utf8;

CREATE TABLE IF NOT EXISTS tracks (
    id INT(10) NOT NULL AUTO_INCREMENT,
    user_id INT(10) NOT NULL,
    name VARCHAR(100) NOT NULL,
    path VARCHAR(300) NOT NULL,
    PRIMARY KEY (id),

    CONSTRAINT fk_tracks_users_id
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB CHARSET=utf8;