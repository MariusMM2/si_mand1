drop table if exists auth_log;
CREATE TABLE [auth_log]
(
    [Id]        INTEGER PRIMARY KEY AUTOINCREMENT,
    [UserId]    INTEGER NOT NULL,
    [Code]      TEXT    NOT NULL,
    [Timestamp] DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ([UserId]) REFERENCES [user] (Id)
);

drop table if exists User;
CREATE TABLE [User]
(
    [Id]         INTEGER PRIMARY KEY AUTOINCREMENT,
    [NemID]      TEXT    NOT NULL,
    [CPR]        TEXT    NOT NULL,
    [CreatedAt]  DATE    not null,
    [ModifiedAt] date    not null,
    [GenderId]   integer not null,
    [Email]      text    not null,
    foreign key (GenderId) references Gender (Id)
);

drop table if exists Gender;
create table [Gender]
(
    [Id]    integer primary key autoincrement,
    [Label] text not null
);

drop table if exists Password;
create table [Password]
(
    [Id]           integer primary key autoincrement,
    [UserId]       integer not null,
    [PasswordHash] text    not null,
    [CreatedAt]    date    not null,
    [IsValid]      integer not null,
    foreign key (UserId) references User (Id)
);

insert into Gender(Label) values ('male'), ('female'), ('other');