# INSTRUCTIONS FOR PROJECT SETUP
1. Get to the root folder and hit "npm i" to install all the packages.
2. Setup a mongodb. You need to configure the config.json file based on your mongo credentials.
3. Hit the command "npm run create-basic-data". This will fetch some quotes from yahoo finance and fill it in the stocks table. This command also truncates the stocks table before inserting. If you want to skip truncate and go with upsert operation then use "npm run update-basic-data" instead.
4. To start the server without watch, hit "npm run server".
5. Now you can call APIs from POSTMAN.

# PROJSCT INFORMATION
> This project is about tracking portfolios. As per the task instructions only one Portfolio existed, hence there is no model created for Portfolio. There are other 2 models namely Trades and Stocks, where stocks have reference within trades.

> The project is composed with the help of mongoose, express and yahoo-finance2 packages.

> Further APIs can be found within the postman collection which is separately shared. This needs to be imported within the postman app, then try checking the collection documentation.