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
    [NemId]      TEXT    NOT NULL,
    [Cpr]        TEXT    NOT NULL,
    [CreatedAt]  DATE    default CURRENT_TIMESTAMP,
    [ModifiedAt] date    default CURRENT_TIMESTAMP,
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
    [CreatedAt]    date    default CURRENT_TIMESTAMP,
    [IsValid]      integer not null default true,
    foreign key (UserId) references User (Id)
);

insert into Gender(Label) values ('male'), ('female'), ('other');
insert into User(NemId, Cpr, GenderId, Email) values ('hello', 'world', 0, 'hello@email.com');
insert into Password(UserId, PasswordHash, IsValid) values (1, '$2b$10$I1iT0m/8kZI2N6SdY8nJK.ORMBQ9flD882m1SAkUU0EthNr5GV1mG', true);
