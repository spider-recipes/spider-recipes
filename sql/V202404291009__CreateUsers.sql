USE SpiderRecipes;
GO

CREATE TABLE Users (
   user_id INT PRIMARY KEY IDENTITY(1,1),
   username NVARCHAR(50) UNIQUE NOT NULL,
   auth_token VARCHAR(255) UNIQUE NOT NULL,
   created_date DATETIME NOT NULL
);