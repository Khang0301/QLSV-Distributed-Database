/*
    PHASE 3 - QLSV schema
    Machine: Site 1
    Purpose: Create the SQL Server database for Site 1.
*/

USE master;
GO

IF DB_ID(N'QLSV_SITE1') IS NULL
BEGIN
    CREATE DATABASE QLSV_SITE1;
END;
GO

USE QLSV_SITE1;
GO
