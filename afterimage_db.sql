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

create table tags(
	id int auto_increment primary key,
    text varchar(255) unique
);

-- versão anterior da tabela que linka
-- create table tags_post(
-- 	id_post int,
--     id_tag int,
--     foreign key (id_post) references posts(id),
--     foreign key (id_tag) references tags(id)
-- );

/*
insert no post > pega o id do post
insert na tag ou se a tag já existe > pega o id da tag
insert em tags_post
*/

ALTER TABLE
   posts
drop
   tags_text;

select * from posts;

CREATE TABLE post_tags (
    post_id INT,
    tag_id INT,
    PRIMARY KEY (post_id, tag_id),
    FOREIGN KEY (post_id) REFERENCES posts(id),
    FOREIGN KEY (tag_id) REFERENCES tags(id)
);

SELECT * FROM posts, users where users.id = posts.user_id