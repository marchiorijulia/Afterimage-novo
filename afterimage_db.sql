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

drop table tags;

create table tags(
	id int not null auto_increment primary key,
    text varchar(12) not null
);

create table post_tags(
	id int not null auto_increment primary key,
    id_post int not null,
    id_tag int not null,
    created_at timestamp default current_timestamp,
    
    foreign key(id_post) references posts(id),
    foreign key(id_tag) references tags(id)
);

insert into tags(text) values("mar"),
("terreno"),
("paraiso"),
("chuva"),
("sol");

insert into post_tags(id_post,id_tag) values(1,1),
(1,2);

select * from users;

SELECT * FROM posts, users where users.id = posts.user_id

