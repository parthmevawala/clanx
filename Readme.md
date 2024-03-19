# INSTRUCTIONS FOR PROJECT SETUP
1. Get to the root folder and hit "npm i" to install all the packages.
2. Setup a mongodb. You need to configure the config.json file based on your mongo credentials.
3. Hit the command "npm run create-basic-data". This will fetch some quotes from yahoo finance and fill it in the stocks table. This command also truncates the stocks table before inserting. If you want to skip truncate and go with upsert operation then use "npm run update-basic-data" instead. Note: "npm run create-basic-data" must be avoided, as it breaks the stock references in trades.
4. To start the server without watch, hit "npm run server".
5. Now you can call APIs from POSTMAN.

# PROJSCT INFORMATION
> This project is about tracking portfolios. As per the task instructions only one Portfolio existed, hence there is no model created for Portfolio. There are other 2 models namely Trades and Stocks, where stocks have reference within trades.

> The project is composed with the help of mongoose, express and yahoo-finance2 packages.

> Further APIs can be found within the postman collection which is separately shared. This needs to be imported within the postman app, then try checking the collection documentation.

# SCHEMA PLAN
> Its a simple plan, assuming that there is only one Portfolio, there was no need of creating a separate portfolio model. There were to be multiple portfolios, its reference would have been added to the Trades. Hence, there are 2 models.

> Stocks: The plan is to fetch quotes from yahoo finance and store it into stocks. It stores regular market price, stock symbol as unique identifier and then the name.

> Trades: Trades here store all the transactions for a particular stock. Hence, it stores trade type (buy / sell), quantity, price per unit, trade date and most importantly stock id to identify for which stock it is. If there were more portfolios then their references would have been stored here too.

> Generatively, I have also created timestamps for each table. But, one thing there is missing is the soft delete functinality. I think it wasn't required for test project, but it could have been done.