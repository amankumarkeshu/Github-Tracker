# REST API - Github Tracker

## Running the Project Locally
```
	git clone 
	cd Github-Tracker
	sudo npm install 
	sudo R_Setup.sh
	sudo npm start

```
The project will be available at **http://localhost:3000/**.



## Structure
RESTful API, endpoints (URLs), API has GET, POST features present at the mentioned endpoints. It also has filtering features.

Endpoint |HTTP Method | CRUD Method | Result
-- | -- |-- |--
`/` | GET  | READ | Get Home page
`/` | POST | CREATE | Create a user and repo and search
`/index` | GET | READ | Get a single result



## Screenshot

## API Root
![](static/root.JPG)
<br />

## GET
![](static/postslist.JPG)
<br />

## Post PATCH
![](static/post-id-patch.JPG)
<br />

## Authors/id/posts - Nested
![](static/authors-id-posts.JPG)

## Filter
![](static/filter-post.JPG)
