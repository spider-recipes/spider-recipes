USE SpiderRecipes;
GO

CREATE TABLE Tags (
    tag_id INT PRIMARY KEY IDENTITY(1,1),
    tag_name VARCHAR(50) UNIQUE NOT NULL
);