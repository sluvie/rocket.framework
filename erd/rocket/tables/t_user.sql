create table t_user (
    userid uniqueidentifier default newid() not null,
    name varchar(100) not null default(''),
    username varchar(20) not null default(''),
    [password] varchar(20) not null default(''),
    secretkey varchar(50) not null default(''),
    publickey varchar(50) not null default(''),
    deleteflag int not null default(0),
    createdby varchar(10) null,
    createddate datetime null,
    modifby varchar(10) null,
    modifieddate datetime null,
    constraint pk_t_user_userid primary key(userid)
);


-- admin
insert into t_user values(newid(), 'ADMINISTRATOR', 'admin', 'admin01', newid(), newid(), 0, 'admin', getdate(), null, null);