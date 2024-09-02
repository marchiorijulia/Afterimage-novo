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

ALTER TABLE
   posts
CHANGE
   data_publicao
   data_publicao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

create table tags(
	id int auto_increment primary key,
    tag_text varchar(255) unique not null,
    post_id int,
    foreign key (post_id) references posts(id)
);

select * from posts;


SELECT * FROM posts, users where users.id = posts.user_id

