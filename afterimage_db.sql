create database afterimage_db;
use afterimage_db;

create table users(
	id int auto_increment primary key,
    username varchar(255) unique not null,
    nome varchar(255) not null,
    email varchar(255) unique not null,
    senha varchar(255) not null,
    instituicao boolean not null
);

ALTER TABLE users
ADD descricao varchar(500);

create table posts(
	id int auto_increment primary key,
    user_id int,
    foreign key (user_id) references users(id),
    img varchar(255) not null,
    titulo varchar(255) not null,
    descricao varchar(255),
    data_publicao timestamp,
    ano int, 
    decada int,
    seculo int,
    pais varchar(255),
    sensitive_content boolean not null
);

alter table posts
modify column data_publicao DATETIME DEFAULT(CURRENT_TIMESTAMP());

ALTER TABLE posts
modify COLUMN descricao varchar(500);

create table tags(
	id int auto_increment primary key,
    text varchar(255) unique
);

CREATE TABLE post_tags (
    post_id INT,
    tag_id INT,
    PRIMARY KEY (post_id, tag_id),
    FOREIGN KEY (post_id) REFERENCES posts(id),
    FOREIGN KEY (tag_id) REFERENCES tags(id)
);

SELECT * FROM users;