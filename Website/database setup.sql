DROP DATABASE IF EXISTS 471dbtest;
CREATE DATABASE 471dbtest;
USE 471dbtest;

create table Currency(

	CurrencyId int not null auto_increment primary key,
    CurrencyName varchar(20) not null,
    FromUSD double not null
    
);

create table ACCOUNT(
	accountId int not null auto_increment,
    email varchar(30) not null,
    username varchar(20) not null,
    fName varchar(20) not null,
    lName varchar(20) not null,
    DOB date not null,
    password varchar(32) not null,
    type varchar(20) not null,
	currencyId int,
	balance double,
    
    foreign key(currencyId) references Currency(CurrencyId) ON DELETE SET NULL,
    primary key(accountId, username)
);

create table ADMIN(
	accountId int primary key,
    foreign key(accountId) references Account(accountId) ON DELETE CASCADE
);

create table USER(
	accountId int primary key,
    phoneNumber varchar(20),
    foreign key(accountId) references Account(accountId) ON DELETE CASCADE
);

create table PARTNER(
	accountId int primary key,
    rewardName 	  varchar(20),
    rewardValue   int,
    foreign key(accountId) references Account(accountId) ON DELETE CASCADE
);


create table PaymentMethod(

	PaymentMethodNumber varchar(20) primary key,
    PaymentMethodName varchar(20),
    accountId int,
    
    foreign key(accountId) references Account(accountId) ON DELETE CASCADE
);

create table Friend(

	accountId int Not Null,
    friendAccountd int Not Null,
    
    foreign key(accountId) references USER(accountId) ON DELETE CASCADE,
    foreign key(friendAccountd) references USER(accountId) ON DELETE CASCADE,
    
    primary key(accountId,friendAccountd)
    
);


create table USERREWARD(

	rewardId int not null auto_increment primary key,
    rewardName varchar(30) not null,
    rewardPoints int not null,
    rewardLevel int not null
    
);

create table USEREARN(
	rewardId int not null,
    userId int not  null,
    
    foreign key (userId) references USER(accountId) ON DELETE CASCADE,
    foreign key (rewardId) references userReward(rewardId) ON DELETE CASCADE,
    
    primary key(rewardId, userId)
);

create table COUNTRY(

	countryId int not null primary key auto_increment,
    countryName varchar(25) not null,
    currencyId int not null, # this must be not null
    
    foreign key (currencyId) references currency(currencyId) ON DELETE CASCADE # CASCADE
);

Create table Fee(

	FeeId int not null primary key auto_increment,
    FeeName varchar(30) not null,
    FeeRate double not null,
    countryId int,
    transactionType int not null, # 1 is user and 2 is partner ... 11, 12, 21, 22
    
    foreign key (countryId) references COUNTRY(countryId) ON DELETE CASCADE
);


create table TRANSACTIONS(
	TransId int not null primary key auto_increment,
    SenderId int,
    ReceiverId int,
    Value double not null,
    CurrencyFromSender int not null,
    CurrencyToReceiver int not null,
    FeeId int,
    
    foreign key (SenderId) references Account(accountId) ON DELETE SET NULL,
    foreign key (ReceiverId) references Account(accountId) ON DELETE SET NULL,
    
    foreign key (CurrencyFromSender) references currency(currencyId) ON DELETE CASCADE,
	foreign key (CurrencyToReceiver) references currency(currencyId) ON DELETE CASCADE,
    
    foreign key (FeeId) references Fee(FeeId) ON DELETE SET NULL
);

create table LOCATION(
	LocationId int not null primary key auto_increment,
    AccountId int not null,
    phoneNo varchar(20) not null,
    city varchar(20) not null,
    countryId int not null,
    fName varchar(20) not null,
    lName varchar(20) not null,
	
    foreign key (AccountId) references PARTNER(accountId) ON DELETE CASCADE,
    foreign key (countryId) references COUNTRY(countryId) ON DELETE CASCADE
);

create table HOURS(
	LocationId int not null,
    dayOfWeek  int not null, # Monday 1
    openTime int not null,
    closeTime int not null,
    
    foreign key (LocationId) references LOCATION(LocationId) ON DELETE CASCADE,
    
    primary key(LocationId, dayOfWeek)
);

delete from currency where currencyId > -1;
INSERT into currency values(100, 'N/A', 0);
INSERT into currency values(1, 'USD', 1);
INSERT into currency values(2, 'CAD', 0.75);
INSERT into currency values(3, 'EURO', 1.1);

delete from country where countryId > -1;
INSERT INTO country values(100, 'any', 100);
INSERT into country values(1, 'Canada', 2);
INSERT into country values(2, 'United States', 1);
INSERT into country values(3, 'France', 3);
INSERT into country values(4, 'Germany', 3);
INSERT into country values(5, 'Spain', 3);
INSERT into country values(6, 'Italy', 3);

delete from fee where FeeId > -1;
INSERT into fee values(100, 'zero fee for depositing money', 0, 100, 11);
INSERT into fee values(1, 'what is this', 0.2, 1, 11);
INSERT into fee values(2, 'what is this', 0.2, 1, 12);
INSERT into fee values(3, 'what is this', 0.2, 1, 21);

delete from account where accountId > -1;
INSERT into account values('4',	'demo',	'admin',	'admin',	'last',	'2001-01-20',	'202cb962ac59075b964b07152d234b70',	3,	1,	0);
